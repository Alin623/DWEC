# Contratos de módulos y API

## Catálogo local

`AUTORES_27` es un array de registros con `id`, `nombre`, `nacimiento`, `fallecimiento`, `lugar`, `perfil`, `etiquetas`, `obras` y `fuentes`. Cada obra contiene `titulo`, `año`, `genero` y `descripcion`. `FUENTES_BIBLIOGRAFICAS` contiene el nombre, tipo, URL y descripción de cada recurso.

## API pública

- `buscarAutores(nombre)` solicita `GET https://openlibrary.org/search/authors.json?q=...&limit=30` y devuelve `docs`.
- `buscarObras(filtros)` solicita `GET https://openlibrary.org/search.json` con autor/tema, idioma y rango cronológico; devuelve `docs`.
- `obtenerObrasAutor(clave)` solicita `GET https://openlibrary.org/authors/{clave}/works.json` y devuelve `entries`.
- `obtenerResumenAutor(titulo)` solicita `GET https://es.wikipedia.org/api/rest_v1/page/summary/{titulo}` y exige un `extract` textual.

El acceso externo se activa expresamente desde el formulario. La aplicación conserva el resultado local si el proveedor no está disponible.

## API privada

Base URL: `http://localhost:3000`.

| Método | Recurso | Uso |
|---|---|---|
| GET | `/favoritos` | Leer las obras guardadas |
| POST | `/favoritos` | Añadir una obra al archivo personal |
| DELETE | `/favoritos/:id` | Eliminar un favorito |
| GET | `/notas` | Leer notas de lectura |
| POST | `/notas` | Crear una nota vinculada a un favorito |

`db.json` es la semilla local. Los favoritos guardan `titulo`, `autor`, `categoria`, `obraId`, `año`, `descripcion` y `fechaAgregado`; las notas guardan `obraId`, `tituloObra`, `textoNota` y `fecha`.

## Estado

`obtenerEstado()` devuelve una instantánea con `categoriaActiva`, `filtrosActivos`, `resultados`, `favoritos`, `notas` y `autorSeleccionado`. `suscribirse(callback)` devuelve una función para cancelar la suscripción. Los actualizadores validan entradas y notifican qué propiedades cambiaron.

## Errores

`customFetch()` rechaza errores de red, HTTP no satisfactorio y JSON inválido. `ApiError` mantiene `status` y `statusText`. Las capas de API añaden contexto y los controladores/app muestran errores legibles sin convertirlos en resultados ficticios.