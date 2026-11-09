import test from 'node:test';
import assert from 'node:assert/strict';
import { AUTORES_27, FUENTES_BIBLIOGRAFICAS } from '../src/data/autores27.js';
import { buscarAutoresController } from '../src/js/controllers/authorsController.js';
import { buscarObrasController } from '../src/js/controllers/worksController.js';
import {
  normalizarAutorOpenLibrary,
  normalizarObraOpenLibrary,
} from '../src/js/utils/models.js';

test('el catálogo local mantiene perfiles completos y bibliografía seleccionada', () => {
  assert.equal(AUTORES_27.length, 14);
  assert.ok(AUTORES_27.reduce((total, autor) => total + autor.obras.length, 0) >= 70);
  assert.equal(new Set(AUTORES_27.map((autor) => autor.id)).size, AUTORES_27.length);
  assert.ok(AUTORES_27.every((autor) => (
    autor.nombre && autor.perfil && autor.obras.length > 0 && autor.fuentes.length > 0
  )));
  assert.ok(FUENTES_BIBLIOGRAFICAS.length >= 6);
  assert.ok(FUENTES_BIBLIOGRAFICAS.every((fuente) => /^https:\/\//.test(fuente.url)));
});

test('los modelos externos descartan registros incompletos y normalizan datos opcionales', () => {
  assert.equal(normalizarAutorOpenLibrary({ key: '/authors/OL1A' }), null);
  assert.deepEqual(normalizarAutorOpenLibrary({ name: '  Autora  ' }), {
    key: '',
    name: 'Autora',
    top_work: '',
    work_count: null,
    fuenteExterna: 'Open Library',
  });
  assert.deepEqual(normalizarObraOpenLibrary({
    title: '  Libro  ',
    authors: [{ name: 'Autora' }, null],
    first_publish_year: '1930',
  }), {
    title: 'Libro',
    authors: [{ name: 'Autora' }, null],
    author_name: ['Autora'],
    first_publish_year: null,
  });
});

test('la búsqueda local de autores normaliza mayúsculas y tildes', async () => {
  const resultado = await buscarAutoresController({
    autor: 'garcia lorca',
    genero: '',
  });

  assert.equal(resultado.resultados.length, 1);
  assert.equal(resultado.resultados[0].nombre, 'Federico García Lorca');
  assert.equal(resultado.advertencia, '');
});

test('la búsqueda local filtra obras por autor, género y rango cronológico', async () => {
  const resultado = await buscarObrasController({
    autor: 'Cernuda',
    genero: 'poesía',
    desde: 1930,
    hasta: 1945,
  });

  assert.ok(resultado.resultados.length > 0);
  assert.ok(resultado.resultados.every((obra) => (
    obra.autor === 'Luis Cernuda'
      && obra.año >= 1930
      && obra.año <= 1945
      && obra.genero === 'Poesía'
  )));
});
