---
name: new-page
description: Use when creating or scaffolding a new page (route) in this project — any file under src/routes/_auth/**/ that ends in index.tsx, or when adding -components, -hooks, or -helpers to an existing route. Trigger on requests like "crear una nueva pantalla", "agregar la ruta /admin/...", "nueva page para X", "scaffoldear la ruta", "agregar un componente a la ruta", or any variant in Spanish or English. Also trigger when the user says "cómo organizo esto" in the context of a route or feature page.
---

# New Page — Convenciones de ruta

Guía para crear una página nueva en `src/routes/_auth/`. Cubre estructura de archivos, separación de responsabilidades, límite de tamaño, y convenciones de código.

---

## 1. Estructura de archivos

```
src/routes/_auth/<feature>/
  index.tsx                          ← Page component + Route export
  -components/
    <component-name>.tsx             ← un archivo por componente simple
    <component-name>/                ← directorio cuando el componente tiene sub-partes
      index.tsx
      <sub-part>.tsx
      <sub-part>.tsx
    __tests__/
      <component-name>.test.tsx
  -hooks/
    use-<hook-name>.ts               ← un hook por archivo
  -helpers/
    <helper-name>.ts                 ← función pura por archivo
```

**Reglas del prefijo `-`:** el guión evita que TanStack Router trate esas carpetas como rutas. Es obligatorio. No usar `components/` (sin guión).

---

## 2. Responsabilidades por capa

### `index.tsx` — la Page (orquestadora)

Aquí vive toda la **lógica**. Los componentes de `-components/` son ciegos a de dónde vienen los datos.

La Page es responsable de:

- Queries y mutations de GraphQL (via hooks en `-hooks/`)
- Estado local (`useState`, `useReducer`)
- Callbacks que conectan UI con lógica (`handleDelete`, `handleSubmit`)
- Construcción de datos derivados (arrays de nav items, mock data provisional)
- `useNavigate`, `useMatchRoute`, `useSearch`, etc.
- Renders condicionales de alto nivel (loading / error / contenido)

```tsx
// ✅ La page construye los items del nav y los pasa al componente
const navItems = [
  {
    label: 'Proyectos',
    icon: FolderKanban,
    active: Boolean(matchRoute({ to: '/admin' })),
    onClick: () => navigate({ to: '/admin' }),
  },
];
return <AdminNav items={navItems} />;

// ❌ El componente no llama a useNavigate ni useMatchRoute internamente
```

### `-components/` — componentes presentacionales

Puramente visuales. Reciben props y llaman callbacks. No saben nada de routing, stores, ni GraphQL.

- Props tipadas con interface local
- Callbacks explícitos (`onDelete: (id: string) => void`)
- Sin `useNavigate`, `useQuery`, `useStore`, ni similares
- `ComponentType<Props>` o `FunctionComponent<Props>` como tipo del componente

```tsx
// ✅ Componente presentacional
export const ProjectsTable: FunctionComponent<ProjectsTableProps> = ({
  projects,
  isLoading,
  onDelete,
}) => { ... };

// ❌ Componente que llama queries directamente
const { data } = useQuery(GET_PROJECTS); // no va acá
```

### `-hooks/` — hooks de datos

Encapsulan queries y mutations. Devuelven datos tipados y callbacks. La page los consume.

```tsx
// -hooks/use-query-projects.ts
export const useQueryProjects = () => {
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS);
  return {
    projects: data?.projects ?? [],
    isLoading: loading,
    error,
    refetch,
  };
};
```

### `-helpers/` — funciones puras

Sin hooks, sin efectos. Transformaciones de datos, formateo, utilidades.

---

## 3. Límite de 250 líneas por archivo

Ningún archivo debe superar 250 líneas. Si lo supera, evaluar:

**Para una page (`index.tsx`):**

- ¿Hay lógica que pertenece a un hook? → extraer a `-hooks/`
- ¿Hay una sección de UI grande e independiente? → extraer a `-components/`
- ¿Hay constantes o tipos que se repiten? → mover al inicio del archivo o a `-helpers/`

**Para un componente de `-components/`:**

- ¿Tiene múltiples estados visuales (loading / empty / data)? → directorio con sub-archivos
  ```
  projects-table/
    index.tsx             ← ProjectsTable (shell + condicionales)
    skeleton-table-body.tsx
    empty-table-body.tsx
    data-table-body.tsx
  ```
- ¿Tiene una sección compleja independiente? → extraer a un componente hermano

**Criterio:** dividir cuando la separación tiene sentido semántico. No dividir solo para cumplir el número.

