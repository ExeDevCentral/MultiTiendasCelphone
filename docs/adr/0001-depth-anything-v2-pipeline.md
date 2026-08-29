# ADR 0001: Pipeline de Estimación de Profundidad con Depth Anything V2

## Estado
Aceptado

## Contexto
Para ofrecer una experiencia interactiva tridimensional inmersiva sin exigir modelos 3D pesados (.glb / .gltf de decenas de megabytes), se requería una técnica ligera para convertir fotos 2D de alta resolución de smartphones en objetos tridimensionales interactivos en GPU.

## Decisión
Implementar un pipeline de inferencia basado en el modelo *Depth Anything V2*, procesado de forma asíncrona mediante Edge Functions y persistido en Supabase Storage (`product-media`). El frontend renderiza el mapa de profundidad usando shaders personalizados GLSL (`depthPhotoShader.js`) con cálculo de parallax y respuesta a la luz.

## Consecuencias
- **Positivas:** Reducción del tamaño de assets de ~20MB a <300KB por producto. Carga ultrarrápida a 60 FPS en GPU móvil.
- **Negativas:** Requiere generación previa de mapas de profundidad por producto o fallback inmediato mientras procesa.
