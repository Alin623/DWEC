# Guía del Proyecto: Archivo Histórico y Literario de la Generación del 27

Este repositorio contiene una aplicación web académica desarrollada con **JavaScript Moderno (ES6+)** sin frameworks externos, cumpliendo estrictamente con los requisitos de la asignatura **DWEC** (Ciclo DAW2).

## Estructura Clave de Directorios y Responsabilidades
- `src/js/api/`: Servicios HTTP centralizados. Contiene el cliente fetch genérico (`http.js`), las llamadas a Open Library (`openLibrary.js`), Wikipedia (`wikipedia.js`) y la persistencia local de la API privada (`privateApi.js` con `json-server`).
- `src/js/controllers/`: Lógica de negocio, gestión del estado global (`state.js`) y orquestación de los flujos de anidamiento de búsquedas (Niveles 1, 2 y 3).
- `src/js/ui/`: Manipulación dinámica del DOM, renderizado de tarjetas de autores/obras, estados de carga (*spinners*) y alertas visuales.
- `src/css/`: Estilos CSS modulares basados en Custom Properties (variables), CSS Grid y Flexbox para diseño responsive.
- `db.json`: Base de datos local para el `json-server` encargada de almacenar favoritos y notas críticas ("Mi Biblioteca del 27").

## Principios de Desarrollo Obligatorios para Ediciones Multi-archivo
1. **Separación de Responsabilidades (SoC)**: Jamás mezcles lógica de red directa en la interfaz de usuario ni manipules el DOM desde los servicios de API. Toda comunicación pasa por los controladores.
2. **Programación Asíncrona Robusta**: Utiliza siempre `async / await` envueltos en bloques `try...catch` con validación explícita de `response.ok`.
3. **Programación Defensiva**: Las APIs públicas devuelven a veces datos nulos o incompletos. Utiliza operadores de encadenamiento opcional (`?.`) y valores por defecto (`??`) para evitar que la aplicación rompa en el DOM.
4. **Validaciones Previas**: Los formularios de búsqueda multiparámetro (mínimo 3-4 parámetros) deben validarse en JavaScript antes de disparar las peticiones asíncronas.