// PRÁCTICA TEMA 3 - Arrays, Math y Objetos

// PARTE 1: ARRAYS

// 1. Creo el array de 10 elementos sin inicializar
const Numeros = new Array(10);

// 2. Lo relleno con números aleatorios entre 0 y 1000 con 2 decimales
// (multiplico por 100, redondeo y divido entre 100 para dejar 2 decimales)
for (let i = 0; i < Numeros.length; i++) {
    Numeros[i] = Math.round(Math.random() * 1000 * 100) / 100;
}

// 3. Lo imprimo recorriéndolo con un for
console.log("Numeros:");
for (let i = 0; i < Numeros.length; i++) {
    console.log(i + ": " + Numeros[i]);
}

// 4. Busco el mayor y el menor con Math.max y Math.min
let mayor = Numeros[0];
let menor = Numeros[0];
for (let i = 1; i < Numeros.length; i++) {
    mayor = Math.max(mayor, Numeros[i]);
    menor = Math.min(menor, Numeros[i]);
}
console.log("Mayor: " + mayor);
console.log("Menor: " + menor);

// 5. Posición de cada uno con indexOf
console.log("Posición del mayor: " + Numeros.indexOf(mayor));
console.log("Posición del menor: " + Numeros.indexOf(menor));

// 6. Los elimino con splice (posición, cuántos elimino) y muestro el array otra vez
Numeros.splice(Numeros.indexOf(mayor), 1);
Numeros.splice(Numeros.indexOf(menor), 1);
console.log("Numeros sin mayor ni menor:");
for (let i = 0; i < Numeros.length; i++) {
    console.log(i + ": " + Numeros[i]);
}

// 7. Array Raices: raíz cuadrada del primero, cúbica del segundo, etc.
// La raíz n es elevar a 1/n, y empieza en 2, por eso i + 2
const Raices = [];
for (let i = 0; i < Numeros.length; i++) {
    Raices.push(Numeros[i] ** (1 / (i + 2)));
}

// 8. Añado un 1 al principio con unshift y lo imprimo
Raices.unshift(1);
console.log("Raices:");
for (let i = 0; i < Raices.length; i++) {
    console.log(i + ": " + Raices[i]);
}

// 9. Añado a Numeros las raíces que son mayores que 1
for (let i = 0; i < Raices.length; i++) {
    if (Raices[i] > 1) {
        Numeros.push(Raices[i]);
    }
}

// 10. Ordeno Numeros (con sort hay que pasarle (a, b) => a - b para números) y lo imprimo
Numeros.sort((a, b) => a - b);
console.log("Numeros ordenados:");
for (let i = 0; i < Numeros.length; i++) {
    console.log(i + ": " + Numeros[i]);
}



// PARTE 2: OBJETOS

// Función para sacar un número entero aleatorio entre min y max (los dos incluidos)
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para sacar un color aleatorio con un switch
function colorAleatorio() {
    switch (aleatorio(1, 5)) {
        case 1:
            return "blanco";
        case 2:
            return "negro";
        case 3:
            return "marrón";
        case 4:
            return "gris";
        default:
            return "azul";
    }
}

// OVEJA
function Oveja(raza, maxLeche) {
    this.raza = raza;
    this.color = "blanco"; // valor por defecto
    this.maxLeche = maxLeche;
    this.esquilada = false;
    this.embarazada = false;
    this.lecheTotal = 0;

    this.setColor = function () {
        this.color = color;
    };

    this.esquilar = function () {
        this.esquilada = true;
    };

    this.quedarEmbarazada = function () {
        this.embarazada = true;
    };

    // Devuelve entre 0 y maxLeche litros. Si está embarazada devuelve 0
    this.ordeñar = function () {
        if (this.embarazada) {
            return 0;
        }
        const litros = aleatorio(0, this.maxLeche);
        this.lecheTotal = this.lecheTotal + litros;
        return litros;
    };

    this.balar = function () {
        console.log("Beeeee");
    };

    this.toString = function () {
        return "Oveja " + this.raza + ", color " + this.color + ", leche total: " + this.lecheTotal + " L";
    };
}


// CONEJO
function Conejo(colores, orejasArriba) {
    this.colores = colores;
    this.orejasArriba = orejasArriba;
    this.carino = aleatorio(0, 100);
    this.roedura = aleatorio(1, 100);

    this.setCarino = function (carino) {
        this.carino = carino;
    };

    this.indiceAchuchabilidad = function () {
        return this.carino / this.roedura;
    };

    this.esAchuchable = function () {
        return this.indiceAchuchabilidad() > 0.5;
    };

    this.achuchar = function () {
        if (this.esAchuchable()) {
            console.log("cariñitos");
        } else {
            console.log("buffffff");
        }
    };

    this.toString = function () {
        let texto = "Conejo de colores " + this.colores.toString();
        if (this.orejasArriba) {
            texto = texto + ", orejas pa arriba";
        } else {
            texto = texto + ", orejas pa abajo";
        }
        if (this.esAchuchable()) {
            texto = texto + " - quiero ser tu mejor amigooo";
        }
        return texto;
    };
}


