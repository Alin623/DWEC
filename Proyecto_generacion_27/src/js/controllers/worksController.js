import { buscarObras } from '../api/openLibrary.js';
import { AUTORES_27 } from '../../data/autores27.js';
import { actualizarCategoria, actualizarResultados } from './state.js';
import { normalizarObraOpenLibrary } from '../utils/models.js';

function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es');
}

function buscarObrasLocales(filtros) {
  const autor = normalizar(filtros.autor);
  const tema = normalizar(filtros.genero);
  return AUTORES_27.flatMap((registro) => registro.obras.map((obra, indice) => ({
    ...obra,
    id: `${registro.id}-${indice}`,
    autor: registro.nombre,
    autorId: registro.id,
  }))).filter((obra) => {
    const textoAutor = normalizar(obra.autor);
    const textoObra = normalizar(`${obra.titulo} ${obra.genero} ${obra.descripcion}`);
    const coincideAutor = !autor || textoAutor.includes(autor);
    const coincideTema = !tema || textoObra.includes(tema);
    const coincideDesde = filtros.desde === null || obra.año >= filtros.desde;
    const coincideHasta = filtros.hasta === null || obra.año <= filtros.hasta;
    return coincideAutor && coincideTema && coincideDesde && coincideHasta;
  });
}

/**
 * Ejecuta una búsqueda de obras y actualiza el estado global.
 *
 * @param {object} filtros Filtros validados.
 * @param {boolean} incluirCatalogos Consulta también Open Library.
 * @returns {Promise<{resultados: Array, advertencia: string}>} Obras encontradas.
 */
export async function buscarObrasController(filtros, incluirCatalogos = false) {
  let obras = buscarObrasLocales(filtros);
  let advertencia = '';
  if (incluirCatalogos) {
    try {
      const externas = await buscarObras(filtros);
      const clavesLocales = new Set(obras.map((obra) => normalizar(`${obra.titulo}|${obra.autor}`)));
      const externasUnicas = externas
        .map(normalizarObraOpenLibrary)
        .filter(Boolean)
        .filter((obra) => !clavesLocales.has(normalizar(
          `${obra.title}|${obra.author_name[0] ?? ''}`,
        )))
        .map((obra) => ({ ...obra, fuenteExterna: 'Open Library' }));
      obras = [...obras, ...externasUnicas];
    } catch (error) {
      advertencia = error instanceof Error ? error.message : String(error);
    }
  }

  actualizarCategoria('obras');
  actualizarResultados(obras);
  return { resultados: obras, advertencia };
}