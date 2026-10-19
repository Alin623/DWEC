fetch("./heros.json")
  .then((response) => {
    return response.json();
  })
  .then((jsondata) => procesarJSON(jsondata))
  .catch((e) => {
    console.log(e);
  });

function procesarJSON(jsondata) {

  const plantilla = document.getElementById("plantilla");
  const contenedor = plantilla.parentNode;
  const heroes = jsondata.data.results;

  heroes.forEach((heroe) => {
    // 1. Clonar la plantilla y evitar ids repetidos
    const tarjeta = plantilla.cloneNode(true);
    tarjeta.id = "heroe-" + heroe.id;

    // 2. Imagen
    const imagen = tarjeta.querySelector("img");
    imagen.setAttribute("src", heroe.thumbnail.path.replace("http://", "https://") + "." + heroe.thumbnail.extension);
    imagen.setAttribute("alt", heroe.name);

    // 3. Título y descripción
    tarjeta.querySelector(".card-title").textContent = heroe.name;
    tarjeta.querySelector(".card-text").textContent = heroe.description || "Sin descripción disponible.";

    // 4. Lista de cómics: vaciar y rellenar
    const lista = tarjeta.querySelector(".list-group");
    while (lista.firstElementChild) {
      lista.removeChild(lista.firstElementChild);
    }

    const comics = heroe.comics.items.slice(0, 3);
    if (comics.length === 0) {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.textContent = "Sin cómics disponibles";
      lista.appendChild(li);
    } else {
      comics.forEach((comic) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = comic.name;
        lista.appendChild(li);
      });
    }

    // 5. Colgar la tarjeta en el contenedor
    contenedor.appendChild(tarjeta);
  });

  // 6. Quitar la plantilla original
  contenedor.removeChild(plantilla);

  /*
 
  Ahora crea un enlace al final del footer que permita descargar el HTML que has creado
 
  */

  const a = document.createElement("a");
  //cuidadiinn joorrlll, que estamos con un literal de cadena
  const archivo = new Blob(
    [
      `
      <!doctype html>
      <html lang="en">
      ` +
        document.head.outerHTML +
        `
    
    
    
    
      <!-- Todo lo que viene ahora lo has creado tu solit@ con javascript y jugando con el DOM
           y esto solo la punta del iceberg de todo lo que vas a crear!!!
           venga! vamos a por ello  -->
    
    
    
    
    
    
    
      ` +
        document.body.outerHTML +
        `
      </html>`,
    ],
    { type: "html" }
  );
  const url = URL.createObjectURL(archivo);
  a.href = url;
  a.download = "statico.html";
  a.innerHTML = "descarga el htlm que has creado con js y el dom";
  document.getElementsByTagName("footer")[0].appendChild(a);
}
