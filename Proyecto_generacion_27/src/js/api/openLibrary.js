import { customFetch } from './http.js';

const API_URL = 'https://openlibrary.org';
const LIMITE_RESULTADOS = 30;

function requireDocs(payload, endpoint) {
  if (!Array.isArray(payload?.docs)) {
    throw new TypeError(`La respuesta de Open Library no contiene resultados válidos (${endpoint}).`);
  }

  return payload.docs;
}

/**
 * Busca autores en Open Library.
 *
 * @param {string} nombre Nombre o fragmento del autor.
 * @returns {Promise<Array>} Resultados de autores.
 */
export async function buscarAutores(nombre) {
  const query = new URLSearchParams({
    q: nombre,
    limit: String(LIMITE_RESULTADOS),
  });
  const endpoint = `${API_URL}/search/authors.json?${query}`;

  try {
    return requireDocs(await customFetch(endpoint), endpoint);
  } catch (error) {
    throw new Error(`No se pudo buscar autores en Open Library: ${error.message}`, { cause: error });
  }
}

/**
 * Busca obras aplicando los filtros proporcionados.
 *
 * @param {object} filtros Filtros validados por la aplicación.
 * @returns {Promise<Array>} Resultados de obras.
 */
export async function buscarObras(filtros) {
  const queryParts = [];
  if (filtros.autor) {
    queryParts.push(`author:"${filtros.autor.replace(/["\\]/g, ' ')}"`);
  }
  if (filtros.genero) {
    queryParts.push(`subject:"${filtros.genero.replace(/["\\]/g, ' ')}"`);
  }
  if (filtros.desde !== null && filtros.hasta !== null) {
    queryParts.push(`first_publish_year:[${filtros.desde} TO ${filtros.hasta}]`);
  } else if (filtros.desde !== null) {
    queryParts.push(`first_publish_year:[${filtros.desde} TO *]`);
  } else if (filtros.hasta !== null) {
    queryParts.push(`first_publish_year:[* TO ${filtros.hasta}]`);
  }

  const query = new URLSearchParams({
    q: queryParts.join(' AND '),
    language: filtros.idioma === 'es' ? 'spa' : filtros.idioma,
    limit: String(LIMITE_RESULTADOS),
  });
  const endpoint = `${API_URL}/search.json?${query}`;

  try {
    return requireDocs(await customFetch(endpoint), endpoint);
  } catch (error) {
    throw new Error(`No se pudieron buscar obras en Open Library: ${error.message}`, { cause: error });
  }
}

/**
 * Recupera las obras de un autor de Open Library.
 *
 * @param {string} claveAutor Clave del autor, por ejemplo /authors/OL123A.
 * @returns {Promise<Array>} Obras asociadas al autor.
 */
export async function obtenerObrasAutor(claveAutor) {
  if (typeof claveAutor !== 'string' || !/^\/authors\/[^/]+$/.test(claveAutor)) {
    throw new TypeError('La clave del autor no tiene un formato válido.');
  }

  const claveCodificada = claveAutor.split('/').map(encodeURIComponent).join('/');
  const query = new URLSearchParams({ limit: String(LIMITE_RESULTADOS) });
  const endpoint = `${API_URL}${claveCodificada}/works.json?${query}`;

  try {
    const payload = await customFetch(endpoint);
    if (!Array.isArray(payload?.entries)) {
      throw new TypeError('La respuesta no contiene una lista de obras válida.');
    }

    return payload.entries;
  } catch (error) {
    throw new Error(`No se pudieron cargar las obras del autor: ${error.message}`, { cause: error });
  }
}