# Instrucciones para Capa de Interfaz de Usuario (`src/js/ui/`)

Estas reglas aplican exclusivamente a los componentes de presentación y manipulación del DOM ubicados en `src/js/ui/`.

## Normas de Implementación
1. **Manipulación Dinámica Segura**:
   - Evita vulnerabilidades de inyección de HTML utilizando plantillas seguras, textContent para textos planos, o estructuración limpia de nodos mediante `document.createElement` / `innerHTML` controlado.
2. **Feedback Visual y Estados**:
   - Implementa indicadores de carga dinámicos (`spinners`), estados vacíos (*empty states*) amigables y alertas/notificaciones flotantes (*toasts*) para errores de validación de formularios o éxito en operaciones de escritura.
3. **Diseño de Tarjetas y Componentes**:
   - Renderiza tarjetas reutilizables para autores y obras adaptadas al diseño responsive y a la identidad visual institucional de época (Generación del 27).