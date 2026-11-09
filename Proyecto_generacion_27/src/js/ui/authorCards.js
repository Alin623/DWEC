import { crearElemento, renderizarEstadoVacio } from './dom.js';

function crearTarjetaAutor(autor) {
  const tarjeta = crearElemento('article', { clase: 'result-card' });
  const nombre = autor.nombre ?? autor.name ?? 'Autoría sin identificar';
  const obrasLocales = Array.isArray(autor.obras) ? autor.obras : [];
  const titulo = crearElemento('h3', { texto: nombre });
  const periodo = Number.isInteger(autor.nacimiento)
    ? `${autor.nacimiento}–${autor.fallecimiento ?? 'actualidad'}`
    : 'Catálogo externo';
  const metadatos = crearElemento('p', { clase: 'card-meta', texto: periodo });
  const descripcion = crearElemento('p', {
    texto: autor.perfil
      ?? (autor.top_work
        ? `Obra destacada: ${autor.top_work}`
        : `${autor.work_count ?? 'Varias'} obras registradas en Open Library.`),
  });
  const etiquetas = crearElemento('p', {
    texto: Array.isArray(autor.etiquetas) ? autor.etiquetas.join(' · ') : '',
  });
  const acciones = crearElemento('div', { clase: 'card-actions' });
  const boton = crearElemento('button', {
    clase: 'button',
    texto: autor.id ? 'Ver perfil y obras' : 'Consultar obras',
  });
  boton.type = 'button';
  boton.dataset.action = 'author-detail';
  boton.dataset.authorName = nombre;
  boton.dataset.authorId = autor.id ?? '';
  boton.dataset.authorKey = autor.key ?? '';
  boton.disabled = !autor.id && !autor.key;
  acciones.append(boton);
  if (obrasLocales.length > 0) {
    const obras = crearElemento('p', {
      clase: 'card-meta',
      texto: `${obrasLocales.length} referencias de obras`,
    });
    tarjeta.append(titulo, metadatos, descripcion, etiquetas, obras, acciones);
  } else {
    tarjeta.append(titulo, metadatos, descripcion, acciones);
  }
  return tarjeta;
}

export function renderizarAutores(contenedor, autores) {
  if (!Array.isArray(autores) || autores.length === 0) {
    renderizarEstadoVacio(contenedor, 'No se encontraron autores con esos criterios. Prueba otro nombre o tema.');
    return;
  }

  const fragmento = document.createDocumentFragment();
  autores.forEach((autor) => fragmento.append(crearTarjetaAutor(autor ?? {})));
  contenedor.replaceChildren(fragmento);
}

export function renderizarPerfilAutor(contenedor, autor) {
  if (!autor) {
    contenedor.replaceChildren();
    contenedor.hidden = true;
    return;
  }

  const perfil = crearElemento('div');
  perfil.append(
    crearElemento('p', { clase: 'eyebrow', texto: 'Ficha de autoría' }),
    crearElemento('h3', { texto: autor.nombre ?? autor.name ?? 'Autoría sin identificar' }),
    crearElemento('p', {
      clase: 'card-meta',
      texto: [autor.lugar, autor.nacimiento && `${autor.nacimiento}–${autor.fallecimiento ?? 'actualidad'}`]
        .filter(Boolean)
        .join(' · ') || 'Registro de catálogo externo',
    }),
    crearElemento('p', { texto: autor.perfil ?? 'No hay una biografía local disponible.' }),
  );

  if (autor.perfilWikipedia) {
    perfil.append(crearElemento('p', {
      texto: `Resumen de Wikipedia: ${autor.perfilWikipedia}`,
    }));
    if (autor.urlWikipedia) {
      const enlace = crearElemento('a', { texto: 'Consultar artículo en Wikipedia' });
      enlace.href = autor.urlWikipedia;
      enlace.target = '_blank';
      enlace.rel = 'noopener noreferrer';
      perfil.append(enlace);
    }
  }

  if (Array.isArray(autor.fuentes) && autor.fuentes.length > 0) {
    const lista = crearElemento('ul', { clase: 'source-chips' });
    autor.fuentes.forEach((fuente) => lista.append(crearElemento('li', { texto: fuente })));
    perfil.append(
      crearElemento('h4', { texto: 'Fuentes para ampliar' }),
      lista,
    );
  }

  contenedor.replaceChildren(perfil);
  contenedor.hidden = false;
}