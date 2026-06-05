# UI Spec — Frontend Crate

Documento de referencia de implementación para todas las pantallas de **Crate**.
Refleja exclusivamente lo que existe en el codebase — no especulación de diseño.

---

## 1. Tokens

Todos los tokens están definidos en `src/styles.css`. Nunca usar hex, genéricos de color, ni clases arbitrarias (`text-[#...]`). Usar siempre los tokens vía clases Tailwind.

### 1.1 Colores de marca

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#bbc3ff` | Color de acento, texto sobre fondos oscuros |
| `primary-container` | `#3d5afe` | Fondo de acciones primarias |
| `on-primary-container` | `#ffffff` | Texto/íconos sobre `primary-container` |

### 1.2 Colores semánticos

| Token | Valor | Uso |
|---|---|---|
| `background` | `#131313` | Canvas base de la aplicación |
| `surface` | `#131313` | Sinónimo de background |
| `surface-container-lowest` | `#0e0e0e` | Wells: search bars, listas inactivas |
| `surface-container-high` | `#2a2a2a` | Cards y paneles elevados |
| `on-surface` | `#ffffff` | Texto principal |
| `on-surface-variant` | `#a8a8a8` | Metadata, labels secundarios |

### 1.3 Aliases shadcn (compatibilidad)

| Token | Resuelve a | Uso |
|---|---|---|
| `foreground` | `on-surface` | Texto base shadcn |
| `card` / `card-foreground` | `surface` / `on-surface` | Cards |
| `popover` / `popover-foreground` | `surface` / `on-surface` | Popovers |
| `secondary` / `secondary-foreground` | `surface-container-high` / `on-surface` | Acciones secundarias |
| `muted` / `muted-foreground` | `surface-container-high` / `on-surface-variant` | Estados muted |
| `accent` / `accent-foreground` | `primary` / `on-surface` | Estados accent |
| `destructive` / `destructive-foreground` | `#ef4444` / `#ffffff` | Acciones destructivas |
| `border` | `surface-container-high` | Bordes |
| `input` | `surface-container-high` | Fondo de inputs |
| `ring` | `primary` | Focus ring |
| `outline` | `rgba(255,255,255,0.15)` | Outlines |
| `outline-20` | `rgba(255,255,255,0.20)` | Outlines con más opacidad |

### 1.4 Colores de chart

| Token | Resuelve a | Uso |
|---|---|---|
| `chart-1` | `primary` | Series de gráficos |
| `chart-2` | `primary-container` | Series de gráficos |
| `chart-3` | `on-surface-variant` | Series de gráficos |
| `chart-4` | `on-surface` | Series de gráficos |
| `chart-5` | `on-surface` | Series de gráficos |

### 1.5 Radios

| Token | Valor |
|---|---|
| `--radius` | `0px` |

---

## 2. Tipografía base

| Rol | Font family | Clase |
|---|---|---|
| UI / body | `Inter` (sans-serif) | `font-sans` |
| Headings / display | `Newsreader` (serif) | `font-heading` |

Uso:
- Inter: labels, metadata, body, datos numéricos
- Newsreader italic: títulos de sección, nombres de artistas, títulos de álbum

---

## 3. Componentes atómicos — `src/components/ui/`

### Button

```
import { Button } from '#/components/ui/button'
```

**Variantes CVA:**

| Prop | Valores | Default |
|---|---|---|
| `variant` | `default` / `primary` / `outline` / `secondary` / `ghost` / `destructive` / `link` / `text` | `default` |
| `size` | `default` / `xs` / `sm` / `lg` / `icon` / `icon-xs` / `icon-sm` / `icon-lg` | `default` |

**Ejemplos:**
```tsx
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="link">Ver más</Button>
<Button variant="text">VIEW ALL</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><X /></Button>
```

---

### Typography

```
import { Typography } from '#/components/ui/typography'
```

**Variantes CVA:**

