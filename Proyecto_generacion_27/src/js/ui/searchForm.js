export function leerFiltrosFormulario(formulario) {
  if (!(formulario instanceof HTMLFormElement)) {
    throw new TypeError('Se esperaba un formulario de búsqueda válido.');
  }

  const datos = new FormData(formulario);
  return {
    filtros: {
      autor: datos.get('autor'),
      genero: datos.get('genero'),
      idioma: datos.get('idioma'),
      desde: datos.get('desde'),
      hasta: datos.get('hasta'),
    },
    incluirCatalogos: datos.get('externos') === 'on',
  };
}