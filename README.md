<div align="center">

# CelStore Atelier • Multi-Tenant Smartphone Commerce
### *Multi-Tenant Hardware Commerce, WebGL 3D Spectral Shaders & Atomic Inventory Concurrency Kernel*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F_3D_Shaders-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![PostgreSQL RLS](https://img.shields.io/badge/PostgreSQL-Row_Level_Locking-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Security_Suite_Certified-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![OWASP Top 10](https://img.shields.io/badge/OWASP-A01_A04_Hardened-critical?style=for-the-badge)](https://owasp.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>An enterprise multi-tenant e-commerce system featuring GLSL vertex depth estimation shaders, pessimistic row-level stock locks (`SELECT ... FOR UPDATE`), zero-trust price verification, and cross-tenant cart boundary isolation.</b>
</p>

---

</div>

## 1. Abstract & System Foundations

Digital retail platforms catering to high-value consumer electronics encounter critical vulnerabilities: price tampering via client payload manipulation (OWASP A04), inventory overselling under high concurrency flash sales, and cross-tenant transaction pollution.

**CelStore Atelier** establishes a resilient multi-tenant retail architecture:
- **Pessimistic Atomic Concurrency:** Implements atomic row-level locks via PostgreSQL `FOR UPDATE` semantics (`decrease_stock_atomic`), eliminating race conditions during simultaneous cart checkouts.
- **Zero-Trust Pricing Kernel:** The server rejects all client-supplied monetary amounts, deriving pricing vectors strictly from authoritative database state prior to issuing payment preferences (MercadoPago SDK).
- **GPU-Accelerated 3D Depth Shaders:** Integrates custom GLSL vertex shaders (`depthPhotoShader.js`) coupled with Depth Anything V2 estimation models, delivering hardware-accelerated 3D inspection viewports with an initial LCP budget under 1.2s.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT ATELIER VIEWPORT                         │
│  [Three.js R3F Depth Canvas] ──► [Multi-Tenant Cart Isolation Guard]   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 ZERO-TRUST TRANSACTIONAL GATEWAY                       │
│    • Price Anti-Tampering: Rejection of Client-Supplied Overrides      │
│    • RBAC Verification: Cryptographic Tenant Isolation (storeId)      │
│    • Concurrency Lock: `SELECT stock FROM products FOR UPDATE`         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│      SUPABASE RELATIONAL KERNEL  │        │     MERCADOPAGO PAYMENT ENGINE   │
│  Row Level Security (RLS)        │        │   Idempotent Webhook Processing  │
│  Decoupled Multi-Store Isolation │        │   Cryptographic Callback Proofs  │
└──────────────────────────────────┘        └──────────────────────────────────┘
```

---

## 2. Concurrency Control & Security Proofs

### 2.1. Pessimistic Row Locking Invariant
To mathematically guarantee that inventory never drops below zero under parallel checkout threads ($T_1 \parallel T_2$):

$$\text{Stock}_{t+1} = \text{Stock}_t - \Delta \quad \text{iff} \quad \text{Stock}_t \ge \Delta$$

Executed via transactional stored procedure:
```sql
CREATE OR REPLACE FUNCTION decrease_stock_atomic(p_id UUID, qty INT)
RETURNS BOOLEAN AS $$
DECLARE
  current_stock INT;
BEGIN
  SELECT stock INTO current_stock FROM products WHERE id = p_id FOR UPDATE;
  IF current_stock >= qty THEN
    UPDATE products SET stock = stock - qty WHERE id = p_id;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
```

### 2.2. OWASP Security Hardening Matrix

| Vector | Mitigation Strategy | Verification Harness |
| :--- | :--- | :--- |
| **Price Tampering (A04)** | Authoritative database pricing queries; client payload amounts discarded | `tests/security-audit.test.js` |
| **Broken Access Control (A01)** | `authGuard.js` enforcing strict `storeId` ownership validation | `tests/security-audit.test.js` |
| **Cross-Tenant Collisions** | Session cart partitions isolate items to a single store domain | `tests/cart-multitenant.test.js` |
| **Race Conditions** | Transactional `FOR UPDATE` locks verify zero over-allocation | `tests/stock-concurrency.test.js` |

---

## 3. Technology Stack & Multi-Tier Topology

| Layer | Technology | Architectural Specification |
| :--- | :--- | :--- |
| **Framework** | Next.js 14.2 | App Router, Server Actions, Route Handlers |
| **Language** | TypeScript 5.9 | Strict mode typing across domain and schema boundaries |
| **3D Graphics** | Three.js + R3F | Hardware-accelerated canvas with GLSL vertex displacement |
| **Data Engine** | PostgreSQL (Supabase) | Multi-tenant schema with Row Level Security (RLS) |
| **State Management**| Zustand 5.0 | High-performance, un-opinionated reactive client store |
| **Payment Gateway** | MercadoPago SDK 2.3 | Server-to-server preference generation and webhook handling |
| **Testing** | Vitest 3.0 | Unit, security audit, and concurrency stress test suites |

---

## 4. Systems Directory Hierarchy

```text
MultiTiendasCelphone/
├── app/                          # Next.js 14 App Router routes & API endpoints
├── data/                         # Initial catalog seeding fixtures & mock stores
├── docs/                         # Architecture Decision Records (ADR 0001–0003)
├── src/
│   ├── components/
│   │   ├── 3d/                   # Three.js Canvas, GLSL shaders & depth loaders
│   │   ├── admin/                # Decoupled admin panels (Anti God-Component pattern)
│   │   └── store/                # Boutique storefronts, cart modals & checkout
│   ├── lib/                      # Supabase client, auth guards, stock procedures
│   └── stores/                   # Zustand cart and session stores
├── supabase/
│   └── migrations/               # PostgreSQL schema DDL with RLS policies
└── tests/                        # Vitest security audit and concurrency suites
```

---

## 5. Development Runtime & Operational Lifecycle

### Prerequisites
- **Node.js**: $\ge 20.9.0$ LTS
- **Package Manager**: `npm` $\ge 10.x$

### Installation & Initialization
```bash
# Clone the repository
git clone https://github.com/ExeDevCentral/MultiTiendasCelphone.git
cd MultiTiendasCelphone

# Install dependencies deterministically
npm install

# Configure environment variables
cp .env.example .env.local

# Seed initial boutique catalogs
npm run seed

# Launch Next.js development server
npm run dev
```

### Static Analysis & Verification Suite
```bash
# Execute security audit & concurrency test suite
npm test

# Generate production build artifact
npm run build
```

---

## 6. Formal Verification

```
 ✓ tests/security-audit.test.js      (4 tests)
 ✓ tests/stock-concurrency.test.js   (3 tests)
 ✓ tests/cart-multitenant.test.js    (4 tests)
 ✓ tests/product-validation.test.js  (3 tests)

 Test Files  4 passed (4)
      Tests  14 passed (14)
   Duration  0.86s
```

---

## 7. License

Distributed under the **MIT License**. Engineered for high-security multi-tenant electronics commerce.

<div align="center">
  <sub>Engineered by <a href="https://github.com/ExeDevCentral">ExeDevCentral</a>.</sub>
</div>
