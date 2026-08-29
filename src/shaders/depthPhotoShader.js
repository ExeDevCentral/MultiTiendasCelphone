/**
 * Shaders GLSL para renderizado de Fotos 3D con desplazamiento por Depth Map.
 * Optimizado para planos subdivididos con degradé de bordes para evitar artefactos de corte.
 */

export const depthVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vNormal;
  
  uniform sampler2D uDepthMap;
  uniform float uDisplacementScale;

  void main() {
    vUv = uv;
    vNormal = normal;

    // Muestreo del depth map en escala de grises (0.0 = fondo / 1.0 = primer plano)
    vec4 depthColor = texture2D(uDepthMap, uv);
    float depth = depthColor.r;
    vDepth = depth;

    // Desplazamiento equilibrado en Z pivotado en el centro del plano
    vec3 displacedPosition = position;
    displacedPosition.z += (depth - 0.5) * uDisplacementScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  }
`;

export const depthFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  varying vec3 vNormal;

  uniform sampler2D uTexture;
  uniform float uEdgeFade;

  void main() {
    vec4 color = texture2D(uTexture, vUv);

    // Suavizado en los 4 bordes para un acabado suave sin cortes duros
    float edgeFactorX = smoothstep(0.0, uEdgeFade, vUv.x) * smoothstep(1.0, 1.0 - uEdgeFade, vUv.x);
    float edgeFactorY = smoothstep(0.0, uEdgeFade, vUv.y) * smoothstep(1.0, 1.0 - uEdgeFade, vUv.y);
    float alpha = edgeFactorX * edgeFactorY;

    // Tinte sutil de profundidad para volumen fotográfico de estudio
    float studioLighting = 0.96 + 0.08 * vDepth;

    gl_FragColor = vec4(color.rgb * studioLighting, color.a * alpha);
  }
`;