| Prop | Valores | Default |
|---|---|---|
| `family` | `sans` / `heading` | `sans` |
| `size` | `2xs` / `xs` / `sm` / `base` / `md` / `lg` / `xl` / `2xl` | `sm` |
| `weight` | `normal` / `medium` / `semibold` / `bold` / `black` | `normal` |
| `transform` | `none` / `uppercase` | `none` |
| `uppercase` | `boolean` | — | Atajo para `transform="uppercase"` |
| `tracking` | `normal` / `tight` / `tighter` / `wider` / `widest` | `normal` |

**Prop `as`** — elemento HTML renderizado. Si no se pasa, se infiere de `family`:

| `family` | Default `as` |
|---|---|
| `display` | `h1` |
| `heading` | `h2` |
| `label` | `label` |
| `body` | `p` |
| `nav-link` | `span` |
| `nav-tab` | `span` |
| `logo` | `span` |
| (otro) | `p` |

**Ejemplos:**
```tsx
<Typography family="heading" size="lg">Section Title</Typography>
<Typography size="xs" weight="medium">Label</Typography>
<Typography size="2xs" transform="uppercase" tracking="wider">Small Caps</Typography>
<Typography as="h3" family="heading" size="xl">Heading as h3</Typography>
```

---

## 4. Componentes shadcn disponibles para instalar

| Componente | Comando | Cuándo usar |
|---|---|---|
| input | `npx shadcn add input` | Campos de formulario, search bars |
| card | `npx shadcn add card` | Cards de álbumes, paneles de contenido |
| dialog | `npx shadcn add dialog` | Modales, confirmaciones |
| dropdown-menu | `npx shadcn add dropdown-menu` | Menús contextuales, acciones de item |
| tabs | `npx shadcn add tabs` | Navegación por pestañas |
| label | `npx shadcn add label` | Labels de formulario |
| sheet | `npx shadcn add sheet` | Paneles laterales, sidebars |
| separator | `npx shadcn add separator` | Divisores entre secciones |
| command | `npx shadcn add command` | Command palette, búsqueda rápida |
| skeleton | `npx shadcn add skeleton` | Estados de carga / skeleton screens |

---

## 5. Componentes compuestos — `src/components/`

### Header

```
import { Header } from '#/components/header'
```

**Props:** ninguna (componente puro)

**Ejemplo:**
```tsx
<Header />
```

Header sticky con glassmorphism (`bg-background/80 backdrop-blur-sm`), logo "Crate" en `font-heading` y link a `/logout`.

---

### AlbumCard

```
import { AlbumCard } from '#/components/album-card'
```

**Props:**

| Prop | Tipo | Default |
|---|---|---|
| `coverUrl` | `string` | — |
| `title` | `string` | — |
| `artist` | `string` | — |
| `onClick` | `() => void` | — |

**Ejemplo:**
```tsx
<AlbumCard
  coverUrl="https://picsum.photos/seed/album1/400"
  title="Dark Side"
  artist="Pink Floyd"
  onClick={() => navigate({ to: `/album/1` })}
/>
```

---

### SectionHeader

```
import { SectionHeader } from '#/components/section-header'
```

**Props:**

| Prop | Tipo | Default |
|---|---|---|
| `title` | `string` | — |
| `onLinkClick?` | `() => void` | — |
| `linkLabel?` | `string` | `'VIEW ALL'` |

**Ejemplo:**
```tsx
<SectionHeader
  title="Recently Listened"
  onLinkClick={() => navigate({ to: '/recent' })}
/>
```

Renderiza un título con `Typography family="heading" size="lg"` y un `Button variant="text"` opcional a la derecha.

---

### SearchBar

```
import { SearchBar } from '#/components/search-bar'
```

**Props:**

| Prop | Tipo | Default |
|---|---|---|
| `value` | `string` | — |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | — |
| `placeholder?` | `string` | `'Search archive...'` |

**Ejemplo:**
```tsx
<SearchBar value={query} onChange={handleChange} />
```

Renderiza un `Input` con icono de búsqueda (`Search` de Lucide) superpuesto a la izquierda.

---

### AlbumRow

```
import { AlbumRow } from '#/components/album-row'
```

