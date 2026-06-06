---
name: update-ui-spec
description: >
  Mantiene sincronizado docs/specs/ui.spec.md con el estado real del proyecto.
  Usar siempre que: se instale un nuevo componente shadcn, se cree o modifique
  un componente en src/core/components/ui/ o src/core/components/, se cambie
  tokens.css, o el usuario diga "actualiza el spec", "sincroniza el ui-spec",
  "el spec está desactualizado", "agregué un componente nuevo" o cualquier
  variante. También usar proactivamente al finalizar la implementación de una
  fase de UI.
---

# update-ui-spec

Sincroniza `docs/specs/ui.spec.md` con el estado real del codebase. El spec es la
fuente de verdad para desarrolladores que construyen nuevas pantallas — debe
reflejar lo que realmente existe, no lo que existía cuando se escribió por
primera vez.

## Contexto del proyecto

- **Componentes atómicos**: `src/core/components/ui/` — instalados via shadcn o creados manualmente
- **Componentes compuestos**: `src/core/components/` — componentes de negocio reutilizables
- **Tokens**: `src/styles.css` — `@theme` de Tailwind v4
- **Config shadcn**: `components.json` — estilo `base-nova`, alias `@core/components/ui`
- **Spec target**: `docs/specs/ui.spec.md`

## Restricciones del proyecto

- Solo tokens CSS en clases Tailwind — nunca hex hardcodeados ni clases genéricas de color
- Variantes con CVA, clases condicionales con `cn()` de `@core/helpers/shadcn`

## Proceso

### 1. Inventariar el estado actual

Lee en paralelo:

- Todos los archivos en `src/core/components/ui/*.tsx`
- Todos los `index.tsx` en `src/core/components/*/`
- `src/styles/tokens.css`
- `components.json`
- `docs/specs/ui.spec.md` (estado actual)

Para cada componente en `ui/`, extrae:

- Nombre del componente y path de import (`@core/components/ui/<nombre>`)
- Props/variantes CVA disponibles (de `cva()` o la interface TypeScript)
- Ejemplo de uso mínimo

Para cada componente en `core/components/`, extrae:

- Nombre, path de import (`@core/components/<nombre>`)
- Props clave de la interface TypeScript

### 2. Detectar diferencias con el spec actual

Compara el inventario con `docs/specs/ui.spec.md`:

- **Componente nuevo** en el código que no aparece en el spec → agregar
- **Componente eliminado** del código que sigue en el spec → quitar
- **Props cambiadas** (variante renombrada, prop nueva, prop eliminada) → actualizar
- **Token nuevo** en `tokens.css` → agregar a la tabla de tokens
- **Token eliminado** → quitar

Si no hay diferencias, indicarlo brevemente y no modificar el archivo.

### 3. Reescribir docs/specs/ui.spec.md

Reemplaza el contenido completo de `docs/specs/ui.spec.md` siguiendo esta estructura fija:

```
## 1. Tokens
   1.1 Colores de marca
   1.2 Colores semánticos
   1.3 Escala gris (si tiene tokens propios)
   1.4 Radios

## 2. Tipografía base
   Tabla de roles → clases Tailwind

## 3. Componentes atómicos — src/core/components/ui/
   Por cada componente: import, props/variantes, ejemplo mínimo de uso

## 4. Componentes shadcn disponibles para instalar
   Tabla: componente | comando npx shadcn add | cuándo usar
   (solo los que NO están instalados aún)

## 5. Componentes compuestos — src/core/components/
   Por cada componente: import, props clave, ejemplo mínimo

## 6. Patrones de layout
   Full-width | Sidebar + contenido | Panel lateral derecho | Combinado

## 7. Reglas de implementación
   Lista numerada de reglas concretas
```

### 4. Criterios de calidad del spec

El spec resultante debe cumplir:

- **Ejecutable**: un desarrollador puede copiar los ejemplos directamente en código y funcionan
- **Basado en la API real**: los nombres de props y variantes deben coincidir exactamente con el TypeScript del componente — nunca inventar ni inferir
- **Sin componentes fantasma**: si un componente fue eliminado del código, no aparece en el spec
- **Comandos de instalación correctos**: usar `npx shadcn add <nombre>` (consistente con el proyecto)
- **Tokens actualizados**: la tabla de tokens refleja exactamente lo que está en `tokens.css`

### 5. Reportar cambios

Después de escribir, resumir brevemente qué cambió:

- N componentes nuevos agregados
- N componentes eliminados
- N props actualizadas
- N tokens nuevos/modificados

Si no hubo cambios, decirlo en una línea.

## Notas

- Los patrones de layout (sección 6) y las reglas de implementación (sección 7) son estables — solo modificarlos si el usuario lo pide explícitamente o si cambia la arquitectura de layout del proyecto.
