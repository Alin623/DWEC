export function mostrarFeedback(elemento, mensaje, tipo = 'info') {
  elemento.textContent = mensaje;
  elemento.dataset.type = tipo;
  elemento.hidden = mensaje.length === 0;
  elemento.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
}

export function establecerCarga(formulario, indicador, cargando) {
  formulario.setAttribute('aria-busy', String(cargando));
  formulario.querySelectorAll('button[type="submit"]').forEach((boton) => {
    boton.disabled = cargando;
  });
  indicador.hidden = !cargando;
}

export function actualizarPestanaActiva(categoria, pestanas) {
  pestanas.forEach((pestana) => {
    const activa = pestana.dataset.category === categoria;
    pestana.setAttribute('aria-selected', String(activa));
    pestana.tabIndex = activa ? 0 : -1;
    pestana.classList.toggle('is-active', activa);
  });

  const pestanaActiva = pestanas.find((pestana) => pestana.dataset.category === categoria);
  const panel = document.querySelector('[role="tabpanel"]');
  if (pestanaActiva && panel) {
    panel.setAttribute('aria-labelledby', pestanaActiva.id);
  }
}