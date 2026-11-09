# Manual de usuario

## Abrir la aplicación

1. Instala dependencias con `npm install`.
2. Ejecuta `npm run dev` y `npm run api` en terminales distintas.
3. Abre la URL que muestra Vite. El catálogo y la bibliografía local aparecen al cargar.

Si json-server no está iniciado, podrás navegar y buscar, pero las operaciones de biblioteca mostrarán un aviso de conexión.

## Buscar

- En **Autores**, escribe un nombre y, opcionalmente, un tema. La búsqueda local ignora diferencias de mayúsculas y tildes.
- En **Obras**, introduce al menos un autor, un tema o un año. El límite inferior/superior puede usarse de manera independiente.
- El rango permite encontrar publicaciones dentro de los años indicados; el formulario avisa si los valores no son enteros o el inicio es posterior al final.
- Activa **Ampliar con Open Library** para consultar también el catálogo público. La selección de idioma se aplica a esa consulta.
- Usa las pestañas con el ratón o con las flechas izquierda/derecha; Inicio y Fin llevan a la primera y última pestaña.

## Consultar una ficha

Selecciona **Ver perfil y obras** para abrir la ficha editorial y mostrar sus obras locales. El resumen de Wikipedia es complementario; si Wikipedia no responde, permanece visible la información curada del archivo.

## Biblioteca y notas

- Pulsa **Guardar en mi biblioteca** en una obra.
- Elimina una entrada con **Quitar**.
- Selecciona una obra guardada, escribe una nota (hasta 1000 caracteres) y pulsa **Guardar nota**.
- Las modificaciones se escriben en `db.json` mediante json-server y se vuelven a cargar desde el servidor.

## Bibliografía

La sección **Bibliografía y archivos** enlaza a catálogos institucionales, bibliotecas digitales, archivos y fuentes de contexto. Se recomienda usar el catálogo de la BNE para comprobar la edición concreta antes de citar una obra.