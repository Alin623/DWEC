# Instrucciones para Controladores y Estado (`src/js/controllers/`)

Estas reglas aplican exclusivamente a la lógica de negocio, control de estado y flujos de anidamiento ubicados en `src/js/controllers/`.

## Normas de Implementación
1. **Gestión de Estado Global (`state.js`)**:
   - Mantén un objeto de estado centralizado (filtros activos, categoría actual seleccionada, resultados en memoria, elementos favoritos de la API privada).
2. **Flujo de Anidamiento de Búsquedas (Mínimo 2 Niveles)**:
   - **Nivel 1**: El usuario introduce parámetros en el formulario y se obtienen autores u obras principales.
   - **Nivel 2**: Al hacer clic en un elemento del Nivel 1, el controlador correspondiente dispara automáticamente una segunda petición asíncrona (ej: obtener obras del autor seleccionado en Wikipedia/Open Library).
   - **Nivel 3 (Persistencia)**: Selección de obra para registrarla en la API privada (`json-server`) como favorita o añadir notas críticas.
3. **Validación de Parámetros**:
   - Asegúrate de procesar y validar simultáneamente al menos 3-4 parámetros de búsqueda antes de lanzar las peticiones asíncronas.