**Props:**

| Prop | Tipo | Default |
|---|---|---|
| `thumbnail` | `string` | — |
| `title` | `string` | — |
| `artist` | `string` | — |
| `duration?` | `string` | — |
| `isActive?` | `boolean` | `false` |
| `isAdded?` | `boolean` | `false` |
| `actionIcon?` | `ReactNode` | — |
| `onClick` | `() => void` | — |

**Ejemplo:**
```tsx
<AlbumRow
  thumbnail="https://picsum.photos/seed/album1/400"
  title="Time"
  artist="Pink Floyd"
  duration="6:53"
  isActive
  onClick={() => navigate({ to: `/track/t1` })}
/>
```

Fila activa: `bg-secondary`, inactiva: `hover:bg-secondary/50`. Si `isAdded` es `true`, muestra borde izquierdo `border-primary-container`. Si hay `actionIcon`, se muestra en lugar de la duración.

---

### BottomNav

```
import { BottomNav } from '#/components/bottom-nav'
```

**Props:**

| Prop | Tipo |
|---|---|
| `activeTab` | `TabId` (`'home' | 'collection' | 'add'`) |

**Ejemplo:**
```tsx
<BottomNav activeTab="home" />
```

Navegación inferior fija con glassmorphism, 3 tabs (Home, Collection, Add) con íconos Lucide. El tab activo usa `text-primary`, los inactivos `text-muted-foreground`.

---

## 6. Patrones de layout

### Full-width

El contenido ocupa todo el ancho disponible con padding lateral consistente via `.page-wrap`:
```tsx
<main className="page-wrap">
  {children}
</main>
```

`.page-wrap` está definido en `src/styles.css`:
```css
.page-wrap {
  container-type: inline-size;
  margin-inline: auto;
  width: 100%;
  padding-inline: 1rem;
}
```

### Soul gradient

Fondo degradado disponible via `.soul-gradient`:
```css
.soul-gradient {
  background: linear-gradient(135deg, var(--color-primary-container), #7c4dff);
}
```

### Sidebar + contenido

Sidebar izquierdo fijo + contenido flexible a la derecha.

### Panel lateral derecho

Contenido principal + panel informativo/detalle fijo a la derecha.

### Combinado

Sidebar + contenido + panel derecho.

### Clases utilitarias adicionales

| Clase | Propósito |
|---|---|
| `.display-title` | Títulos display con `font-heading` |
| `.hide-scrollbar` | Oculta scrollbar sin perder scroll (IE/FF/WebKit) |

---

## 7. Reglas de implementación

### Convenciones de código

- Solo tokens CSS en clases Tailwind — nunca hex hardcodeados ni clases genéricas de color
- Variantes con CVA, clases condicionales con `cn()` de `#/lib/utils`
- Componentes: PascalCase → `Button`, `Header`
- Archivos: kebab-case → `button.tsx`, `header.tsx`
- Hooks: `use` + PascalCase → `useAuth`, `useTheme`
- Tipos: `Use[Nombre]Props` → `UseButtonProps`

### Orden de secciones (TypeScript)

```typescript
/**
 * Types
 */
interface MyProps { ... }

/**
 * Constants
 */
const MAX_ITEMS = 10;

/**
 * Helpers
 */
const formatDate = () => { ... };

/**
 * MyComponent
 */
export const MyComponent = () => { ... };
```

### Testing

- Wrapper: `QueryClientProvider` + `RouterContextProvider` (ver `@test-utils`)
- Import: `import { render, screen } from '@test-utils'`
- Los tests se colocan en `__tests__/` junto al componente

### Tareas de verificación

```bash
yarn lint → yarn typescript → yarn test
```

### Prohibiciones

| Prohibición | Motivo |
|---|---|
| Border-radius > 0px | El sistema usa `--radius: 0px` |
| Hex hardcodeados en clases Tailwind | Usar siempre tokens del sistema |
| `any` en TypeScript | Usar `unknown` + type guards |
| Editar `routeTree.gen.ts` manualmente | Es auto-generado por TanStack Router |
