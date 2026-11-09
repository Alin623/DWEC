/**
 * Error producido por una respuesta HTTP no satisfactoria.
 */
export class ApiError extends Error {
  constructor(message, status, statusText) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Realiza una petición HTTP, valida la respuesta y devuelve su contenido JSON.
 * Las respuestas sin contenido (por ejemplo, HTTP 204) devuelven null.
 *
 * @param {string} url URL completa del recurso.
 * @param {RequestInit} [options] Opciones nativas de fetch.
 * @returns {Promise<unknown>} Contenido JSON de la respuesta.
 */
export async function customFetch(url, options = {}) {
  let response;

  try {
    response = await window.fetch(url, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error de red al solicitar ${url}: ${message}`, { cause: error });
  }

  if (!response.ok) {
    throw new ApiError(
      `Error HTTP ${response.status}${response.statusText ? `: ${response.statusText}` : ''}`,
      response.status,
      response.statusText,
    );
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`No se pudo interpretar la respuesta JSON de ${url}: ${message}`, {
      cause: error,
    });
  }
}