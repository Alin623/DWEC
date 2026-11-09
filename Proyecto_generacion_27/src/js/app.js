import { AUTORES_27, FUENTES_BIBLIOGRAFICAS } from '../data/autores27.js';
import {
  buscarAutoresController,
  cargarObrasDeAutor,
  enriquecerPerfilAutor,
} from './controllers/authorsController.js';
import { buscarObrasController } from './controllers/worksController.js';
import {
  agregarFavoritoController,
  cargarBibliotecaController,
  eliminarFavoritoController,
  guardarNotaController,
} from './controllers/libraryController.js';
import {
  obtenerEstado,
  suscribirse,
  actualizarCategoria,
  actualizarFiltros,
  actualizarResultados,
  actualizarAutorSeleccionado,
} from './controllers/state.js';
import { validarFiltros } from './utils/validators.js';
import { leerFiltrosFormulario } from './ui/searchForm.js';
import {
  actualizarPestanaActiva,
  establecerCarga,
  mostrarFeedback,
  renderizarAutores,
  renderizarPerfilAutor,
  renderizarObras,
  renderizarBiblioteca,
  renderizarBibliografia,
  obtenerElemento,
} from './ui.js';

/**
 * Arranca la aplicación, registra eventos y conecta controladores con la UI.
 */
async function inicializarAplicacion() {
  const ui = {
    formulario: obtenerElemento('#search-form'),
    resultados: obtenerElemento('#search-results'),
    estado: obtenerElemento('#feedback'),
    pestanas: [...document.querySelectorAll('[data-category]')],
    perfil: obtenerElemento('#author-profile'),
    tituloResultados: obtenerElemento('#results-title'),
    cuentaResultados: obtenerElemento('#results-count'),
    indicadorCarga: obtenerElemento('#loading-indicator'),
    catalogosExternos: obtenerElemento('#include-external'),
    camposAnio: [
      obtenerElemento('#year-from'),
      obtenerElemento('#year-to'),
    ],
    bibliografia: obtenerElemento('#bibliography-list'),
    bibliotecaEstado: obtenerElemento('#library-status'),
    favoritos: obtenerElemento('#favorites-list'),
    notas: obtenerElemento('#notes-list'),
    selectorObra: obtenerElemento('#note-work'),
    formularioNotas: obtenerElemento('#note-form'),
  };

  const renderizarBibliotecaEstado = (estado) => renderizarBiblioteca(
    estado.favoritos,
    estado.notas,
    {
      favoritos: ui.favoritos,
      notas: ui.notas,
      selectorObra: ui.selectorObra,
    },
  );

  const renderizarEstado = (estado) => {
    actualizarPestanaActiva(estado.categoriaActiva, ui.pestanas);
    ui.camposAnio.forEach((campo) => {
      campo.disabled = estado.categoriaActiva === 'autores';
    });
    ui.tituloResultados.textContent = estado.categoriaActiva === 'autores'
      ? 'Autores y autoras'
      : estado.autorSeleccionado
        ? `Obras de ${estado.autorSeleccionado.nombre ?? estado.autorSeleccionado.name}`
        : 'Obras del archivo';
    if (estado.categoriaActiva === 'autores') {
      renderizarAutores(ui.resultados, estado.resultados);
    } else {
      renderizarObras(ui.resultados, estado.resultados);
    }
    ui.cuentaResultados.textContent = `${estado.resultados.length} ${
      estado.resultados.length === 1 ? 'registro' : 'registros'
    }`;
    renderizarPerfilAutor(ui.perfil, estado.autorSeleccionado);
  };

  const cancelarSuscripcion = suscribirse((estado, propiedades) => {
    if (propiedades.some((propiedad) => ['categoriaActiva', 'resultados', 'autorSeleccionado'].includes(propiedad))) {
      renderizarEstado(estado);
    }
    if (propiedades.some((propiedad) => ['favoritos', 'notas'].includes(propiedad))) {
      renderizarBibliotecaEstado(estado);
    }
  });
  window.addEventListener('pagehide', cancelarSuscripcion, { once: true });

  renderizarBibliografia(ui.bibliografia, FUENTES_BIBLIOGRAFICAS);
  actualizarResultados(AUTORES_27);

  ui.pestanas.forEach((pestana) => {
    pestana.addEventListener('click', () => {
      try {
        actualizarCategoria(pestana.dataset.category);
        actualizarAutorSeleccionado(null);
        actualizarResultados(pestana.dataset.category === 'autores' ? AUTORES_27 : []);
        mostrarFeedback(ui.estado, '');
      } catch (error) {
        mostrarFeedback(ui.estado, error.message, 'error');
      }
    });
  });

  ui.pestanas.forEach((pestana, indice) => {
    pestana.addEventListener('keydown', (evento) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) {
        return;
      }
      evento.preventDefault();
      const destino = evento.key === 'Home'
        ? 0
        : evento.key === 'End'
          ? ui.pestanas.length - 1
          : (indice + (evento.key === 'ArrowRight' ? 1 : ui.pestanas.length - 1)) % ui.pestanas.length;
      ui.pestanas[destino].focus();
      ui.pestanas[destino].click();
    });
  });

  ui.formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const { filtros: datos, incluirCatalogos } = leerFiltrosFormulario(ui.formulario);
    const validacion = validarFiltros({
      ...datos,
    }, obtenerEstado().categoriaActiva);

    if (!validacion.valido) {
      mostrarFeedback(ui.estado, validacion.errores.join(' '), 'error');
      return;
    }

    const { filtros } = validacion;
    const filtrosEstado = {
      autor: filtros.autor,
      genero: filtros.genero,
      idioma: filtros.idioma,
      rangoCronologico: { desde: filtros.desde ?? '', hasta: filtros.hasta ?? '' },
    };

    try {
      actualizarFiltros(filtrosEstado);
      mostrarFeedback(ui.estado, 'Buscando…');
      establecerCarga(ui.formulario, ui.indicadorCarga, true);

      let resultado;
      if (obtenerEstado().categoriaActiva === 'autores') {
        resultado = await buscarAutoresController(filtros, incluirCatalogos);
      } else {
        resultado = await buscarObrasController(filtros, incluirCatalogos);
      }
      if (resultado.advertencia) {
        mostrarFeedback(
          ui.estado,
          `Se muestran los resultados del archivo local. ${resultado.advertencia}`,
          'error',
        );
      } else {
        mostrarFeedback(ui.estado, `Búsqueda completada: ${resultado.resultados.length} resultados.`, 'success');
      }
    } catch (error) {
      mostrarFeedback(ui.estado, error.message || 'No se pudo completar la búsqueda.', 'error');
    } finally {
      establecerCarga(ui.formulario, ui.indicadorCarga, false);
    }
  });

  ui.resultados.addEventListener('click', async (evento) => {
    const boton = evento.target.closest('button[data-action]');
    if (!boton || !ui.resultados.contains(boton)) {
      return;
    }

    if (boton.dataset.action === 'author-detail') {
      try {
        const autor = {
          id: boton.dataset.authorId,
          key: boton.dataset.authorKey,
          nombre: boton.dataset.authorName,
        };
        mostrarFeedback(ui.estado, `Cargando obras de ${autor.nombre}…`);
        await cargarObrasDeAutor(autor);
        const perfil = await enriquecerPerfilAutor(autor);
        renderizarEstado(obtenerEstado());
        mostrarFeedback(
          ui.estado,
          perfil.advertencia
            ? `Obras cargadas. El resumen complementario no está disponible: ${perfil.advertencia}`
            : 'Perfil y obras cargados.',
          perfil.advertencia ? 'info' : 'success',
        );
      } catch (error) {
        mostrarFeedback(ui.estado, error.message || 'No se pudieron cargar las obras del autor.', 'error');
      }
      return;
    }

    if (boton.dataset.action === 'favorite-add') {
      try {
        await agregarFavoritoController({
          obraId: boton.dataset.workId,
          titulo: boton.dataset.title,
          autor: boton.dataset.author,
          categoria: boton.dataset.genre,
          año: boton.dataset.year,
          descripcion: boton.dataset.description,
        });
        mostrarFeedback(ui.estado, 'Obra guardada en Mi biblioteca del 27.', 'success');
      } catch (error) {
        mostrarFeedback(ui.estado, error.message || 'No se pudo guardar la obra.', 'error');
      }
    }
  });

  ui.favoritos.addEventListener('click', async (evento) => {
    const boton = evento.target.closest('button[data-action="favorite-delete"]');
    if (!boton || !ui.favoritos.contains(boton)) {
      return;
    }
    try {
      await eliminarFavoritoController(boton.dataset.id);
      ui.bibliotecaEstado.textContent = 'Biblioteca sincronizada.';
      mostrarFeedback(ui.estado, 'Obra eliminada de la biblioteca.', 'success');
    } catch (error) {
      mostrarFeedback(ui.estado, error.message || 'No se pudo eliminar la obra.', 'error');
    }
  });

  ui.formularioNotas.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = new FormData(ui.formularioNotas);
    try {
      await guardarNotaController(datos.get('obra'), datos.get('texto'));
      ui.formularioNotas.reset();
      ui.bibliotecaEstado.textContent = 'Biblioteca sincronizada.';
      mostrarFeedback(ui.estado, 'Nota de lectura guardada.', 'success');
    } catch (error) {
      mostrarFeedback(ui.estado, error.message || 'No se pudo guardar la nota.', 'error');
    }
  });

  try {
    await cargarBibliotecaController();
    ui.bibliotecaEstado.textContent = 'Biblioteca conectada y sincronizada.';
  } catch (error) {
    ui.bibliotecaEstado.textContent = 'No se pudo conectar con json-server. Inicia la API local para guardar favoritos y notas.';
    mostrarFeedback(ui.estado, error.message || 'La API local de la biblioteca no está disponible.', 'error');
  }

  renderizarEstado(obtenerEstado());
  renderizarBibliotecaEstado(obtenerEstado());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    inicializarAplicacion().catch((error) => console.error('No se pudo iniciar el archivo.', error));
  }, { once: true });
} else {
  inicializarAplicacion().catch((error) => console.error('No se pudo iniciar el archivo.', error));
}