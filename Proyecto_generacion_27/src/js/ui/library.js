import { crearElemento, renderizarEstadoVacio } from './dom.js';

function texto(elemento, clase, contenido) {
  return crearElemento(elemento, { clase, texto: contenido ?? '' });
}

export function renderizarBiblioteca(favoritos, notas, contenedores) {
  const listaFavoritos = contenedores.favoritos;
  const listaNotas = contenedores.notas;
  const selectorObra = contenedores.selectorObra;
  const opciones = [crearElemento('option', { texto: 'Selecciona una obra guardada' })];
  opciones[0].value = '';

  if (!Array.isArray(favoritos) || favoritos.length === 0) {
    renderizarEstadoVacio(listaFavoritos, 'Tu biblioteca está vacía. Guarda una obra desde los resultados.');
  } else {
    const fragmento = document.createDocumentFragment();
    favoritos.forEach((favorito) => {
      const item = crearElemento('li', { clase: 'library-item' });
      const contenido = crearElemento('div');
      contenido.append(
        texto('h4', '', favorito.titulo ?? 'Obra sin título'),
        texto('p', '', `${favorito.autor ?? 'Autoría no indicada'} · ${favorito.categoria ?? 'Obra'}`),
      );
      const eliminar = crearElemento('button', { clase: 'icon-button', texto: 'Quitar' });
      eliminar.type = 'button';
      eliminar.dataset.action = 'favorite-delete';
      eliminar.dataset.id = favorito.id ?? '';
      eliminar.setAttribute('aria-label', `Quitar ${favorito.titulo ?? 'obra'} de la biblioteca`);
      item.append(contenido, eliminar);
      fragmento.append(item);

      const opcion = crearElemento('option', {
        texto: `${favorito.titulo ?? 'Obra sin título'} — ${favorito.autor ?? 'Autoría desconocida'}`,
      });
      opcion.value = String(favorito.id ?? '');
      opciones.push(opcion);
    });
    listaFavoritos.replaceChildren(fragmento);
  }

  selectorObra.replaceChildren(...opciones);

  if (!Array.isArray(notas) || notas.length === 0) {
    renderizarEstadoVacio(listaNotas, 'Todavía no hay notas. Añade una reflexión o pregunta de lectura.');
  } else {
    const fragmento = document.createDocumentFragment();
    notas.forEach((nota) => {
      const item = crearElemento('li', { clase: 'library-item' });
      const contenido = crearElemento('div');
      contenido.append(
        texto('h4', '', nota.tituloObra ?? 'Nota de lectura'),
        texto('p', '', nota.textoNota ?? ''),
        texto('p', '', nota.fecha ?? ''),
      );
      item.append(contenido);
      fragmento.append(item);
    });
    listaNotas.replaceChildren(fragmento);
  }
}

export function renderizarBibliografia(contenedor, fuentes) {
  const fragmento = document.createDocumentFragment();
  fuentes.forEach((fuente) => {
    const tarjeta = crearElemento('article', { clase: 'bibliography-card' });
    tarjeta.append(
      crearElemento('p', { clase: 'card-meta', texto: fuente.tipo }),
      crearElemento('h3', { texto: fuente.nombre }),
      crearElemento('p', { texto: fuente.descripcion }),
    );
    const enlace = crearElemento('a', { texto: 'Visitar recurso' });
    enlace.href = fuente.url;
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    tarjeta.append(enlace);
    fragmento.append(tarjeta);
  });
  contenedor.replaceChildren(fragmento);
}