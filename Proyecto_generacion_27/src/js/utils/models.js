/**
 * Normaliza un registro de autor de Open Library para su representación.
 *
 * @param {object|null} autor Registro externo.
 * @returns {object|null}
 */
export function normalizarAutorOpenLibrary(autor) {
  if (!autor || typeof autor.name !== 'string' || autor.name.trim().length === 0) {
    return null;
  }

  return {
    key: typeof autor.key === 'string' ? autor.key : '',
    name: autor.name.trim(),
    top_work: typeof autor.top_work === 'string' ? autor.top_work : '',
    work_count: Number.isInteger(autor.work_count) ? autor.work_count : null,
    fuenteExterna: 'Open Library',
  };
}

/**
 * Normaliza un registro de obra de Open Library manteniendo solo autores válidos.
 *
 * @param {object|null} obra Registro externo.
 * @returns {object|null}
 */
export function normalizarObraOpenLibrary(obra) {
  if (!obra || typeof obra.title !== 'string' || obra.title.trim().length === 0) {
    return null;
  }

  const autores = Array.isArray(obra.author_name)
    ? obra.author_name.filter((nombre) => typeof nombre === 'string' && nombre.trim())
    : Array.isArray(obra.authors)
      ? obra.authors.map((autor) => autor?.name).filter((nombre) => typeof nombre === 'string' && nombre.trim())
      : [];

  return {
    ...obra,
    title: obra.title.trim(),
    author_name: autores,
    first_publish_year: Number.isInteger(obra.first_publish_year) ? obra.first_publish_year : null,
  };
}