# Testing Spec

Convenciones para escribir tests unitarios en este proyecto.

## Configuración

- **Framework:** Vitest v3 (`vitest.config.ts`)
- **Environment:** `jsdom`
- **Globals:** `true` — `vi`, `describe`, `it`, `expect`, `beforeEach` disponibles sin imports
- **Setup:** `vitest.setup.ts` — importa `@testing-library/jest-dom/vitest`, mockea `window.matchMedia`, ejecuta `vi.clearAllMocks()` antes de cada test
- **Path alias:** `@test-utils` → `src/lib/test-utils`
- **Coverage thresholds:** statements 70%, branches 90%, functions 50%, lines 70%

## Test Utilities (`src/lib/test-utils/index.tsx`)

```tsx
import { render, screen, renderHook } from '@test-utils';
```

- `render` envuelve automáticamente el componente en `<RouterContextProvider>` (TanStack Router)
- `screen` exportado directamente de `@testing-library/react`
- No importar `render`/`screen` desde rutas relativas ni desde `@testing-library/react` directamente
- Excepción: `fireEvent` se importa directo de `@testing-library/react` cuando es necesario

## Import de componentes

Siempre relativo al test file:

```tsx
import { Header } from '../header';
```

## Estructura del test

```tsx
describe('ComponentName', () => {
  it('should render something', () => { ... });
});
```

- Un solo `describe` por archivo con el nombre PascalCase del componente
- `it` siempre empieza con `"should ..."`
- Sin `describe` anidados
- Sin `beforeEach` / `afterEach`, excepto `afterEach(() => vi.clearAllMocks())` cuando hay mocks compartidos a nivel módulo
- Secciones JSDoc antes del `describe`: `/** * Mocks */`, luego `/** * Tests */`

## Queries (prioridad)

| Prioridad | Query | Uso |
|-----------|-------|-----|
| 1 | `screen.getByText('...')` | Texto visible |
| 2 | `screen.getByRole('...')` | Elementos semánticos (button, link, textbox) |
| 3 | `screen.getByPlaceholderText('...')` | Inputs con placeholder |
| 4 | `screen.getByAltText('...')` | Imágenes |
| 5 | `screen.getByDisplayValue('...')` | Inputs con valor |
| 6 | `container.querySelector(...)` | Inspección DOM cuando no hay alternativa semántica |
| 7 | `screen.getByTestId('...')` | Último recurso, solo cuando no hay alternativa |
| Negativa | `screen.queryByText('...')` + `not.toBeInTheDocument()` | Afirmar que algo NO existe |

## Matchers (jest-dom)

- `toBeInTheDocument()` — existencia
- `toHaveClass('...')` — clases CSS
- `toHaveAttribute('attr', 'value')` — atributos (src, href, etc.)
- `toBeDisabled()` / `not.toBeDisabled()` — estado disabled
- `toMatchSnapshot()` — snapshots (usar con moderación, preferir `container.firstChild`)
- `toHaveBeenCalledTimes(n)` — número de llamadas
- `toHaveBeenCalledWith(...)` — argumentos del callback

## Interacciones

```tsx
screen.getByText('CLICK ME').click();
screen.getByText('Album 1').closest('button')?.click();
fireEvent.change(input, { target: { value: 'jazz' } });
```

- Usar `.click()` nativo para clicks (no `fireEvent.click`)
- `fireEvent.change` para cambios en inputs
- No usar `@testing-library/user-event`

## Formato JSX

- 3+ props: una por línea
- Blank line entre `render()` y el primer `expect`
- Blank line entre expects no relacionados

```tsx
render(<Component prop1="a" prop2="b" />);

expect(screen.getByText('foo')).toBeInTheDocument();
expect(screen.getByText('bar')).toBeInTheDocument();
```

```tsx
render(
  <Component
    prop1="a"
    prop2="b"
    prop3="c"
  />
);

expect(screen.getByText('foo')).toBeInTheDocument();
```

## Mocks

```tsx
const handleClickMock = vi.fn();
const handleSubmitMock = vi.fn();

/**
 * Tests
 */

describe('Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fire onClick when clicked', () => {
    render(<Component onClick={handleClickMock} />);
    screen.getByText('CLICK ME').click();
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
```

- **Naming:** `handle<Verb><Noun>Mock` (ej: `handleClickMock`, `handleTabChangeMock`)
- **Hoisting:** declarar a nivel módulo, antes del `describe`, bajo `/** * Mocks */`
- **afterEach:** agregar `vi.clearAllMocks()` cuando los mocks son compartidos
- **Inline:** nunca pasar callbacks inline en JSX — siempre referenciar variable mock
- **`vi.fn()`** para callbacks mockeados, no `() => {}`
- **`vi.spyOn`** preferido sobre `vi.mock` para módulos del proyecto
- **`vi.mock`** solo para módulos sin exports reales
- Sin `vi.mock`/`vi.spyOn` a nivel de módulo externo

## Datos mock

```tsx
const defaultProps: AlbumCardProps = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'A Love Supreme',
  artist: 'John Coltrane',
  onClick: vi.fn(),
};

const albums: CollectionAlbum[] = [
  { id: '1', coverUrl: '...', title: 'Album 1', artist: 'Artist 1', year: '2001', status: 'owned' as const },
  { id: '2', coverUrl: '...', title: 'Album 2', artist: 'Artist 2', year: '2002', status: 'want' as const },
];
```

- Tipar mock objects con la interfaz Props del componente (la Props interface debe ser `export` desde el componente)
- Arrays de objetos: expandir una prop por línea
- Usar `as const` para tipos literales
- Mock data inline, no compartida entre archivos

## Conditional rendering

```tsx
// Afirmar que existe cuando se cumple la condición
expect(screen.getByText('1965')).toBeInTheDocument();

// Afirmar que NO existe cuando no se cumple
expect(screen.queryByText('1965')).not.toBeInTheDocument();

// Componente que retorna null
const { container } = render(<Pagination totalPages={1} ... />);
expect(container.innerHTML).toBe('');

// Estado activo vía clase CSS
expect(element).toHaveClass('bg-primary-container');
```

## Snapshots

- Usar con moderación (solo 2 de 18 tests tienen snapshot)
- Preferir `expect(container.firstChild).toMatchSnapshot()` sobre `expect(document.body).toMatchSnapshot()`
- Combinar con al menos una aserción regular (ej: `toBeInTheDocument`) en el mismo `it`
- Se almacenan automáticamente en `__tests__/__snapshots__/{test-file}.snap`

## Organización de archivos

```
src/
  components/
    <component-name>/
      __tests__/
        <component-name>.test.tsx
        __snapshots__/          (solo cuando existen snapshots)
          <component-name>.test.tsx.snap
  routes/
    _auth/
      <route>/
        -components/
          __tests__/
            <component-name>.test.tsx
```

- Test files co-located con el componente en `__tests__/`
- Naming: `{kebab-case-name}.test.tsx`

## Referencias

- AGENTS.md para comandos de verification: `yarn lint` → `yarn typescript` → `yarn test`
- `vitest.config.ts` para configuración del runner
- `src/lib/test-utils/index.tsx` para el custom render wrapper
