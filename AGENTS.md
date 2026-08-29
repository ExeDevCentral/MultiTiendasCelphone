# MultiTiendas CelPhone 3D — Agent Guidelines

Plataforma multi-tienda de celulares de alta gama con estética minimalista iPhone × Gucci Atelier, visor 3D interactivo con Depth Maps en GPU, Supabase multi-tenant con RLS y control de stock atómico.

---

## Agent skills

### Issue tracker

GitHub Issues via `gh` CLI (`ExeDevCentral/MultiTiendasCelphone`). See `docs/agents/issue-tracker.md`.

### Triage labels

Standard 5 canonical triage roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout with `CONTEXT.md` at root and `docs/adr/`. See `docs/agents/domain.md`.

---

## Development & Test Commands

- `npm run dev`: Starts concurrently the frontend Vite app on `http://localhost:5173` and backend API on `http://localhost:5000`.
- `npm run build`: Production bundle verification with Vite.
- `npm run test`: Vitest test suite (Stock concurrency, multi-tenancy isolation, product validation).
