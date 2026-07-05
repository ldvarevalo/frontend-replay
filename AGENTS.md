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
yarn format       # Prettier + lint:fix
```

## Verification Order

`lint → typescript → test` (CI enforces this exact order)

## Workflow

- **Branch first:** `feat/<name>` antes de implementar
- **Brainstorming:** usar `brainstorming` skill para diseñar antes de tocar código
- **Plan approval:** presentar diseño/plan y obtener aprobación antes de implementar
- **Commits granulares:** un commit por componente/grupo lógico
- **No commitear specs ni plans** (en `docs/superpowers/`)

## Import Aliases

- `#/` → `src/` (alias principal, usar siempre)
- `@/` → `src/` (alias secundario, existe por shadcn/ui legacy)
- `@test-utils` → `src/lib/test-utils` (solo en tests)

Siempre `import type` para imports solo de tipos (`verbatimModuleSyntax: true`).

## TypeScript

- **NO `any`** — usar `unknown` + type guards
- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- `max-params: 3` por función (ESLint)
- `noUncheckedSideEffectImports: true` — no se permite import sin usar

## ESLint (non-obvious)

- `object-property-newline`: cada propiedad en su propia línea
- `max-statements: 12` por función, `max-nested-callbacks: 2`, `max-depth: 3`
- `complexity: 12` como máximo
- `import/order`: react → externals → internals (con alias `#/`, `@/`, `@test-utils`)
- `import/extensions: never` — no usar extensiones `.ts`/`.tsx` en imports (excepciones: svg, webp, json, gen)
- `react/function-component-definition`: arrow functions siempre
- `react/destructuring-assignment`: error
- `react/self-closing-comp`: error — self-close si no tiene children
- `arrow-body-style: as-needed` — usar return implícito cuando el body es solo un return
- `etc/prefer-interface`: error — preferir `interface` sobre `type` para objetos (excepto local types)
- `@typescript-eslint/explicit-function-return-type`: requerido (excepto en expresiones y arrow functions tipadas)
- kebab-case obligatorio en filenames (`unicorn/filename-case`)

## Conventions

- **Component directory:** `{component}.tsx` + `index.ts` + `__tests__/` (ej: `src/components/header/`)
- **Typography:** `<Typography>` con props `family`, `size`, `weight`, `as`. Color lo define el contenedor
- **Button links:** `<Button variant="text">` para links inline. Usa Typography internamente
- **Sección en archivos TS:** Types → Constants → Helpers → named export (hook/component)
- **Return types:** Extraer a `interface` con sufijo `Hook` para hooks y `Result` para funciones. Ej: `UseAlbumDataHook`, `FormatDurationResult`
- **Evitar return type inline:** No escribir tipos de retorno como objetos literales inline (`): { ... }`). Siempre extraer a una interface nombrada.
- **Props types:** Extraer a `interface` con sufijo `Props` para props de componentes. Ej: `WishlistInfoProps`

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
  - `createTestQueryClient`: `retry: 0` para tests
  - `api.ts`: fetch wrapper con base URL desde `VITE_API_URL`
  - QueryClient disponible en route loaders via router context
- **Repository DI pattern:** `setRepositories(repos)` / `getRepositories()` en `src/repositories/instance.ts`
  - Tests DEBEN llamar `setRepositories()` antes de usar hooks que acceden a datos
  - `vitest.setup.ts` ya llama `setRepositories(createTestRepositories())` en `beforeEach`
  - Tests individuales pueden override con `setRepositories({ ... })`
  - `useRepositories()` hook en `src/repositories/hooks.ts`
- **Mock data primero:** hooks locales con datos mock; migrar a queries reales cuando el backend esté listo

## Auth

- `AuthProvider` wrappea la app; expone `useUser`, `useSignIn`, `useSignOut`
- En tests: `renderWithAuth` desde `@test-utils` para autenticación específica
- Para spiar `useUser`: `vi.spyOn(authModule, 'useUser')` (preferido sobre `vi.mock`)

## Testing

Ver `docs/specs/testing.spec.md` para convenciones detalladas.

Puntos clave:
- `render`, `renderHook`, `screen`, `waitFor` desde `@test-utils`
- `fireEvent` se importa directo de `@testing-library/react` (no está en `@test-utils`)
- `afterEach(() => vi.clearAllMocks())` cuando hay mocks compartidos a nivel módulo

## Git Workflow

- **Never use `git add`** — solo commitear archivos ya staged. Nunca `git add -A` ni `git add .`
- **Solo lo definido en el plan/task** — sin archivos extra
- `git commit --no-verify -m "<mensaje>"`
- `yarn add -E <package>` para versiones exactas

## CI / Deploy

- **Validate (push/PR a master):** lint → typescript → test (Node 22, yarn frozen-lockfile)
- **Deploy:** push a master → Render webhook (vía `secrets.RENDER_DEPLOY_HOOK_URL`)
