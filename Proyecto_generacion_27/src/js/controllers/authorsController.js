import { buscarAutores, obtenerObrasAutor } from '../api/openLibrary.js';
import { obtenerResumenAutor } from '../api/wikipedia.js';
import { AUTORES_27 } from '../../data/autores27.js';
import {
  actualizarAutorSeleccionado,
  actualizarCategoria,
  actualizarResultados,
} from './state.js';
import { normalizarAutorOpenLibrary } from '../utils/models.js';

function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es');
}

function buscarAutoresLocales(filtros) {
  const autor = normalizar(filtros.autor);
  const tema = normalizar(filtros.genero);
  return AUTORES_27.filter((registro) => {
    const textoAutor = normalizar(`${registro.nombre} ${registro.perfil}`);
    const textoTema = normalizar(`${registro.etiquetas.join(' ')} ${registro.obras.map((obra) => `${obra.titulo} ${obra.genero} ${obra.descripcion}`).join(' ')}`);
    const coincideAutor = !autor || textoAutor.includes(autor);
    const coincideTema = !tema || textoTema.includes(tema);
    return coincideAutor && coincideTema;
  });
}

/**
 * Ejecuta una búsqueda de autores y actualiza el estado global.
 *
 * @param {object} filtros Filtros de búsqueda validados.
 * @param {boolean} incluirCatalogos Consulta también Open Library.
 * @returns {Promise<{resultados: Array, advertencia: string}>} Autores encontrados.
 */
export async function buscarAutoresController(filtros, incluirCatalogos = false) {
  if (!filtros?.autor) {
    throw new TypeError('El nombre del autor es obligatorio para la búsqueda.');
  }

  const autoresLocales = buscarAutoresLocales(filtros);
  let autores = [...autoresLocales];
  let advertencia = '';
  if (incluirCatalogos) {
    try {
      const externos = await buscarAutores(filtros.autor);
      const nombresLocales = new Set(autoresLocales.map((autor) => normalizar(autor.nombre)));
      const autoresExternos = externos
        .map(normalizarAutorOpenLibrary)
        .filter((autor) => autor && !nombresLocales.has(normalizar(autor.name)));
      autores = [...autores, ...autoresExternos];
    } catch (error) {
      advertencia = error instanceof Error ? error.message : String(error);
    }
  }

  actualizarCategoria('autores');
  actualizarAutorSeleccionado(null);
  actualizarResultados(autores);
  return { resultados: autores, advertencia };
}

/**
 * Carga las obras asociadas a un autor seleccionado.
 *
 * @param {object} autor Autor seleccionado del catálogo.
 * @returns {Promise<Array>} Obras encontradas.
 */
export async function cargarObrasDeAutor(autor) {
  if (!autor?.key && !autor?.id) {
    throw new TypeError('El autor seleccionado no tiene una clave válida.');
  }

  const registroLocal = AUTORES_27.find((registro) => registro.id === autor.id);
  let obras;
  if (registroLocal) {
    obras = registroLocal.obras.map((obra, indice) => ({
      ...obra,
      id: `${registroLocal.id}-${indice}`,
      autor: registroLocal.nombre,
      autorId: registroLocal.id,
    }));
    actualizarAutorSeleccionado(registroLocal);
  } else {
    obras = (await obtenerObrasAutor(autor.key))
      .map((obra) => ({
        ...obra,
        autor: autor.nombre ?? autor.name,
        fuenteExterna: 'Open Library',
      }));
    actualizarAutorSeleccionado({
      nombre: autor.nombre ?? autor.name,
      key: autor.key,
      perfil: 'Registro recuperado de Open Library. Amplía la información en el catálogo bibliográfico.',
      obras: [],
      fuentes: ['Open Library'],
    });
  }
  actualizarCategoria('obras');
  actualizarResultados(obras);
  return obras;
}

/**
 * Amplía el perfil editorial con un resumen de Wikipedia cuando está disponible.
 *
 * @param {object} autor Registro local o externo.
 * @returns {Promise<{perfil: string, advertencia: string}>}
 */
export async function enriquecerPerfilAutor(autor) {
  const registroLocal = AUTORES_27.find((registro) => registro.id === autor?.id);
  const perfilBase = registroLocal?.perfil ?? autor?.perfil ?? '';
  const nombre = registroLocal?.nombre ?? autor?.nombre ?? autor?.name;
  if (!nombre) {
    throw new TypeError('No se puede ampliar un perfil sin nombre.');
  }

  try {
    const resumen = await obtenerResumenAutor(nombre);
    const seleccionado = {
      ...(registroLocal ?? autor),
      perfilWikipedia: resumen.extract,
      urlWikipedia: resumen.content_urls?.desktop?.page ?? '',
    };
    actualizarAutorSeleccionado(seleccionado);
    return { perfil: resumen.extract, advertencia: '' };
  } catch (error) {
    return {
      perfil: perfilBase,
      advertencia: error instanceof Error ? error.message : String(error),
    };
  }
}