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

### 1.4 Radios

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
| `variant` | `default` / `outline` / `secondary` / `ghost` / `destructive` / `link` | `default` |
| `size` | `default` / `xs` / `sm` / `lg` / `icon` / `icon-xs` / `icon-sm` / `icon-lg` | `default` |

**Ejemplos:**
```tsx
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="link">Ver más</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><X /></Button>
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

Header sticky con glassmorphism (`bg-background/80 backdrop-blur-sm`), borde inferior, logo "Crate" en `font-heading` y navegación con links a Dashboard, Collection, Add, Logout.

---

## 6. Patrones de layout

### Full-width

El contenido ocupa todo el ancho disponible con padding lateral consistente via `.page-wrap`:
```tsx
<main className="page-wrap">
  {children}
</main>
```

### Sidebar + contenido

Sidebar izquierdo fijo + contenido flexible a la derecha.

### Panel lateral derecho

Contenido principal + panel informativo/detalle fijo a la derecha.

### Combinado

Sidebar + contenido + panel derecho.

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

- Wrapper: `RouterContextProvider` (ver `@test-utils`)
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
