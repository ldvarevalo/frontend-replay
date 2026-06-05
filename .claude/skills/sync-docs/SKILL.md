---
name: sync-docs
description: >
  Mantiene CLAUDE.md, AGENTS.md y docs/specs/*.spec.md actualizados, precisos y sin redundancias.
  Usar cuando: el usuario diga "actualiza los docs", "sincroniza el spec", "revisa que
  los docs estén al día", "hay algo desactualizado en los specs", "el spec está roto",
  o cualquier variante en español o inglés. También usar proactivamente después de
  refactors grandes, migraciones de componentes, o cambios arquitectónicos que afecten
  convenciones documentadas. Nunca usar para actualizar un único archivo puntual — en
  ese caso editar directamente.
---

# sync-docs

Mantiene sincronizados `CLAUDE.md`, `AGENTS.md` (si existe) y todos los specs en
`docs/specs/` con el estado real del codebase. El objetivo es que los docs sean la
fuente de verdad que un LLM (o un desarrollador nuevo) necesita para trabajar
correctamente en el proyecto — precisos, sin contradicciones, sin redundancias, y
optimizados para consumo por LLM.

---

## 1. Preparar el índice del codebase

Antes de leer los docs, construir un mapa del estado real del proyecto.

**Si CodeGraph está disponible** (`codegraph_status` responde sin error):

```
codegraph_status   → verificar que el índice existe
```

Si el índice tiene más de 10 minutos desde el último sync, o si hay cambios recientes
sin indexar, correr `codegraph sync` automáticamente antes de continuar.

Usar CodeGraph para preguntas estructurales:
- `codegraph_files` sobre `src/components/ui/` → lista de componentes atómicos
- `codegraph_files` sobre `src/components/` → lista de compuestos
- `codegraph_search` para encontrar símbolos específicos (tokens, interfaces, hooks)
- `codegraph_node` para obtener la firma real de un componente

**Si CodeGraph no está disponible**, escanear manualmente en paralelo:
- `src/components/ui/` — componentes atómicos
- `src/components/` — componentes compuestos (excluir `ui/`)
- `src/styles.css` — tokens de diseño
- `src/routes/_auth/` — patrones de estructura de rutas en uso
- `docs/specs/` — specs existentes
- `CLAUDE.md`
- `AGENTS.md`

---

## 2. Leer el estado actual de los docs

Leer en paralelo:
- `CLAUDE.md`
- `AGENTS.md` (si existe)
- Todos los archivos en `docs/specs/*.spec.md`

Identificar qué specs existen actualmente y qué dominio cubre cada uno.

---

## 3. Descubrir specs nuevos necesarios

Comparar los dominios cubiertos por los specs con el codebase real. Si hay un área
relevante del proyecto sin spec, proponer crearlo.

Señales de que un dominio merece su propio spec:
- Patrones que se repiten en 3+ archivos y no están documentados
- Convenciones que developers nuevos necesitarían conocer para no cometer errores
- APIs internas con múltiples consumers que no tienen documentación de uso

Antes de crear un spec nuevo, preguntar al usuario si quiere incluirlo.

---

## 4. Auditar cada spec contra el codebase

Para cada spec existente, hacer las siguientes verificaciones:

### 4a. Validación de referencias

Verificar que cada path de archivo o símbolo mencionado en el spec todavía existe:
- Imports: `#/components/ui/button` → verificar que el archivo existe
- Nombres de props/variantes: comparar contra el TypeScript real del componente
- Nombres de tokens: comparar contra `styles.css`
- Aliases de path: verificar contra `tsconfig.json` o `vite.config.ts`

Marcar como **ROTO** cualquier referencia que no se pueda verificar.

### 4b. Detección de desactualización

Buscar contenido que el codebase haya superado:
- Componentes documentados que ya no existen
- Props o variantes renombradas o eliminadas
- Patrones documentados que el código real ya no usa
- Comandos que ya no funcionan

### 4c. Detección de patrones nuevos no documentados

Escanear el codebase buscando patrones recurrentes que no aparezcan en ningún spec:
- Hooks con el mismo shape en múltiples rutas
- Componentes compuestos nuevos en `src/components/`
- Nuevos tokens en `styles.css`
- Patrones de estructura de archivos que difieren de lo documentado

### 4d. Verificar con git log

Mirar los commits recientes para acotar qué áreas pueden haber cambiado:

```bash
git log --oneline --since="2 weeks ago" -- src/components/ src/styles/ docs/
```

Priorizar la verificación de archivos tocados recientemente.

---

## 5. Auditar redundancias y contradicciones entre docs

Leer todos los docs como conjunto y detectar:

### Redundancias
- Misma regla expresada en CLAUDE.md **y** en un spec → eliminar del que es menos
  autoritativo (CLAUDE.md referencia al spec, no lo duplica)
- `AGENTS.md` debe mantenerse a paridad con `CLAUDE.md` — si divergen, `CLAUDE.md` manda
- Mismos ejemplos de código en dos specs distintos
- Misma tabla de tokens/componentes en múltiples lugares

### Contradicciones
- CLAUDE.md dice X, un spec dice Y distinto sobre el mismo tema
- AGENTS.md dice algo distinto a CLAUDE.md sobre el mismo tema
- Dos specs dicen cosas incompatibles
- Un spec documenta una convención que el código real contradice sistemáticamente

Para cada contradicción: determinar cuál es la verdad (el código manda sobre la docs)
y corregir el doc incorrecto.

---

## 6. Aplicar cambios

Para cada archivo que necesita cambios, aplicar en este orden:

1. **Corregir referencias rotas** — actualizar paths, nombres de props, tokens
2. **Eliminar contenido obsoleto** — componentes que ya no existen, patrones abandonados
3. **Agregar contenido nuevo** — patrones nuevos descubiertos en el codebase
4. **Resolver redundancias** — mover contenido al spec correcto, dejar solo referencia en CLAUDE.md
5. **Resolver contradicciones** — corregir el doc que está equivocado
6. **Crear specs nuevos** — solo si el usuario aprobó en el paso 3

### Criterios de calidad al escribir o editar

- **Denso, no verboso**: cada línea debe aportar información accionable. Eliminar
  frases introductorias, explicaciones de lo obvio, y comentarios de estado ("Este
  componente está siendo migrado...") — eso pertenece a commits, no a specs.
- **Ejemplos mínimos pero ejecutables**: el código de ejemplo debe poder copiarse
  directamente y funcionar. No incluir variantes obvias si ya está la regla general.
- **Props inline**: documentar props debajo del ejemplo del componente, no en sección
  separada que fragmenta la lectura.
- **Sin duplicar CLAUDE.md en los specs**: CLAUDE.md es el índice con reglas críticas
  inline. Los specs son la referencia completa. No repetir las mismas reglas en ambos.
- **Lenguaje consistente**: si el spec usa español, mantener español. No mezclar.

---

## 7. Reportar

Al finalizar, presentar un resumen estructurado:

```
## Cambios aplicados

### CLAUDE.md
- [descripción breve si hubo cambios, o "sin cambios"]

### AGENTS.md
- [descripción breve si hubo cambios, o "sin cambios / no existe"]

### docs/specs/ui.spec.md
- Referencias rotas corregidas: N
- Componentes nuevos documentados: [lista]
- Componentes eliminados: [lista]
- Redundancias eliminadas: [descripción]

### docs/specs/testing.spec.md
- [idem]

### docs/specs/conventions.spec.md
- [idem]

### Specs nuevos creados
- [nombre]: [qué cubre]

### Contradicciones resueltas
- [descripción de cada una y cómo se resolvió]
```

Si no hubo cambios en un archivo, omitirlo del reporte.

---

## Notas

- **El código manda**: cuando hay conflicto entre lo que dice un doc y lo que hace el
  código, el código es la verdad. Corregir el doc, no al revés (a menos que el patrón
  en el código sea claramente un error o deuda técnica — en ese caso, aclararlo al usuario).
- **No inventar convenciones**: solo documentar lo que realmente existe o se usa. Si
  algo está en proceso de migración, documentar el estado actual y agregar una nota
  breve sobre la dirección.
- **No tocar patrones de layout ni reglas de implementación de ui.spec.md** a menos
  que el usuario lo pida explícitamente o el código los contradiga.
- **No commitear**: esta skill solo edita archivos. El commit es responsabilidad del usuario.
