# ADR 0003: Mitigación de Manipulación de Precios y RBAC Multi-Tenant

## Estado
Aceptado

## Contexto
En arquitecturas e-commerce donde el cliente envía un arreglo de productos a endpoints de órdenes o pasarelas de pago, existe el riesgo crítico de manipulación de parámetros (Price Parameter Tampering — OWASP A04). Asimismo, en un entorno multi-tenant es vital asegurar que los gerentes de tienda solo puedan modificar recursos de su propia boutique.

## Decisión
1. **Cálculo Canónico en Servidor:** Los endpoints `/api/orders` y `/api/checkout/mercadopago/preference` toman únicamente `productId` y `quantity` del cliente; el `price` unitario y el total se obtienen exclusivamente del catálogo oficial en el servidor.
2. **RBAC y Aislamiento por Tenant:** Implementar `authGuard.js` para validar tokens Bearer y asegurar que `auth.storeId === targetStoreId` para gerentes, o `auth.isSuperAdmin` para administradores globales.
3. **Endurecimiento de Supabase Storage:** Exigir `TO authenticated` en políticas RLS de `storage.objects`.

## Consecuencias
- **Positivas:** Eliminación absoluta de compras fraudulentas con precios alterados y protección integral de los datos entre boutiques.
- **Negativas:** Requerimiento estricto de autenticación para todas las operaciones mutantes.
