import { customFetch } from './http.js';

const API_URL = 'https://es.wikipedia.org/api/rest_v1/page/summary/';

/**
 * Obtiene el resumen introductorio de una página de Wikipedia en español.
 *
 * @param {string} titulo Título de la página del autor.
 * @returns {Promise<{extract: string, thumbnail?: object, content_urls?: object}>}
 */
export async function obtenerResumenAutor(titulo) {
  if (typeof titulo !== 'string' || titulo.trim().length === 0) {
    throw new TypeError('El título del autor es obligatorio.');
  }

  const url = `${API_URL}${encodeURIComponent(titulo.trim().replaceAll(' ', '_'))}`;
  try {
    const resumen = await customFetch(url);
    if (typeof resumen?.extract !== 'string' || resumen.extract.length === 0) {
      throw new TypeError('La respuesta de Wikipedia no contiene un resumen utilizable.');
    }

    return resumen;
  } catch (error) {
    throw new Error(`No se pudo obtener el resumen biográfico de Wikipedia: ${error.message}`, {
      cause: error,
    });
  }
}