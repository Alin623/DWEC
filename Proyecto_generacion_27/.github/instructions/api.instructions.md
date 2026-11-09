# Instrucciones para Capa API (`src/js/api/`)

Estas reglas aplican exclusivamente al directorio `src/js/api/` y ficheros de comunicación HTTP.

## Normas de Implementación
1. **Cliente HTTP Centralizado (`http.js`)**:
   - Implementa una función envoltorio reutilizable (`customFetch` o similar) basada en `window.fetch`.
   - Comprueba obligatoriamente `response.ok`. Si es falso, lanza un error personalizado (`ApiError`) que incluya el `response.status` y el texto de estado.
2. **Gestión de Endpoints**:
   - **Open Library**: `https://openlibrary.org` (búsquedas por autor, obras, metadatos, portadas mediante IDs de portada).
   - **Wikipedia REST API**: `https://es.wikipedia.org/api/rest_v1/page/summary/{titulo}` (para resúmenes biográficos e imágenes).
   - **API Privada (`json-server`)**: Peticiones asíncronas de escritura y lectura (`GET`, `POST`, `PUT`, `DELETE`) contra `http://localhost:3000/favoritos` y `http://localhost:3000/notas`.
3. **Manejo de Errores en Red**:
   - Captura excepciones de red (ej. caídas de conexión, CORS, JSON malformado) y propáralas limpiamente hacia la capa de controladores con mensajes descriptivos.