// GALLINA
function Gallina(colorHuevos, edadMeses) {
    this.colorHuevos = colorHuevos;
    this.edadMeses = edadMeses;
    this.huevosTotales = 0;
    this.huevosSemana = 0; // huevos de la última semana
    this.diasSinPoner = 0;

    this.cacarear = function () {
        console.log("caaaaa caaaca ca caaaaaa");
    };
    this.ponerHuevo = function () {
        this.huevosTotales++;
        this.huevosSemana++;
        this.diasSinPoner = 0;
        this.cacarear();
    };
    this.pasarDia = function () {
        this.diasSinPoner++;
    };
    // Huevos puestos entre los días que lleva de adulta (pasados los 6 meses)
    this.ponibilidad = function () {
        const diasAdulta = (this.edadMeses - 6) * 30;
        if (diasAdulta <= 0) {
            return 0;
        }
        return this.huevosTotales / diasAdulta;
    };
    // Avisa si pasado el primer año la ponibilidad es menor de 0,1 o si lleva una semana sin poner
    this.comprobar = function () {
        if ((this.edadMeses > 12 && this.ponibilidad() < 0.1) || this.diasSinPoner >= 7) {
            console.log("Aviso a Gallina Blanca");
        }
    };
    this.toString = function () {
        let texto = "Gallina, huevos " + this.colorHuevos + ", total: " + this.huevosTotales + ", última semana: " + this.huevosSemana;
        if (this.ponibilidad() < 0.1) {
            texto = texto + " - Poooo po po po, me voy al puchero";
        }
        return texto;
    };
}


// VACA
function Vaca(colores, cuernos, maxLeche, tipoLeche) {
    this.colores = colores;
    this.cuernos = cuernos;
    this.maxLeche = maxLeche;
    this.tipoLeche = tipoLeche;
    this.embarazada = false;
    this.lecheTotal = 0;
    this.mugidos = 0; // para saber si ha mugido alguna vez

    this.quedarEmbarazada = function () {
        this.embarazada = true;
    };
    this.mugir = function () {
        this.mugidos++;
        console.log("muuuuuuu-cho cuidado que tengo cuernos");
    };
    // Como la oveja, pero a veces (3 de cada 10) muge al ordeñarla
    this.ordeñar = function () {
        if (this.embarazada) {
            return 0;
        }
        const litros = aleatorio(0, this.maxLeche);
        this.lecheTotal = this.lecheTotal + litros;
        if (aleatorio(1, 10) <= 3) {
            this.mugir();
        }
        return litros;
    };
    this.toString = function () {
        let texto = "Vaca de colores " + this.colores.toString() + ", leche " + this.tipoLeche + ", leche dada: " + this.lecheTotal + " L";
        if (this.embarazada) {
            texto = texto + " - estoy esperando un ternerito";
        }
        return texto;
    };
}


// GALLO
const COLORES_GALLO = ["azul", "verde", "amarillo", "marrón", "blanco", "negro", "gris"];

function Gallo(raza) {
    this.raza = raza;
    // Guardo los 7 colores en un array de 7 true/false, uno por cada color
    // (true = el gallo tiene ese color), en el mismo orden que COLORES_GALLO
    this.tieneColor = [];
    for (let i = 0; i < 7; i++) {
        this.tieneColor.push(aleatorio(0, 1) === 1);
    }
    this.ultimoCanto = null; // todavía no ha cantado

    // Devuelve los nombres de los colores que tiene
    this.getColores = function () {
        const lista = [];
        for (let i = 0; i < this.tieneColor.length; i++) {
            if (this.tieneColor[i]) {
                lista.push(COLORES_GALLO[i]);
            }
        }
        return lista;
    };

    // Canta entre las 4 y las 8, o si han pasado 5 minutos desde el último canto
    this.cantar = function () {
        const ahora = new Date();
        let canta = false;
        if (ahora.getHours() >= 4 && ahora.getHours() < 8) {
            canta = true;
        }
        if (this.ultimoCanto === null) {
            canta = true; // la primera vez canta
        } else if (ahora - this.ultimoCanto >= 1000 * 60 * 5) {
            canta = true; // han pasado 5 minutos (en milisegundos)
        }
        if (canta) {
            console.log("kikirikiiiiii");
            this.ultimoCanto = ahora;
        } else {
            console.log("poo popopo pooo");
        }
    };
    this.toString = function () {
        let hora = "todavía no ha cantado";
        if (this.ultimoCanto !== null) {
            hora = this.ultimoCanto.toLocaleTimeString();
        }
        return "Gallo " + this.raza + ", colores: " + this.getColores().toString() + ", último canto: " + hora;
    };
}


// PRUEBA DE UN ANIMAL DE CADA TIPO
console.log("\n PRUEBAS");