---

## 4. Estructura de `index.tsx`

Usar siempre estas secciones en orden, separadas por el comentario `/** ... */`:

```tsx
// 1. imports

/**
 * Types           ← interfaces y types locales (si aplica)
 */

/**
 * Constants       ← constantes del módulo (MOCK_DATA, CONFIG, etc.)
 */

/**
 * NombrePage      ← el componente de página
 */

const NombrePage = () => { ... };

/**
 * NombreRoute     ← el export de TanStack Router
 */

export const Route = createFileRoute('/_auth/nombre/')({
  beforeLoad: async () => { ... },   // solo si necesita auth/redirect
  component: NombrePage,
  loader: () => ({
    pageHeader: {
      title: 'Título visible',
      description: 'Subtítulo',
      onBack: () => router.navigate({ to: '/ruta-anterior' }),  // o icon: <Icon />
      actions: <Button>...</Button>,  // opcional
    },
  }),
});
```

**`loader` vs `beforeLoad`:**

- `loader` → datos del pageHeader (siempre)
- `beforeLoad` → guards de auth/role (solo cuando necesario). Usar `fetchPolicy: 'cache-first'` y `apolloClient.query` directamente — no `useQuery` (que no funciona fuera de React)

---

## 5. Patrones de layout

Elegir según la pantalla. Ver `docs/specs/ui.spec.md` sección 6 para el código completo.

| Patrón              | Cuándo                                       | Estructura                                                    |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| Full-width          | Sin nav lateral. Ej: editor, create-content  | `flex flex-col h-screen` → `<Header>` + `<main>`              |
| Sidebar + contenido | Con nav lateral fija. Ej: repository, admin  | `<Sidebar>` + `<main className="flex-1 overflow-y-auto p-8">` |
| Panel derecho       | Con detalle/propiedades. Ej: editor + config | `<main>` + `<aside className="w-80 ...">`                     |

**Altura del contenedor debajo del Header:** `h-[calc(100vh-64px)]`

---

## 6. Convenciones de código

### Nombres

- Archivos: `kebab-case.tsx`
- Componentes: `PascalCase`
- Hooks: `use-hook-name.ts` (archivo) / `useHookName` (export)
- Variables: `camelCase` — sin mezclar español e inglés (`projectsButton`, no `proyectosBtn`)

### Condicionales de render en la page

Usar `&&` inline. No crear helpers `renderBody()` ni similares:

```tsx
// ✅
{
  isLoading && <SkeletonTableBody />;
}
{
  !isLoading && projects.length === 0 && <EmptyTableBody />;
}
{
  !isLoading && projects.length > 0 && <DataTableBody projects={projects} />;
}

// ❌
{
  renderTableBody();
}
```

### Mappers de variante

Para mapear valores de datos a props visuales, usar un objeto `Record` constante en lugar de un componente interno:

```tsx
// ✅
const VISIBILITY_CONFIG: Record<
  Visibility,
  { variant: BadgeVariant; label: string }
> = {
  PUBLIC: { variant: 'success', label: 'Público' },
  PRIVATE: { variant: 'default', label: 'Privado' },
};
```

### Componentes de shadcn no instalados

Si una pantalla nueva necesita `Table`, `DropdownMenu`, `Dialog`, etc., instalar antes de construir:

```bash
npx shadcn add table
npx shadcn add dropdown-menu
```

Ver `docs/specs/ui.spec.md` sección 4 para la lista completa.

---

## 7. Tests

- Archivo: `__tests__/<component-name>.test.tsx`
- Nombrar casos con `it('should ...')`
- Ejecutar `/add-file-sections` en cada archivo nuevo, **incluyendo los de test**
- Correr tests antes y después de implementar (TDD cuando aplique):
  ```bash
  yarn test src/routes/_auth/<feature>/-components/__tests__/<name>.test.tsx
  ```

---

## 8. Checklist antes de hacer commit

- [ ] Ningún archivo supera 250 líneas
- [ ] Componentes en `-components/` son presentacionales (sin useQuery, useNavigate, etc.)
- [ ] Toda la lógica está en la page o en hooks de `-hooks/`
- [ ] Variables en inglés (sin spanglish)
- [ ] Sin colores hex hardcodeados — solo tokens (`bg-primary`, `text-outline`)
- [ ] `/add-file-sections` corrido en cada archivo nuevo
- [ ] Tests pasan: `yarn test`
- [ ] TypeScript limpio: `yarn typescript`
- [ ] Lint limpio: `yarn lint`
