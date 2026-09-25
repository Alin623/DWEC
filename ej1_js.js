// Escuchamos el evento de clic
  console.log("El botón fue presionado correctamente.");
  let n1 = "Alin";
  let n2 = "Ionescu"
  let nombreCompleto = n1 + " " + n2;
  console.log(nombreCompleto);
  let mayusculas = nombreCompleto.toUpperCase();
  console.log(mayusculas);
  let minusculas = nombreCompleto.toLowerCase();
  console.log(minusculas);
  let pillar = nombreCompleto.substring(0,6);
  console.log(pillar);
  let slice = nombreCompleto.slice(" , ");
  let direccion = `Calle Falsa 123
        Ciudad Springfield
        62704`;
  


        console.log("!Hola fucking word¿");
        console.info("!Hola fucking word¿");
        console.warn("!Hola fucking word¿");
        console.error("!Hola fucking word¿");

        /*
        alert("Tus muertos coño, no toques")

        let userInput= prompt("Joder pa que tocas, Porfa anda dime tu name:")
        console.log("El pana se llama: " + userInput)

        let confirmado = confirm("Realmente te llamas así machote?:")
        if(confirmado){
          console.log("Dpm bro");
        }else{
          console.log("Qué liada macho");
        }

        let num1 = 5;
        let num2 = 8;
        total = num1-num2;
        */
      
        let tipo1 = typeof 124;
        console.log(tipo1);
        let decimalFijo = (123.434).toFixed(2);
        console.log(decimalFijo);
        let saludo = 'Hola campeón como estamos'
        let dividirCadena = saludo.split(" "); // ['Hola', 'mundo']
        console.log(dividirCadena);

        let num3 = '1234';
        let es = isNaN(num3);
        console.log(es)

        let fruit = "naranja";

switch (fruit) {
  case "manzana":
    console.log("Esto es una manzana.");
    break;
  case "platano":
    console.log("Esto es un plátano.");
    break;
  case "naranja":
    console.log("Esto es una naranja.");
    break;
  case "zanahoria":
    console.log("Cuidao que se lo come Manolo.");
    break;
  default:
    console.log("Fruta desconocida.");
}

let person = { name: "John", age: 30, city: "New York" };
for (let key in person) {
  console.log(key + ": " + person[key]);
}

let fruits = ["apple", "banana", "orange"];
for (let fruit of fruits) {
  console.log(fruit);
}

const users = [
  //sabemos lo que es name y age
  { name: "John", age: 15 },
  { name: "Jane", age: 25 },
  { name: "Jim", age: 35 },
  { name: "Manolo", age: 2 },
];

users.forEach((user)=>{
  //console.log(`${user.name} tiene ${user.age} años.`);
  if(user.age>=18){
    console.log(`El usuario ${user.name} es mayor de edad`);
  }else{
    console.log(`El usuario ${user.name} es menor de edad`)
  }
})



function add(a,b){
  return a - b;
}
let result = add(10,30);
console.log(result);


const divide = function(c,d){
  return c/d;
}
let resulDiv =divide(15,3);
console.log(resulDiv);


const f1 = function (a){
  return a + 100;
};


const f2 = (a) =>{
  return a + 100;
};

const f3 = (a) => a+100;

const f4 = function add(a,b){
  return a+b;
}

const f5 = (a,b) => a+b
console.log(f4(5,3));
console.log(f5(10,20))

// User Agent
let infoNavegador = navigator.userAgent;
console.log(`User-Agent: ${infoNavegador}`);

// Información de la Plataforma
let infoPlataforma = navigator.platform;
console.log(`Plataforma: ${infoPlataforma}`);

// Geolocalización
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("Latitud:", position.coords.latitude);
      console.log("Longitud:", position.coords.longitude);
    },
    (error) => {
      console.error("Error al obtener la geolocalización:", error);
    }
  );
} else {
  console.error("La geolocalización no es soportada por este navegador.");
}


function A(callBack){
  console.log("Dentro de la función A")
  callBack(); // Aquí ejecuta B (B es callBack  )
}

function B(){
  console.log("Función callback B ejecutada")
}
A(B);