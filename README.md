# 📱 CelStore™ 3D — Plataforma E-Commerce Multi-Tienda de Celulares (Production Ready)

> **Ecosistema de comercio electrónico multi-tienda de celulares de alta gama con estética Apple SF Pro, visor 3D interactivo 360° con Lazy Loading y Fallback WebGL, segmentación generacional (Últimos 2 Años vs Clásicos Vintage), base de datos multi-tenant PostgreSQL/Supabase con Row Level Security (RLS), control de stock atómico anti-concurrencia, pasarela MercadoPago SDK, SEO dinámico OpenGraph y panel de administración modular.**

---

## 🌟 Arquitectura para Producción

```mermaid
graph TD
    subgraph Base de Datos Multi-Tenant (PostgreSQL + Supabase RLS)
        STORES[Tabla: stores]
        PRODUCTS[Tabla: products con store_id]
        ORDERS[Tabla: orders con store_id]
        
        RLS[Row Level Security: store_id = auth.jwt.store_id]
        RLS --> PRODUCTS
        RLS --> ORDERS
        
        STOCK_LOCK[Función SQL Atómica: decrease_stock_atomic con FOR UPDATE]
        STOCK_LOCK --> PRODUCTS
    end

    subgraph Frontend de Alto Rendimiento
        LAZY_3D[Lazy Loading Three.js + WebGL Error Boundary]
        SEO_OG[SEO Dinámico & OpenGraph Meta Tags para WhatsApp]
        CART_GUARD[Guardián de Aislamiento Multi-Tenant de Carrito]
        MP_CHECKOUT[MercadoPago SDK + Pedido 1-Clic WhatsApp]
    end

    subgraph Panel de Administración Modular (Anti God-Component)
        SHELL[AdminDashboard.jsx Orchestrator]
        SHELL --> LIST[ProductList.jsx - Draft/Publicado & Filtros]
        SHELL --> FORM[ProductFormModal.jsx con Validación Zod]
        SHELL --> DUP[Duplicador de Productos en 1 Clic]
        SHELL --> BULK[BulkStockEditor.jsx - Editor Masivo de Stock/Precios]
        SHELL --> UPLOAD[ImageUploader.jsx - Supabase Storage]
        SHELL --> AI_SOL[Generador Asistido de Textos de Solución]
    end
```

---

## 🚀 Características Clave Implementadas

### 1. 🗄️ Base de Datos Multi-Tenant & RLS en PostgreSQL
- **Aislamiento Seguro por `store_id`**: Políticas de Row Level Security (RLS) garantizan que cada comerciante solo acceda y modifique los productos y pedidos de su propia sucursal.
- **Control de Stock Atómico**: Función PL/pgSQL `decrease_stock_atomic` con bloqueo de fila `FOR UPDATE` para eliminar sobreventas y condiciones de carrera en compras simultáneas.
- Archivo de migración listo en `supabase/migrations/20260828_init_multitenant.sql`.

### 2. 🧩 Panel de Administración Modular (Arquitectura Limpia)
- Descompuesto en subcomponentes especializados en `src/views/admin/components/`:
  - `ProductList.jsx`: Listado con buscador, filtros y badges de estado.
  - `ProductFormModal.jsx`: Formulario con validación estricta Zod, estados **Borrador (`draft`) / Publicado (`published`)**.
  - `ImageUploader.jsx`: Carga de fotos a Supabase Storage con dropzone y preview interactivo.
  - `BulkStockEditor.jsx`: Editor en línea para modificar stocks y precios masivamente sin abrir modales.
  - `ProductDuplicator.jsx`: Clonación de productos en 1 solo clic.
  - `StoreSettingsForm.jsx`: Personalización de banners, logotipos y WhatsApp oficial.
  - `OrdersTracker.jsx`: Registro de pedidos y botón de contacto al cliente.

### 3. ⚡ Rendimiento WebGL, LCP & Fallback 2D
- **Lazy Loading de Three.js**: Separación del bundle 3D (485 KB) del bundle principal (333 KB), logrando una carga ultrarrápida en redes móviles.
- **WebGL Error Boundary**: Si el dispositivo del usuario no soporta WebGL o está en modo ahorro de energía extremo, conmuta automáticamente a una galería 2D de alta resolución.

### 4. 🌐 SEO Dinámico & OpenGraph para WhatsApp
- Componente `SEOHead.jsx` que inyecta dinámicamente `<title>`, `<meta name="description">` y etiquetas `og:image`, `og:title` y `og:description` por producto y por tienda.
- Compartir cualquier celular por WhatsApp o redes sociales muestra una tarjeta rica con foto, precio y beneficios.

### 5. 🛡️ Guardián de Carrito Multi-Tenant
- Previene la mezcla accidental de productos de diferentes comerciantes en una misma orden.
- Despliega un modal inteligente al intentar comprar en otra tienda para resolver el conflicto de forma transparente.

### 6. 💳 Pasarela de Pagos MercadoPago SDK & Pedidos WhatsApp
- Endpoint `/api/payments/mercadopago/create-preference` para checkout transparente / redirección a MercadoPago.
- Webhook receptor IPN `/api/payments/mercadopago/webhook`.
- Pedido directo por WhatsApp en 1 clic con mensaje formateado.

---

## 🧪 Suite de Pruebas Automatizadas (Vitest)

Ejecutar tests unitarios y de concurrencia:
```bash
npm test
```

- `tests/stock-concurrency.test.js`: Comprobación de locks atómicos contra compras concurrentes.
- `tests/cart-multitenant.test.js`: Verificación de aislamiento del carrito entre sucursales.
- `tests/product-validation.test.js`: Validación de esquemas Zod (precios positivos, stock no negativo).

---

## 🚀 Puesta en Marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar entorno de desarrollo (Frontend + Backend)
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🔑 Credenciales de Acceso

| Tienda / Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| 📱 **CelStore Flagships** | `admin@celstore.com` | `password123` |
| 📟 **RetroMobile Vault** | `admin@retromobile.com` | `password123` |
| ⚡ **TechNova MegaStore** | `admin@technova.com` | `password123` |
| 👑 **SuperAdmin Global** | `superadmin@platform.com` | `admin123` |