// Oveja churra y esquilada: 2 ordeños, embarazada, otro ordeño, y color marrón (balará)
const oveja = new Oveja("churra", 5);
oveja.esquilar();
console.log("Ordeño 1: " + oveja.ordeñar());
console.log("Ordeño 2: " + oveja.ordeñar());
oveja.quedarEmbarazada();
console.log("Ordeño embarazada: " + oveja.ordeñar());
oveja.setColor("marrón");
oveja.balar();

// Conejo RGB con orejas abajo: lo achucho y, si no es achuchable, subo el cariño y lo achucho otra vez
const conejo = new Conejo(["azul", "rojo", "verde"], false);
conejo.achuchar();
if (!conejo.esAchuchable()) {
    conejo.setCarino(100);
    conejo.achuchar();
}

// Gallina de 7 meses: ponibilidad 0, pone 3 huevos y compruebo otra vez
const gallina = new Gallina("azul fosforito", 7);
console.log("Ponibilidad: " + gallina.ponibilidad());
gallina.ponerHuevo();
gallina.ponerHuevo();
gallina.ponerHuevo();
console.log("Ponibilidad: " + gallina.ponibilidad());
gallina.comprobar();

// Vaca negra: la ordeño hasta que muja al menos una vez
const vaca = new Vaca(["negro"], 0.1, 20, "desnatada");
while (vaca.mugidos === 0) {
    vaca.ordeñar();
}
console.log("Leche que ha dado la vaca: " + vaca.lecheTotal + " L");

// Gallo azarqueliano que canta varias veces seguidas
const gallo = new Gallo("azarqueliana");
for (let i = 0; i < 4; i++) {
    gallo.cantar();
}

// Muestro los cinco animales con toString()
console.log("\n--- Los cinco animales ---");
console.log(oveja.toString());
console.log(conejo.toString());
console.log(gallina.toString());
console.log(vaca.toString());
console.log(gallo.toString());


// LA GRANJA
console.log("\n GRANJA");

// La creo con notación literal: cuatro cuadras (arrays) y el gallo de antes
const granja = {
    ovejas: [],
    conejos: [],
    gallinas: [],
    vacas: [],
    gallo: gallo,
};

const razas = ["churra", "merina", "latxa"];
const tiposLeche = ["entera", "desnatada", "semidesnatada", "merengada"];

// Cada cuadra tiene entre 5 y 10 animales.
// Guardo el número en una variable antes del for para que no cambie en cada vuelta.
let cantidad = aleatorio(5, 10);
for (let i = 0; i < cantidad; i++) {
    granja.ovejas.push(new Oveja(razas[aleatorio(0, 2)], aleatorio(1, 5)));
}

cantidad = aleatorio(5, 10);
for (let i = 0; i < cantidad; i++) {
    granja.conejos.push(new Conejo([colorAleatorio(), colorAleatorio()], aleatorio(0, 1) === 1));
}

cantidad = aleatorio(5, 10);
for (let i = 0; i < cantidad; i++) {
    granja.gallinas.push(new Gallina(colorAleatorio(), aleatorio(7, 40)));
}

cantidad = aleatorio(5, 10);
for (let i = 0; i < cantidad; i++) {
    granja.vacas.push(new Vaca([colorAleatorio()], aleatorio(1, 10) / 10, aleatorio(10, 30), tiposLeche[aleatorio(0, 3)]));
}

// Imprimo todos con for...of
console.log("--- Ovejas ---");
for (const o of granja.ovejas) {
    console.log(o.toString());
}
console.log("--- Conejos ---");
for (const c of granja.conejos) {
    console.log(c.toString());
}
console.log("--- Gallinas ---");
for (const g of granja.gallinas) {
    console.log(g.toString());
}
console.log("--- Vacas ---");
for (const v of granja.vacas) {
    console.log(v.toString());
}
console.log("--- Gallo ---");
console.log(granja.gallo.toString());



// ANIMALES SELECTOS 
console.log("\n ANIMALES SELECTOS");

// Con una lambda en sort ordeno cada cuadra de mayor a menor y cojo el primero [0]
const ovejaTop = granja.ovejas.sort((a, b) => b.maxLeche - a.maxLeche)[0];
const conejoTop = granja.conejos.sort((a, b) => b.indiceAchuchabilidad() - a.indiceAchuchabilidad())[0];
const gallinaTop = granja.gallinas.sort((a, b) => b.edadMeses - a.edadMeses)[0];
const vacaTop = granja.vacas.sort((a, b) => b.cuernos - a.cuernos)[0];

// Los guardo en AnimalesSelectos y los imprimo con toString()
const AnimalesSelectos = [ovejaTop, conejoTop, gallinaTop, vacaTop];
for (const animal of AnimalesSelectos) {
    console.log(animal.toString());
}


// Lo paso a JSON y lo imprimo
console.log("\n--- JSON ---");
console.log(JSON.stringify(AnimalesSelectos));