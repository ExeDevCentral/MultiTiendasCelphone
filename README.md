# Multi-Store POS System (Multi-Tiendas) 🚀

A scalable, multi-tenant Point of Sale (POS) system designed for efficiency, performance, and cross-platform monitoring. Built with **Laravel 11** and **Vue.js 3**, optimized for low-performance devices like tablets.

## ✨ Features

- **Multi-Tenancy**: Support for multiple organizations and store locations within each organization.
- **Robust POS Interface**: Streamlined sales process with product scanning and quick lookup.
- **Inventory Management**: Real-time stock tracking across multiple stores.
- **Role-Based Access Control (RBAC)**: Secure access management using Spatie permissions.
- **Performance Optimized**:
  - Lazy loading and code splitting for fast tablet performance.
  - Bundle size analysis with a built-in heatmap (`stats.html`).
- **Advanced Monitoring**:
  - **Backend Request Logging**: Performance profiling for every request.
  - **Client-Side Error Tracking**: Captures frontend stack traces and reports them to the server.
- **Dockerized Environment**: Ready for production-like local development with Nginx, PHP 8.3, MySQL 8.0, and Redis.

## 🛠️ Technology Stack

- **Backend**: Laravel 12, Sanctum (Auth), Spatie Permission (RBAC), Redis (Cache/Session).
- **Frontend**: Vue.js 3 (Composition API), Vite (Build tool), Tailwind CSS 3 (Styling), Pinia (State), Vue Router.
- **Infrastructure**: Docker Desktop, Nginx Proxy.

## 🚀 Quick Start

### 1. Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Setup
Clone the repository and run the startup script:

```bash
# levantamos los contenedores
docker-compose up -d --build

# instamos las dependencias
docker-compose exec -T backend composer install
docker-compose exec -T backend php artisan key:generate
docker-compose exec -T backend php artisan migrate:fresh --seed

# instalamos el frontend
docker-compose exec -T node npm install
docker-compose exec -T node npm run build
```

### 3. Access
- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost/api`
- **Dashboard Demo**: `admin@demo.com` / `password`

## 📊 Monitoring
- **Bundle Heatmap**: Run `npm run build` and open `src/frontend/stats.html`.
- **Performance Logs**: Check the `request_logs` table in the database.
- **Error Logs**: Check the `client_error_logs` table for frontend crashes.

---
Developed with ❤️ by [ExeDevCentral](https://github.com/ExeDevCentral)
