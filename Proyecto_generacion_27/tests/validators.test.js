import test from 'node:test';
import assert from 'node:assert/strict';
import { validarFiltros } from '../src/js/utils/validators.js';

test('acepta filtros válidos de obras con límites cronológicos', () => {
  const resultado = validarFiltros({
    autor: ' Luis Cernuda ',
    genero: 'Poesía',
    idioma: 'es',
    desde: '1930',
    hasta: '1945',
  }, 'obras');

  assert.equal(resultado.valido, true);
  assert.equal(resultado.filtros.autor, 'Luis Cernuda');
  assert.equal(resultado.filtros.desde, 1930);
});

test('rechaza rangos invertidos y consultas de obras sin criterios', () => {
  const rangoInvalido = validarFiltros({
    autor: '',
    genero: '',
    idioma: 'es',
    desde: '1945',
    hasta: '1930',
  }, 'obras');
  const consultaVacia = validarFiltros({
    autor: '',
    genero: '',
    idioma: 'es',
    desde: '',
    hasta: '',
  }, 'obras');

  assert.equal(rangoInvalido.valido, false);
  assert.ok(rangoInvalido.errores.some((error) => error.includes('posterior')));
  assert.equal(consultaVacia.valido, false);
});

test('rechaza idioma y categoría fuera del contrato', () => {
  const resultado = validarFiltros({
    autor: 'Lorca',
    genero: '',
    idioma: 'xx',
    desde: '',
    hasta: '',
  }, 'invalida');

  assert.equal(resultado.valido, false);
  assert.equal(resultado.errores.length, 2);
});
