# 📱 CelStore™ 3D — Plataforma E-Commerce Multi-Tienda de Celulares

> **Ecosistema de comercio electrónico de celulares de alta gama con estética Apple SF Pro, visor 3D interactivo 360°, segmentación generacional (Últimos 2 Años vs Clásicos Vintage), storytelling orientado a soluciones para el usuario, mini-tienda de accesorios y panel de administración multi-tienda (multi-tenant) con login independiente por sucursal.**

---

## 🌟 Características Principales

### 1. 🚀 Segmentación Generacional Inteligente
- **Últimos 2 Años (2024 - 2026)**: Buques insignia en Titanio grado aeroespacial (iPhone 16 Pro Max, Samsung Galaxy S25 Ultra, Google Pixel 9 Pro XL, Xiaomi 14T Pro).
- **Generaciones Recientes (2020 - 2023)**: Opciones de alto rendimiento y mejor relación costo/beneficio (iPhone 14 Pro, etc.).
- **Clásicos & Vintage Legends (1998 - 2012)**: Joyas de la telefonía para coleccionistas y detox digital (Nokia 3310 con Snake II, Motorola RAZR V3 Clamshell, Sony Ericsson Walkman W810i, BlackBerry Bold 9900 QWERTY).
- **Línea de Tiempo Interactiva**: Recorrido visual por un cuarto de siglo de evolución móvil.

### 2. 🎮 Visor 3D Interactivo 360° (Three.js PBR Studio)
- Render 3D en tiempo real con iluminación physically-based:
  - **Smartphone Moderno**: Acabados en Titanio Natural, Negro Espacial, Blanco Desierto y Azul Profundo con reflejos realistas en cámara triple de 48MP y pantalla OLED activa.
  - **Nokia Barra Clásico**: Chasis retro con pantalla LCD verde retroiluminada y preview jugable del Snake II.
  - **Motorola RAZR Flip**: Bisagra abatible de aluminio y pantallas duales.
- Controles orbitales con mouse y táctil (girar 360°, zoom en lentes de cámara, encendido de pantalla y cambio de acabados al vuelo).

### 3. 🎯 Storytelling: "¿Qué soluciona para ti?" (Filosofía Apple)
En lugar de fichas técnicas frías e incomprensibles, cada producto cuenta con tarjetas estilo Bento destacando soluciones para la vida:
- 📸 **Creadores & Fotografía**: Producción de video 4K cinematográfico sin equipos pesados.
- ⚡ **Autonomía Extrema**: Baterías para todo el día y cargas hiperrápidas de 120W (100% en 19 min).
- 🧘 **Detox Digital & Resistencia (Vintage)**: Batería de 2 semanas, resistencia legendaria a caídas y cero notificaciones adictivas.
- 💼 **Productividad Ejecutiva**: Firma de contratos con S-Pen y traducción de llamadas en vivo con IA.

### 4. 🏬 Arquitectura Multi-Tienda (Multi-Tenant)
- **Sucursales Afiliadas**:
  - `CelStore™ Flagship & Apple Hub` (Especializada en últimos 2 años)
  - `RetroMobile & Vintage Vault` (Especializada en leyendas clásicas de colección)
  - `TechNova MegaStore & Accesorios` (Catálogo híbrido y accesorios universales)
- Cada tienda cuenta con su propia base de datos, inventario, precios, banners, calificaciones y canal de WhatsApp dedicado.

### 5. 🔒 Portal de Administración & Asistente IA de Redacción
- Login independiente para cada dueño de tienda (`/admin/login`) y SuperAdmin global.
- Carga y edición rápida de productos nuevos y vintage.
- ✨ **Generador Asistido de Textos de Soluciones**: Redacta automáticamente los argumentos emocionales y de productividad para la ficha del celular con 1 solo clic.
- Control de stock en tiempo real, cambio de banner de tienda y seguimiento de pedidos.

### 6. ⚡ Mini-Tienda de Accesorios & Checkout Rápido
- Sección dedicada a cargadores GaN 65W, bases MagSafe 3-en-1, fundas de fibra de aramida aeroespacial, auriculares ANC y cargadores vintage de aguja.
- Cross-selling de combos con descuento automático.
- **Compra en 1 Clic por WhatsApp**: Genera mensaje listo y formateado con sucursal, modelo, acabados y dirección.
- **Simulador de Checkout SSL**: Pago con Tarjeta, Apple Pay o Cripto con recibo imprimible y celebración de confeti.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **3D Engine**: Three.js (WebGL, PBR Materials, Orbit Controls, Texturas Dinámicas de Pantalla).
- **Backend**: Node.js, Express REST API, CORS.
- **Persistencia**: Data Store JSON Multi-Tenant con aislamiento por `store_id` y sincronización local de alta resiliencia.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio:
```bash
git clone https://github.com/ExeDevCentral/MultiTiendasCelphone.git
cd MultiTiendasCelphone
```

### 2. Instalar dependencias:
```bash
npm install
```

### 3. Iniciar el servidor (Frontend + Backend concurrentes):
```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Credenciales de Demostración (Panel de Administración)

| Rol / Tienda | Correo | Contraseña |
| :--- | :--- | :--- |
| 📱 **CelStore Flagships** | `admin@celstore.com` | `password123` |
| 📟 **RetroMobile Vault** | `admin@retromobile.com` | `password123` |
| ⚡ **TechNova MegaStore** | `admin@technova.com` | `password123` |
| 👑 **SuperAdmin Global** | `superadmin@platform.com` | `admin123` |

---

## 📄 Licencia
Este proyecto está licenciado bajo la Licencia MIT.
