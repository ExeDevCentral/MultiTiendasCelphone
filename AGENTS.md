# CelStore™ 3D — Agent Guidelines

CelStore es una plataforma multi-boutique de smartphones de alta gama con estética minimalista iPhone × Gucci Atelier, visor 3D interactivo con Depth Maps en GPU, Supabase multi-tenant con RLS y control de stock atómico.

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

- `npm run dev`: Starts the Next.js dev server on `http://localhost:3000`.
- `npm run build`: Production bundle verification with Next.js.
- `npm run seed`: Loads `data/*.json` into Supabase (needs `.env.local` configured).
- `npm run test`: Vitest test suite (Stock concurrency, multi-tenancy isolation, product validation, token security).
