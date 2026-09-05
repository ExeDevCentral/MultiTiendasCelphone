import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, brand, modelYear, generationCategory, type, keyFeature } = await request.json();

    let solutions = [];
    const year = parseInt(modelYear, 10) || 2024;

    if (generationCategory === 'vintage_classic' || year < 2018) {
      solutions = [
        {
          id: `sol-${Date.now()}-1`,
          title: 'Desconexión Total y Bienestar Mental',
          badge: 'Detox Digital',
          icon: 'HeartHandshake',
          description: `Sin algoritmos, feeds infinitos ni notificaciones estresantes. Mantén solo llamadas prioritarias y mensajes esenciales con ${name || 'este teléfono clásico'}.`,
        },
        {
          id: `sol-${Date.now()}-2`,
          title: 'Autonomía Insuperable de Días Completos',
          badge: 'Batería Legendaria',
          icon: 'BatteryCharging',
          description: 'Sal de viaje un fin de semana completo o vete de acampada sin preocuparte por llevar cables ni buscar tomas de corriente.',
        },
        {
          id: `sol-${Date.now()}-3`,
          title: 'Resistencia Mecánica Indestructible',
          badge: 'Construcción Legendaria',
          icon: 'ShieldAlert',
          description: 'Fabricación robusta pensada para durar décadas, resistir caídas cotidianas y mantener su valor como objeto de colección icónico.',
        },
      ];
    } else {
      solutions = [
        {
          id: `sol-${Date.now()}-1`,
          title: 'Estudio de Creación y Cine en tu Bolsillo',
          badge: 'Fotografía & Video Pro',
          icon: 'Camera',
          description: 'Captura tomas con rango dinámico profesional, estabilización óptica avanzada y nitidez 4K perfecta para redes sociales y recuerdos inolvidables.',
        },
        {
          id: `sol-${Date.now()}-2`,
          title: 'Batería Inteligente de Larga Duración',
          badge: 'Productividad Sin Pausas',
          icon: 'Zap',
          description: 'Llega al final de tu jornada más intensa con energía de sobra gracias a la optimización de hardware y carga hiperrápida.',
        },
        {
          id: `sol-${Date.now()}-3`,
          title: 'Fluidez Absoluta y Cero Tiempos de Espera',
          badge: 'Rendimiento & Gaming',
          icon: 'Cpu',
          description: 'Multitarea instantánea, edición de video pesada y videojuegos exigentes con tasa de refresco ultra suave sin sobrecalentamiento.',
        },
        {
          id: `sol-${Date.now()}-4`,
          title: 'Acabado de Lujo y Materiales Aeroespaciales',
          badge: 'Diseño & Durabilidad',
          icon: 'ShieldCheck',
          description: 'Chasis ergonómico de alta resistencia con protección contra agua y polvo, diseñado para mantener su belleza y rendimiento por años.',
        },
      ];
    }

    if (keyFeature) {
      solutions.unshift({
        id: `sol-${Date.now()}-custom`,
        title: `Especialidad: ${keyFeature}`,
        badge: 'Diferenciador Clave',
        icon: 'Sparkles',
        description: `Optimizado específicamente para ofrecer la mejor experiencia en ${keyFeature} sin compromisos.`,
      });
    }

    return NextResponse.json({ solutions });
  } catch (error) {
    console.error('POST /api/generate-solutions:', error);
    return NextResponse.json({ error: 'Error al generar soluciones' }, { status: 500 });
  }
}