# Archivo Histórico y Literario de la Generación del 27

Prefinal académica para **Desarrollo Web en Entorno Cliente (2.º DAW)**. Aplicación web sin frameworks que reúne perfiles de autoría, una bibliografía local seleccionada, búsqueda en Open Library y una biblioteca personal persistida con json-server.

## Contenido del archivo

- 14 perfiles de poetas y artistas, incluidas Ernestina de Champourcín, Concha Méndez, Josefina de la Torre y Maruja Mallo.
- 74 referencias seleccionadas de poesía, teatro, ensayo y pintura, con año, género y una breve guía de lectura.
- Fichas y filtros que funcionan con el catálogo incluido, sin depender de servicios externos.
- Ampliación opcional mediante Open Library y resúmenes de Wikipedia.
- Favoritos y notas de lectura persistidos en `db.json`.
- Fuentes documentales institucionales enlazadas para contrastar y ampliar los datos.

Las obras registradas son una selección orientativa, no bibliografías críticas exhaustivas. Las fechas remiten a primeras publicaciones conocidas o a la edición original indicada por las fuentes; algunas obras aparecieron en recopilaciones o ediciones posteriores.

## Requisitos

- Node.js 18 o posterior y npm.
- Conexión a Internet solo para instalar dependencias y consultar Open Library/Wikipedia.
- La búsqueda local funciona sin Internet. Favoritos y notas requieren que json-server esté activo.

## Puesta en marcha

Desde la carpeta del proyecto, instala las dependencias:

```bash
npm install
```

Inicia la interfaz en una terminal:

```bash
npm run dev
```

En otra terminal, inicia la API local:

```bash
npm run api
```

Abre la dirección que indique Vite (habitualmente `http://127.0.0.1:5173`). La API de json-server queda disponible en `http://localhost:3000`; al usar otro puerto, actualiza `API_URL` en `src/js/api/privateApi.js`.

## Uso

1. Explora las fichas o filtra autores por nombre y tema.
2. Cambia a **Obras** para buscar por autor, género y rango de publicación.
3. Selecciona **Ampliar con Open Library** para añadir registros del catálogo público. Si el servicio no responde, se conserva y se muestra el resultado local.
4. Abre una ficha para consultar las obras conocidas del catálogo y, cuando exista, un resumen complementario de Wikipedia.
5. Guarda una obra y añade notas desde **Mi biblioteca del 27**.
6. Contrasta los datos y localiza ediciones en **Bibliografía y archivos**.

## Estructura

```text
src/
  data/autores27.js          Catálogo local y fuentes bibliográficas
  css/                       Variables, base, layout y componentes
  js/api/                    HTTP, Open Library, Wikipedia y json-server
  js/controllers/            Búsqueda, estado y biblioteca
  js/ui/                     Renderizado seguro de tarjetas y listas
  js/utils/                  Validación y modelos
docs/                        Arquitectura, contratos, manual y pruebas
db.json                      Datos iniciales para json-server
```

## Comprobaciones

```bash
npm test
```

El plan de pruebas manual y los flujos principales están descritos en [docs/plan-pruebas.md](./docs/plan-pruebas.md). Para conocer los endpoints y las responsabilidades de cada capa, consulta [docs/arquitectura.md](./docs/arquitectura.md) y [docs/contratos.md](./docs/contratos.md).

## Autoría y alcance

Proyecto de Dumitru Alin Ionescu — 2.º DAW. Esta versión es una prefinal: la selección de autorías y obras es educativa y debe contrastarse con los catálogos y archivos enlazados antes de una publicación académica definitiva.