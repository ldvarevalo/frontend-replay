# AGENTS.md

## Convenciones de Código

### Naming Conventions

- **Archivos**: `kebab-case` (ej: `my-component.tsx`)
- **Componentes**: `PascalCase` (ej: `ThemeToggle`)
- **Hooks**: `use` + `PascalCase` (ej: `useAuth`)
- **Types/Interfaces**:
  - Props: `Use[Nombre]Props`
  - Return: `Use[Nombre]Hook`
- **Helpers**: `camelCase` (ej: `formatDate`)
- **Tests**: `*.test.ts` en `__tests__/`

### Separadores de Sección

Orden obligatorio en archivos TypeScript:

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
 * Styled Components
 */

const Container = styled.div`...`;

/**
 * Helpers
 */

const formatDate = () => { ... };

/**
 * MyComponent component
 */

export const MyComponent = () => { ... };
```

### TypeScript

- **NO usar `any`**: usar `unknown` + type guards
- **Type imports separados**:

```typescript
import type { FunctionComponent } from 'react';
import { useState } from 'react';
```

### Testing

- **Framework**: Vitest
- **Ubicación**: `__tests__/` (plural)
- **Naming**: `component-name.test.ts`
- **Mocks**:
  - Datos: `NOMBRE_MOCK` (UPPER_SNAKE_CASE)
  - Funciones: `handleXxxMock` (camelCase)

### Comandos

```bash
yarn dev      # Desarrollo
yarn build   # Build
yarn test    # Vitest
yarn lint   # ESLint
yarn format # Prettier
```