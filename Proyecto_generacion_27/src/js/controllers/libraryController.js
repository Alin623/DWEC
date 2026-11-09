import {
  agregarFavorito,
  eliminarFavorito,
  getFavoritos,
  getNotas,
  guardarNota,
} from '../api/privateApi.js';
import { actualizarFavoritos, actualizarNotas } from './state.js';

function normalizarFavorito(favorito) {
  return {
    ...favorito,
    titulo: favorito?.titulo ?? favorito?.title ?? 'Obra sin título',
    autor: favorito?.autor ?? favorito?.author ?? 'Autoría no indicada',
    categoria: favorito?.categoria ?? favorito?.genre ?? 'Obra',
    obraId: favorito?.obraId ?? favorito?.workId ?? favorito?.key ?? '',
  };
}

/**
 * Carga favoritos y notas desde json-server y los sincroniza con el estado.
 *
 * @returns {Promise<{favoritos: Array, notas: Array}>}
 */
export async function cargarBibliotecaController() {
  const [favoritosRecibidos, notasRecibidas] = await Promise.all([getFavoritos(), getNotas()]);
  if (!Array.isArray(favoritosRecibidos) || !Array.isArray(notasRecibidas)) {
    throw new TypeError('La API local devolvió una biblioteca con un formato inesperado.');
  }

  const favoritos = favoritosRecibidos.map(normalizarFavorito);
  actualizarFavoritos(favoritos);
  actualizarNotas(notasRecibidas);
  return { favoritos, notas: notasRecibidas };
}

/**
 * Persiste un favorito evitando duplicados por obra.
 *
 * @param {object} obra Obra seleccionada en el catálogo.
 * @returns {Promise<object>} Favorito almacenado.
 */
export async function agregarFavoritoController(obra) {
  if (!obra?.titulo || !obra?.autor) {
    throw new TypeError('La obra debe tener título y autoría para guardarse.');
  }

  const favoritosActuales = await getFavoritos();
  if (!Array.isArray(favoritosActuales)) {
    throw new TypeError('No se pudo validar la lista actual de favoritos.');
  }
  const yaGuardada = favoritosActuales.some((favorito) => (
    String(favorito?.obraId ?? favorito?.workId ?? favorito?.key ?? '') === String(obra.obraId)
      && String(favorito?.titulo ?? favorito?.title ?? '').toLocaleLowerCase('es')
        === obra.titulo.toLocaleLowerCase('es')
  ));
  if (yaGuardada) {
    throw new Error('Esta obra ya está guardada en tu biblioteca.');
  }

  await agregarFavorito({
    ...obra,
    fechaAgregado: new Date().toISOString().slice(0, 10),
  });
  const { favoritos } = await cargarBibliotecaController();
  return favoritos.find((favorito) => favorito.titulo === obra.titulo && favorito.autor === obra.autor);
}

/**
 * Elimina un favorito y actualiza la instantánea del estado.
 *
 * @param {string|number} id Identificador asignado por json-server.
 */
export async function eliminarFavoritoController(id) {
  if (id === undefined || id === null || id === '') {
    throw new TypeError('El favorito no tiene un identificador válido.');
  }
  await eliminarFavorito(id);
  await cargarBibliotecaController();
}

/**
 * Guarda una nota crítica vinculada a un favorito.
 *
 * @param {string|number} obraId Identificador del favorito.
 * @param {string} texto Texto de la nota.
 * @returns {Promise<object>} Nota almacenada.
 */
export async function guardarNotaController(obraId, texto) {
  const contenido = typeof texto === 'string' ? texto.trim() : '';
  if (!obraId || contenido.length === 0 || contenido.length > 1000) {
    throw new TypeError('Selecciona una obra y escribe una nota de hasta 1000 caracteres.');
  }

  const favoritos = await getFavoritos();
  if (!Array.isArray(favoritos)) {
    throw new TypeError('No se pudo comprobar la obra seleccionada.');
  }
  const favorito = favoritos.find((item) => String(item?.id) === String(obraId));
  if (!favorito) {
    throw new Error('La obra seleccionada ya no está en la biblioteca.');
  }

  await guardarNota({
    obraId: favorito.id,
    tituloObra: favorito.titulo ?? favorito.title ?? 'Obra sin título',
    textoNota: contenido,
    fecha: new Date().toISOString().slice(0, 10),
  });
  await cargarBibliotecaController();
}