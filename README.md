# Replay

[![CI](https://github.com/ldvarevalo/frontend-crate/actions/workflows/ci.yml/badge.svg)](https://github.com/ldvarevalo/frontend-crate/actions/workflows/ci.yml)

Aplicación de descubrimiento musical. Conectada con replay-service (backend propio) y Supabase para datos y autenticación.

| Home | Analytics |
| ---- | ---- |
| <img src="https://github.com/ldvarevalo/frontend-replay/releases/download/untagged-08a2b7d580e5bf101cfe/home-1.png" width="300" alt="Alt text"> | <img src="https://github.com/ldvarevalo/frontend-replay/releases/download/untagged-08a2b7d580e5bf101cfe/analytics.png" width="300" alt="Alt text"> |

## Stack

- React 19 + TypeScript
- TanStack Router (file-based routing, auto code splitting)
- TanStack React Query (data fetching + cache)
- Tailwind CSS v4
- shadcn/ui (base-nova style)
- Supabase (auth + backend, migrando a replay-service)
- Vitest

## Comandos

```bash
yarn dev          # Dev server (port 3000)
yarn build        # Build producción
yarn preview      # Preview build
yarn lint         # ESLint
yarn lint:fix     # ESLint auto-fix
yarn format       # Prettier + lint
yarn typescript   # TypeScript check
yarn test         # Tests
yarn test:watch   # Tests en watch mode
yarn test:cov     # Tests con coverage
```

## Rutas

- `/` — Home / inicio
- `/album/:id` — Detalle de álbum
- `/collection` — Colección del usuario
- `/release` — Lanzamientos
- `/analytics` — Analíticas
