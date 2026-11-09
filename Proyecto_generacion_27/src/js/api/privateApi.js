import { customFetch } from './http.js';

const API_URL = 'http://localhost:3000';

/**
 * Añade contexto a los errores de petición sin ocultar el error original.
 *
 * @param {string} operation Descripción de la operación fallida.
 * @param {unknown} error Error original.
 * @returns {Error} Error descriptivo con la causa original.
 */
function createOperationError(operation, error) {
  const detail = error instanceof Error ? error.message : String(error);
  return new Error(`${operation}: ${detail}`, { cause: error });
}

/**
 * Obtiene todos los favoritos almacenados en json-server.
 *
 * @returns {Promise<unknown>} Lista de favoritos.
 */
export async function getFavoritos() {
  try {
    return await customFetch(`${API_URL}/favoritos`);
  } catch (error) {
    throw createOperationError('No se pudieron cargar los favoritos', error);
  }
}

/**
 * Guarda un favorito en json-server.
 *
 * @param {object} obra Obra o autor que se desea guardar.
 * @returns {Promise<unknown>} Favorito creado.
 */
export async function agregarFavorito(obra) {
  try {
    return await customFetch(`${API_URL}/favoritos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obra),
    });
  } catch (error) {
    throw createOperationError('No se pudo guardar el favorito', error);
  }
}

/**
 * Elimina un favorito por su identificador.
 *
 * @param {string|number} id Identificador del favorito.
 * @returns {Promise<unknown>} Respuesta del servidor.
 */
export async function eliminarFavorito(id) {
  try {
    return await customFetch(`${API_URL}/favoritos/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw createOperationError(`No se pudo eliminar el favorito ${id}`, error);
  }
}

/**
 * Obtiene todas las notas almacenadas en json-server.
 *
 * @returns {Promise<unknown>} Lista de notas.
 */
export async function getNotas() {
  try {
    return await customFetch(`${API_URL}/notas`);
  } catch (error) {
    throw createOperationError('No se pudieron cargar las notas', error);
  }
}

/**
 * Guarda una nota en json-server.
 *
 * @param {object} nota Nota crítica que se desea guardar.
 * @returns {Promise<unknown>} Nota creada.
 */
export async function guardarNota(nota) {
  try {
    return await customFetch(`${API_URL}/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nota),
    });
  } catch (error) {
    throw createOperationError('No se pudo guardar la nota', error);
  }
}