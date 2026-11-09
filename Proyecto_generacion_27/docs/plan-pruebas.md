# Plan de pruebas y criterios de aceptación

## Pruebas automatizadas

Ejecutar `npm test`. Las pruebas cubren normalización y validación de los filtros, el rango cronológico y el formato de los datos locales.

## Pruebas manuales

| ID | Escenario | Resultado esperado |
|---|---|---|
| UI-01 | Abrir la aplicación con json-server activo | Se ven perfiles locales, bibliografía y estado de biblioteca sincronizada |
| UI-02 | Buscar “garcia lorca” en Autores | La ficha de Federico García Lorca aparece sin exigir coincidencia de tildes |
| UI-03 | Abrir un perfil local | Aparece la biografía, sus fuentes y sus obras; un fallo de Wikipedia no borra el perfil |
| UI-04 | Buscar obras de “Cernuda” entre 1930 y 1945 | Solo se muestran registros locales coincidentes con autor y fechas |
| UI-05 | Enviar una búsqueda con el año inicial posterior al final | La búsqueda no se envía y se anuncia el error de validación |
| UI-06 | Activar Open Library con conexión | Se combinan resultados locales y externos sin duplicar nombres/títulos |
| UI-07 | Activar Open Library sin conexión | Se conservan los resultados locales y se muestra el error externo |
| UI-08 | Guardar la misma obra dos veces | La segunda operación se rechaza con un aviso; no duplica el registro |
| UI-09 | Guardar y quitar un favorito | El cambio persiste en `/favoritos` y se refleja en la lista |
| UI-10 | Añadir una nota a una obra guardada | La nota aparece tras recargar desde `/notas` |
| UI-11 | Detener json-server | Se informa que la biblioteca no está disponible; el archivo local sigue navegable |
| A11Y-01 | Recorrer pestañas con teclado | Las flechas, Inicio y Fin cambian la pestaña y conservan el foco |
| A11Y-02 | Usar zoom y ventana móvil | No hay desbordamiento horizontal; tarjetas y formularios se apilan |
| SEC-01 | Mostrar texto con etiquetas HTML en una búsqueda/nota | El texto se muestra literalmente, sin crear elementos ejecutables |

## Criterios de prefinal

- La interfaz carga datos locales sin llamadas de red obligatorias.
- Los formularios validan antes de cualquier petición.
- La capa HTTP comprueba `response.ok` y propaga el estado de error.
- Las tarjetas, alertas y listas se crean con nodos seguros.
- Favoritos y notas se escriben y vuelven a leer desde json-server.
- Las cifras del catálogo se verifican con una prueba de consistencia del dataset.