# Crate — Frontend

Music collection manager. React + TanStack Router + Tailwind CSS v4 + @base-ui/react.

## Quick start

```bash
yarn dev          # Dev server (port 3000)
yarn build        # Build
yarn lint         # ESLint
yarn typescript   # tsc --noEmit
yarn test         # Vitest
```

## Architecture

- **Components:** `src/components/{name}/{name}.tsx` + `index.ts` + `__tests__/`
- **UI primitives:** `src/components/ui/` (Button, Typography, Input, Select, etc.)
- **Routes:** `src/routes/_auth/{name}/` with `-components/`, `-hooks/`
- **Data:** `src/core/clients/react-query/` (QueryClient + api.ts fetch wrapper)
- **Styles:** `src/styles.css` with Tailwind v4 + CSS custom properties for all tokens
- **Aliases:** `@/` and `#/` → `./src/`, `@test-utils` → `./src/lib/test-utils`

## Critical rules

- **No `any`** → use `unknown` + type guards
- **`verbatimModuleSyntax: true`** → use `import type` for type-only imports
- **kebab-case** for files, PascalCase for components
- **Only CSS tokens** in Tailwind classes — no hex values
- **`routeTree.gen.ts`** is auto-generated — never edit manually
- **git commit** only staged files, no `git add`

See `AGENTS.md` and `docs/specs/ui.spec.md` for full conventions.
