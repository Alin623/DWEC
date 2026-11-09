# Instrucciones para Estilos y CSS (`src/css/`)

Estas reglas aplican a la hoja de estilos modular ubicada en `src/css/`.

## Normas de Implementación
1. **Arquitectura CSS Modular**:
   - `variables.css`: Definición estricta de Custom Properties (`--color-pergamino`, `--color-tinta`, `--color-acento-granate`, tipografías editoriales).
   - `base.css`: Estilos reseteados, tipografías base y configuración global.
   - `layout.css`: Estructura principal basada en **CSS Grid** y **Flexbox** para la maquetación responsive.
   - `components.css`: Estilos específicos para tarjetas de autor, fichas de obras, modales, formularios, pestañas (*tabs*) y barras de estado/spinners.
2. **Diseño Responsive**:
   - Uso obligatorio de unidades relativas y media queries para garantizar una visualización perfecta tanto en dispositivos móviles como en pantallas de escritorio.