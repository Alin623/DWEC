# Arquitectura

## Capas

- **Presentación:** `index.html` define las regiones semánticas y `src/js/ui/` construye tarjetas, fichas, estados vacíos, bibliografía y biblioteca con nodos DOM y `textContent`.
- **Orquestación:** `src/js/app.js` registra eventos, valida formularios y coordina las vistas con los controladores.
- **Controladores y estado:** `src/js/controllers/` filtra el catálogo local, coordina búsquedas externas y sincroniza favoritos/notas. `state.js` publica instantáneas inmutables a sus suscriptores.
- **Servicios:** `src/js/api/` centraliza `fetch`, valida HTTP y expone funciones para Open Library, la API REST de Wikipedia y json-server.
- **Contenido:** `src/data/autores27.js` contiene perfiles y bibliografía editorial seleccionada. No depende de una petición de red para presentar el archivo inicial.

## Flujo de navegación

1. Al iniciar, se representa el catálogo local y las fuentes documentales.
2. La pestaña **Autores** filtra las fichas locales. Puede añadirse la búsqueda de nombres en Open Library.
3. Al abrir un autor local se presenta su perfil y se cargan sus obras. Los autores externos se resuelven desde Open Library.
4. La pestaña **Obras** busca en las obras locales por autor, tema y rango cronológico; el catálogo externo es opcional.
5. Las operaciones de biblioteca leen o escriben en json-server y solo actualizan el estado tras completar la operación.

## Resiliencia

El archivo local sigue disponible cuando fallan las APIs públicas. Los errores de catálogo externo se muestran junto con los resultados locales; los fallos de json-server se notifican y no impiden consultar ni buscar en el archivo. Los servicios HTTP rechazan respuestas no satisfactorias y JSON inválido.

## Accesibilidad y seguridad

- Navegación con etiquetas, regiones, pestañas ARIA, anuncios de estado y foco visible.
- Las pestañas admiten flechas, Inicio y Fin.
- Los datos externos se insertan como texto, nunca como HTML confiable.
- Enlaces externos usan `rel="noopener noreferrer"`.
- La interfaz no incorpora frameworks ni bibliotecas visuales de terceros.