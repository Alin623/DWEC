const IDIOMAS_PERMITIDOS = new Set(['es', 'en', 'fr']);
const ANIO_MINIMO = 1800;
const ANIO_MAXIMO = new Date().getFullYear();

/**
 * Valida y normaliza los filtros del formulario antes de realizar una petición.
 *
 * @param {object} filtros Valores recibidos del formulario.
 * @param {'autores'|'obras'} categoria Categoría que se va a consultar.
 * @returns {{valido: boolean, filtros: object, errores: string[]}}
 */
export function validarFiltros(filtros, categoria) {
  const normalizados = {
    autor: typeof filtros?.autor === 'string' ? filtros.autor.trim() : '',
    genero: typeof filtros?.genero === 'string' ? filtros.genero.trim() : '',
    idioma: typeof filtros?.idioma === 'string' ? filtros.idioma.trim() : '',
    desde: typeof filtros?.desde === 'string' ? filtros.desde.trim() : '',
    hasta: typeof filtros?.hasta === 'string' ? filtros.hasta.trim() : '',
  };
  const errores = [];

  if (!['autores', 'obras'].includes(categoria)) {
    errores.push('Selecciona una categoría válida.');
  }
  if (normalizados.autor.length > 100) {
    errores.push('El autor no puede superar los 100 caracteres.');
  }
  if (normalizados.genero.length > 80) {
    errores.push('El género no puede superar los 80 caracteres.');
  }
  if (!IDIOMAS_PERMITIDOS.has(normalizados.idioma)) {
    errores.push('Selecciona un idioma válido.');
  }

  const desde = normalizados.desde === '' ? null : Number(normalizados.desde);
  const hasta = normalizados.hasta === '' ? null : Number(normalizados.hasta);
  for (const [etiqueta, anio] of [['inicial', desde], ['final', hasta]]) {
    if (anio !== null && (!Number.isInteger(anio) || anio < ANIO_MINIMO || anio > ANIO_MAXIMO)) {
      errores.push(`El año ${etiqueta} debe estar entre ${ANIO_MINIMO} y ${ANIO_MAXIMO}.`);
    }
  }
  if (desde !== null && hasta !== null && desde > hasta) {
    errores.push('El año inicial no puede ser posterior al año final.');
  }
  if (categoria === 'autores' && normalizados.autor.length === 0) {
    errores.push('Escribe un autor para buscar.');
  }
  if (
    categoria === 'obras'
    && normalizados.autor.length === 0
    && normalizados.genero.length === 0
    && desde === null
    && hasta === null
  ) {
    errores.push('Indica un autor, un género o al menos un año para buscar obras.');
  }

  return {
    valido: errores.length === 0,
    filtros: { ...normalizados, desde, hasta },
    errores,
  };
}