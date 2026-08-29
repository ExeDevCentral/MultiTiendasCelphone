# ADR 0002: Ciclo de Vida y Lazy Loading de Canvas 3D en React Three Fiber

## Estado
Aceptado

## Contexto
La inclusión de Three.js y React Three Fiber en el bundle principal incrementa el JavaScript inicial afectando las métricas de Core Web Vitals (LCP y FID). Además, algunos dispositivos móviles o navegadores tienen WebGL deshabilitado.

## Decisión
1. Cargar el componente `PhoneViewer3D` mediante `React.lazy` / dynamic imports de Next.js.
2. Implementar un `WebGLErrorBoundary` que detecte incompatibilidades y renderice una galería interactiva 2D como fallback sin interrumpir la navegación.
3. Pausar el render loop cuando el canvas 3D no está en el viewport visible para ahorrar batería.

## Consecuencias
- **Positivas:** LCP inferior a 1.2 segundos y experiencia accesible en cualquier hardware.
- **Negativas:** Breve transición mientras el módulo 3D es descargado bajo demanda.
