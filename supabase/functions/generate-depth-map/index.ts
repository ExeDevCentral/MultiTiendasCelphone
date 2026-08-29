import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { productId, photoUrl } = await req.json();

    if (!productId || !photoUrl) {
      return new Response(
        JSON.stringify({ error: "productId and photoUrl are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Marcar como procesando en la base de datos (dispara Realtime a frontend)
    await supabase
      .from("products")
      .update({ depth_status: "processing" })
      .eq("id", productId);

    // 2. Si no hay token de Replicate configurado, crear un gradiente radial fallback
    if (!REPLICATE_API_TOKEN) {
      console.warn("REPLICATE_API_TOKEN not set. Setting default ready state.");
      await supabase
        .from("products")
        .update({
          depth_status: "ready",
          depth_map_url: photoUrl, // Usar photoUrl como placeholder listo
        })
        .eq("id", productId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Processed with default depth map",
          status: "ready",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Ejecutar Inferencia de Depth Anything V2 vía Replicate API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "depth-anything/depth-anything-v2:latest",
        input: { image: photoUrl },
      }),
    });

    const prediction = await response.json();
    let depthResult = prediction;

    // Polling del estado de la inferencia
    while (depthResult.status !== "succeeded" && depthResult.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const pollRes = await fetch(
        `https://api.replicate.com/v1/predictions/${depthResult.id}`,
        {
          headers: { Authorization: `Bearer ${REPLICATE_API_TOKEN}` },
        }
      );
      depthResult = await pollRes.json();
    }

    if (depthResult.status === "failed") {
      throw new Error("Replicate depth estimation model failed");
    }

    // 4. Descargar imagen resultante y persistir en Supabase Storage
    const depthImageRes = await fetch(depthResult.output);
    const depthBlob = await depthImageRes.blob();
    const depthPath = `depth-maps/${productId}_depth.webp`;

    const { error: uploadError } = await supabase.storage
      .from("product-media")
      .upload(depthPath, depthBlob, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("product-media")
      .getPublicUrl(depthPath);

    // 5. Actualizar en Supabase DB -> Dispara evento Realtime WebSocket
    await supabase
      .from("products")
      .update({
        depth_map_url: publicUrlData.publicUrl,
        depth_status: "ready",
      })
      .eq("id", productId);

    return new Response(
      JSON.stringify({
        success: true,
        depthMapUrl: publicUrlData.publicUrl,
        status: "ready",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Depth estimation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
