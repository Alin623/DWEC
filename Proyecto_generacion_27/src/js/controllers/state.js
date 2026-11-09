const CATEGORIAS_VALIDAS = new Set(['autores', 'obras']);
const FILTROS_VALIDOS = new Set(['autor', 'genero', 'idioma', 'rangoCronologico']);
const PROPIEDADES_VALIDAS = new Set(['categoriaActiva', 'filtrosActivos', 'resultados', 'favoritos', 'notas', 'autorSeleccionado']);
const SUSCRIPTORES = new Set();

const filtrosIniciales = Object.freeze({
  autor: '',
  genero: '',
  idioma: 'es',
  rangoCronologico: Object.freeze({ desde: '', hasta: '' }),
});

let estado = Object.freeze({
  categoriaActiva: 'autores',
  filtrosActivos: filtrosIniciales,
  resultados: Object.freeze([]),
  favoritos: Object.freeze([]),
  notas: Object.freeze([]),
  autorSeleccionado: null,
});

function congelarLista(elementos, nombre) {
  if (!Array.isArray(elementos)) {
    throw new TypeError(`${nombre} debe ser un array.`);
  }

  return Object.freeze([...elementos]);
}

/**
 * Devuelve una instantánea inmutable del estado global actual.
 *
 * @returns {{categoriaActiva: string, filtrosActivos: object, resultados: Array, favoritos: Array, notas: Array, autorSeleccionado: object|null}}
 */
export function obtenerEstado() {
  return estado;
}

/**
 * Registra una función para recibir el estado nuevo y las propiedades modificadas.
 *
 * @param {(estado: object, propiedadesModificadas: string[]) => void} suscriptor
 * @returns {() => void} Función que cancela la suscripción.
 */
export function suscribirse(suscriptor) {
  if (typeof suscriptor !== 'function') {
    throw new TypeError('El suscriptor debe ser una función.');
  }

  SUSCRIPTORES.add(suscriptor);
  return () => SUSCRIPTORES.delete(suscriptor);
}

function notificar(propiedadesModificadas) {
  const propiedades = Object.freeze([...propiedadesModificadas]);
  SUSCRIPTORES.forEach((suscriptor) => suscriptor(estado, propiedades));
}

function actualizarEstado(cambios) {
  const clavesDesconocidas = Object.keys(cambios).filter((clave) => !PROPIEDADES_VALIDAS.has(clave));
  if (clavesDesconocidas.length > 0) {
    throw new RangeError(`Propiedad(es) de estado no válida(s): ${clavesDesconocidas.join(', ')}.`);
  }

  estado = Object.freeze({ ...estado, ...cambios });
  notificar(Object.keys(cambios));
}

/**
 * Cambia la categoría activa.
 *
 * @param {'autores'|'obras'} categoria
 */
export function actualizarCategoria(categoria) {
  if (!CATEGORIAS_VALIDAS.has(categoria)) {
    throw new RangeError('La categoría debe ser "autores" u "obras".');
  }

  actualizarEstado({ categoriaActiva: categoria });
}

/**
 * Actualiza parcialmente los filtros activos. El rango también admite actualización parcial.
 *
 * @param {object} cambiosFiltros
 */
export function actualizarFiltros(cambiosFiltros) {
  if (!cambiosFiltros || typeof cambiosFiltros !== 'object' || Array.isArray(cambiosFiltros)) {
    throw new TypeError('Los filtros deben proporcionarse como un objeto.');
  }

  const clavesDesconocidas = Object.keys(cambiosFiltros)
    .filter((clave) => !FILTROS_VALIDOS.has(clave));
  if (clavesDesconocidas.length > 0) {
    throw new RangeError(`Filtro(s) no válido(s): ${clavesDesconocidas.join(', ')}.`);
  }

  const filtrosActualizados = { ...estado.filtrosActivos, ...cambiosFiltros };
  if (Object.prototype.hasOwnProperty.call(cambiosFiltros, 'rangoCronologico')) {
    const rango = cambiosFiltros.rangoCronologico;
    if (!rango || typeof rango !== 'object' || Array.isArray(rango)) {
      throw new TypeError('El rango cronológico debe ser un objeto.');
    }

    filtrosActualizados.rangoCronologico = {
      ...estado.filtrosActivos.rangoCronologico,
      ...rango,
    };
  }

  filtrosActualizados.rangoCronologico = Object.freeze(filtrosActualizados.rangoCronologico);
  actualizarEstado({ filtrosActivos: Object.freeze(filtrosActualizados) });
}

/**
 * Reemplaza los resultados de la búsqueda actual.
 *
 * @param {Array} resultados
 */
export function actualizarResultados(resultados) {
  actualizarEstado({ resultados: congelarLista(resultados, 'Los resultados') });
}

/**
 * Establece el perfil abierto en el archivo.
 *
 * @param {object|null} autor
 */
export function actualizarAutorSeleccionado(autor) {
  if (autor !== null && (typeof autor !== 'object' || Array.isArray(autor))) {
    throw new TypeError('El autor seleccionado debe ser un objeto o null.');
  }
  actualizarEstado({ autorSeleccionado: autor ? Object.freeze({ ...autor }) : null });
}

/**
 * Reemplaza los favoritos cargados desde la API privada.
 *
 * @param {Array} favoritos
 */
export function actualizarFavoritos(favoritos) {
  actualizarEstado({ favoritos: congelarLista(favoritos, 'Los favoritos') });
}

/**
 * Reemplaza las notas recuperadas desde la API privada.
 *
 * @param {Array} notas
 */
export function actualizarNotas(notas) {
  actualizarEstado({ notas: congelarLista(notas, 'Las notas') });
}
/**
 * Restablece los filtros de búsqueda a sus valores iniciales.
 */
export function limpiarFiltros() {
  actualizarEstado({ filtrosActivos: filtrosIniciales });
}