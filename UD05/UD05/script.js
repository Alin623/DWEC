document.addEventListener("DOMContentLoaded", function () {
  
  // Selección de elementos del DOM
  const form = document.getElementById("petForm");
  const formTitle = document.getElementById("formTitle");
  const nombre = document.getElementById("nombre");
  const descripcion = document.getElementById("descripcion");
  const imagen = document.getElementById("imagen");
  const fecha = document.getElementById("fecha");
  const precio = document.getElementById("precio");
  const codigo = document.getElementById("codigo");
  const btnGuardar = document.getElementById("btnGuardar");
  const btnCancelar = document.getElementById("btnCancelar");
  const lista = document.getElementById("listaMascotas");

  // Elementos de la sección de detalle
  const detalle = document.getElementById("detalle");
  const btnCerrarDetalle = document.getElementById("btnCerrarDetalle");


  // Datos en memoria y variables de estado
  const pets = [];           // Array donde guardamos las mascotas (objetos)
  let codigoEditando = null; // Código de la mascota que se está editando (null = modo agregar)
  let codigoDetalle = null;  // Código de la mascota cuyo detalle se muestra


  // Gestión de eventos principales

  // Al enviar el formulario: validar y agregar o actualizar
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página

    if (validateForm()) {
      // Creamos el objeto mascota con los datos del formulario
      const pet = {
        nombre: nombre.value.trim(),
        descripcion: descripcion.value.trim(),
        imagen: imagen.value.trim(),
        fecha: fecha.value,
        precio: Number(precio.value),
        codigo: codigo.value.trim().toUpperCase()
      };

      if (codigoEditando == null) {
        // Crear: añadimos la mascota al array
        pets.push(pet);
      } else {
        // Actualizar: sustituimos la mascota que estamos editando
        const index = pets.findIndex(p => p.codigo == codigoEditando);
        pets[index] = pet;
        // Si su detalle estaba abierto, lo refrescamos
        if (codigoDetalle == codigoEditando) {
          codigoDetalle = pet.codigo;
          mostrarDetalle(pet);
        }
      }

      resetForm();
      renderPets();
    }
  });

  // Botón cancelar edición
  btnCancelar.addEventListener("click", resetForm);

  // Botón cerrar detalle
  btnCerrarDetalle.addEventListener("click", function () {
    detalle.classList.add("oculto");
    codigoDetalle = null;
  });

  // Delegación de eventos: un solo listener en la lista para los botones de todas las fichas
  lista.addEventListener("click", function (event) {
    const accion = event.target.dataset.accion;
    const cod = event.target.dataset.codigo;
    if (!accion) return; // Si no se ha pulsado un botón de acción, salimos

    const pet = pets.find(p => p.codigo == cod);

    if (accion == "editar") {
      cargarFormulario(pet);
    } else if (accion == "eliminar") {
      eliminarMascota(cod);
    } else if (accion == "detalle") {
      codigoDetalle = pet.codigo;
      mostrarDetalle(pet);
    }
  });




  // Validación de formularios y campos

  // Valida todos los campos y devuelve true si todo está bien
  function validateForm() {
    let isValid = true;

    // Nombre obligatorio
    if (nombre.value.trim() == "") {
      markFieldAsNotValid(nombre);
      isValid = false;
    } else {
      markFieldAsValid(nombre);
    }

    // URL de imagen obligatoria y con formato correcto
    if (!isValidImageUrl(imagen.value.trim())) {
      markFieldAsNotValid(imagen);
      isValid = false;
    } else {
      markFieldAsValid(imagen);
    }

    // Fecha obligatoria y no futura
    if (!isValidDate(fecha.value)) {
      markFieldAsNotValid(fecha);
      isValid = false;
    } else {
      markFieldAsValid(fecha);
    }

    // Precio mayor que cero
    if (!isValidPrice(precio.value)) {
      markFieldAsNotValid(precio);
      isValid = false;
    } else {
      markFieldAsValid(precio);
    }

    // Código con formato correcto y que no esté repetido
    if (!isValidCode(codigo.value.trim())) {
      markFieldAsNotValid(codigo, "El código debe tener 3 letras seguidas de 3 números (ej: CAT123).");
      isValid = false;
    } else if (codeExists(codigo.value.trim().toUpperCase())) {
      markFieldAsNotValid(codigo, "Ya existe una mascota con ese código.");
      isValid = false;
    } else {
      markFieldAsValid(codigo);
    }

    return isValid;
  }

  // URL que empiece por http(s) y acabe en .jpg, .jpeg, .png o .gif
  function isValidImageUrl(url) {
    const regex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i;
    return regex.test(url);
  }

  // Código: tres letras seguidas de tres números
  function isValidCode(code) {
    const regex = /^[A-Za-z]{3}[0-9]{3}$/;
    return regex.test(code);
  }

  // Fecha: no vacía y no futura
  function isValidDate(value) {
    if (value == "") return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ponemos la hora a 00:00 para comparar solo el día
    const fechaNac = new Date(value + "T00:00:00");
    return fechaNac <= hoy;
  }

  // Precio: número mayor que 0
  function isValidPrice(value) {
    return value != "" && Number(value) > 0;
  }

  // Comprueba si el código ya lo tiene otra mascota (ignorando la que se edita)
  function codeExists(code) {
    return pets.some(p => p.codigo == code && p.codigo != codigoEditando);
  }

  // Marca un campo como no válido (y cambia el mensaje si se indica uno)
  function markFieldAsNotValid(element, message) {
    if (message) {
      element.parentNode.querySelector(".error-message").textContent = message;
    }
    element.parentNode.classList.add("is-not-valid-field");
  }

  // Marca un campo como válido
  function markFieldAsValid(element) {
    element.parentNode.classList.remove("is-not-valid-field");
  }



  //Operaciones CRUD y renderizado visual

  // Pinta todas las fichas en el DOM (se llama tras cada cambio)
  function renderPets() {
    lista.innerHTML = ""; // Vaciamos la lista antes de pintar

    if (pets.length == 0) {
      lista.textContent = "Todavía no hay mascotas.";
      return;
    }

    pets.forEach(function (pet) {
      // Ficha
      const ficha = document.createElement("article");
      ficha.classList.add("ficha");

      // Imagen
      const img = document.createElement("img");
      img.src = pet.imagen;
      img.alt = "Foto de " + pet.nombre;

      // Textos
      const titulo = document.createElement("h3");
      titulo.textContent = pet.nombre;

      const desc = document.createElement("p");
      desc.textContent = pet.descripcion;

      const nac = document.createElement("p");
      nac.textContent = "Nacimiento: " + formatearFecha(pet.fecha);

      const prec = document.createElement("p");
      prec.textContent = "Precio: " + pet.precio.toFixed(2) + " €";

      const cod = document.createElement("p");
      cod.textContent = "Código: " + pet.codigo;

      // Botones (guardamos la acción y el código en atributos data-)
      const btnDetalle = crearBoton("Ver detalles", "detalle", pet.codigo);
      const btnEditar = crearBoton("Editar", "editar", pet.codigo);
      btnEditar.classList.add("btn-editar");
      const btnEliminar = crearBoton("Eliminar", "eliminar", pet.codigo);
      btnEliminar.classList.add("btn-eliminar");

      // Añadimos todo a la ficha y la ficha a la lista
      ficha.append(img, titulo, desc, nac, prec, cod, btnDetalle, btnEditar, btnEliminar);
      lista.appendChild(ficha);
    });
  }

  // Crea un botón con su texto, acción y código de mascota
  function crearBoton(texto, accion, cod) {
    const boton = document.createElement("button");
    boton.textContent = texto;
    boton.dataset.accion = accion;
    boton.dataset.codigo = cod;
    return boton;
  }

  // Elimina una mascota del array
  function eliminarMascota(cod) {
    if (!confirm("¿Seguro que quieres eliminar esta mascota?")) return;

    const index = pets.findIndex(p => p.codigo == cod);
    pets.splice(index, 1);

    // Si estábamos editando o viendo esa mascota, limpiamos
    if (codigoEditando == cod) resetForm();
    if (codigoDetalle == cod) {
      detalle.classList.add("oculto");
      codigoDetalle = null;
    }

    renderPets();
  }

  // Pasa los datos de una mascota al formulario para editarla
  function cargarFormulario(pet) {
    codigoEditando = pet.codigo;
    nombre.value = pet.nombre;
    descripcion.value = pet.descripcion;
    imagen.value = pet.imagen;
    fecha.value = pet.fecha;
    precio.value = pet.precio;
    codigo.value = pet.codigo;

    formTitle.textContent = "Editar mascota";
    btnGuardar.textContent = "Guardar cambios";
    btnCancelar.classList.remove("oculto");
    quitarErrores();
    window.scrollTo(0, 0); // Subimos para ver el formulario
  }

  // Deja el formulario listo para agregar una mascota nueva
  function resetForm() {
    form.reset();
    codigoEditando = null;
    formTitle.textContent = "Nueva mascota";
    btnGuardar.textContent = "Agregar Mascota";
    btnCancelar.classList.add("oculto");
    quitarErrores();
  }

  // Quita los marcados de error de todos los campos
  function quitarErrores() {
    form.querySelectorAll(".form-group").forEach(function (grupo) {
      grupo.classList.remove("is-not-valid-field");
    });
  }

  // Rellena la sección de detalle con los datos de la mascota
  function mostrarDetalle(pet) {
    document.getElementById("detalleImagen").src = pet.imagen;
    document.getElementById("detalleImagen").alt = "Foto de " + pet.nombre;
    document.getElementById("detalleNombre").textContent = pet.nombre;
    document.getElementById("detalleDescripcion").textContent = pet.descripcion || "Sin descripción";
    document.getElementById("detalleFecha").textContent = formatearFecha(pet.fecha);
    document.getElementById("detalleEdad").textContent = calcularEdad(pet.fecha);
    document.getElementById("detallePrecio").textContent = pet.precio.toFixed(2) + " €";
    document.getElementById("detalleCodigo").textContent = pet.codigo;
    detalle.classList.remove("oculto");
  }


  
  // Funciones auxiliares y de formateo
  
  // Convierte "2024-03-15" en "15/03/2024"
  function formatearFecha(valor) {
    return valor.split("-").reverse().join("/");
  }

  // Calcula la edad en años y meses a partir de la fecha de nacimiento
  function calcularEdad(valor) {
    const hoy = new Date();
    const nac = new Date(valor + "T00:00:00");
    let meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
    if (hoy.getDate() < nac.getDate()) meses--; // Aún no ha cumplido el mes
    const anios = Math.floor(meses / 12);
    return anios + " año(s) y " + (meses % 12) + " mes(es)";
  }

  // Pintamos la lista vacía al cargar la página
  renderPets();
});