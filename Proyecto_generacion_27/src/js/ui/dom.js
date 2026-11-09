export function obtenerElemento(selector, raiz = document) {
  const elemento = raiz.querySelector(selector);
  if (!elemento) {
    throw new Error(`No se encontró el elemento requerido: ${selector}`);
  }

  return elemento;
}

export function crearElemento(etiqueta, { clase = '', texto = '' } = {}) {
  const elemento = document.createElement(etiqueta);
  if (clase) {
    elemento.className = clase;
  }
  if (texto) {
    elemento.textContent = texto;
  }
  return elemento;
}

export function renderizarEstadoVacio(contenedor, mensaje) {
  const etiqueta = contenedor.tagName === 'UL' ? 'li' : 'p';
  const estado = crearElemento(etiqueta, { clase: 'empty-state', texto: mensaje });
  contenedor.replaceChildren(estado);
}