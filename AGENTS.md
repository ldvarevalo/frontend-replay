# AGENTS.md

## Commands

```bash
yarn dev          # Dev server (port 3000)
yarn build        # Build (validates syntax + imports)
yarn lint         # ESLint
yarn lint:fix     # ESLint auto-fix
yarn typescript   # TypeScript check (tsc --noEmit)
yarn test         # Vitest run
yarn test:watch   # Vitest watch mode
yarn test:cov     # Coverage (70/90/50 thresholds)
```

## Verification Order

`lint → typescript → test` (CI enforces this exact order)

## Workflow

- **Branch first:** `feat/<name>` antes de implementar
- **Brainstorming:** usar `brainstorming` skill para diseñar antes de tocar código
- **Plan approval:** presentar diseño/plan y obtener aprobación antes de implementar
- **Commits granulares:** un commit por componente/grupo lógico
- **No commitear specs ni plans** (en `docs/superpowers/`)

## TypeScript

- `verbatimModuleSyntax: true` — usar `import type` para imports solo de tipos
- **NO `any`** — usar `unknown` + type guards
- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- `max-params: 3` por función (ESLint)

## ESLint (non-obvious)

- `object-property-newline`: cada propiedad en su propia línea
- `max-statements: 12` por función, `max-nested-callbacks: 2`, `max-depth: 3`
- `complexity: 12` como máximo
- `import/order`: react → externals → internals (con alias `#/`, `@/`, `@test-utils`)
- `react/function-component-definition`: arrow functions siempre
- `react/destructuring-assignment`: error
- kebab-case obligatorio en filenames (`unicorn/filename-case`)

## Conventions

- **Component directory:** `{component}.tsx` + `index.ts` + `__tests__/` (ej: `src/components/header/`)
- **Typography:** `<Typography>` con props `family`, `size`, `weight`, `as`. Color lo define el contenedor
- **Button links:** `<Button variant="text">` para links inline. Usa Typography internamente
- **Sección en archivos TS:** Types → Constants → Helpers → named export (hook/component)

## Code Integrity

- **Nunca borrar comentarios, secciones JSDoc, o separadores existentes** — solo modificar el código que la tarea requiere
- Los separadores de secciones (`/** SectionName */`) deben mantenerse incluso al reordenar o modificar el archivo

## TanStack Router

- `routeTree.gen.ts` es **auto-generado** — nunca editar manualmente
- `autoCodeSplitting: true` en la config de Vite
- Tests requieren `RouterContextProvider` wrapper (ver `test-utils`)

## Data Layer

- **@tanstack/react-query** configurado (ver `src/core/clients/react-query/`)
  - `query-client.ts`: factory con `staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`
  - `api.ts`: fetch wrapper con base URL desde `VITE_API_URL`
  - QueryClient disponible en route loaders via router context
- **Mock data primero:** hooks locales con datos mock; migrar a queries reales cuando el backend esté listo

## Testing

- **Import:** `import { render, screen } from '@test-utils'`
- Wrappers: `QueryClientProvider` + `RouterContextProvider` compuestos
- `QueryClient` de test con `retry: false`
- `vitest.setup.ts` mockea `matchMedia` y hace `clearAllMocks` en cada `beforeEach`
- Coverage thresholds: statements 70%, branches 90%, functions 50%, lines 70%

## Git Workflow

- **Never use `git add`** — solo commitear archivos ya staged. Nunca `git add -A` ni `git add .`
- **Solo lo definido en el plan/task** — sin archivos extra
- `git commit --no-verify -m "<mensaje>"`
- `yarn add -E <package>` para versiones exactas

## CI / Deploy

- **Validate (push/PR a master):** lint → typescript → test (Node 22, yarn frozen-lockfile)
- **Deploy:** push a master → Render webhook (vía `secrets.RENDER_DEPLOY_HOOK_URL`)
