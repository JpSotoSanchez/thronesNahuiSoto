// Importa el módulo 'express' que es un framework para construir servidores web en Node.js
const express = require("express");

// Crea una aplicación de Express que manejaremos para definir rutas y responder a solicitudes
const app = express();

// Importa otros módulos:
// - 'https': para realizar solicitudes HTTP seguras
// - 'FormData': para construir formularios que envían datos multipart/form-data
// - 'mongoose': para conectarse y trabajar con bases de datos MongoDB
const https = require("https");
const mincharacters = 1;
const maxcharacters = 2134;

// Configuración de Middlewares: Son funciones que se ejecutan cuando llega una solicitud al servidor
// Permite que nuestra aplicación maneje datos en formato JSON en las solicitudes (útil en APIs)
app.use(express.json());

// Permite manejar datos enviados a través de formularios HTML codificados en URL
// Esto es importante para procesar datos de formularios sin que estén en formato JSON
app.use(express.urlencoded({ extended: true }));

// Configura EJS como el motor de plantillas que usaremos para renderizar vistas dinámicas (HTML con variables)
// Esto nos permite generar páginas HTML de manera más flexible y reutilizable
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static("public"));

// Middleware personalizado para manejar errores y mostrar un mensaje de error al cliente
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

app.route('/').get((req, res) => {
  res.render("home.ejs", {});
});

/*
let currentCharacterIndex = 0; 

app.post("/next", (req, res) => {
  currentCharacterIndex++; 
  res.redirect("/"); 
});

app.post("/back", (req, res) => {
  currentCharacterIndex--; 
  res.redirect("/"); 
});
*/

app.post('/backhome', (req, res) => {
  res.redirect("/");
});

app.post('/search', (req, res) => {
  let nombre = req.body.character.toLowerCase().split(' '); 
  for (let j = 0; j < nombre.length; j++) {
    nombre[j] = nombre[j].charAt(0).toUpperCase() + nombre[j].slice(1); 
  }
  nombre = nombre.join(' '); 
  const characterName = encodeURIComponent(nombre);
  const url1 = `https://thronesapi.com/api/v2/Characters`; // Primera API
  const url2 = `https://anapioficeandfire.com/api/characters?name=${characterName}`; // Segunda API
  let characterData1 = null;
  let characterData2 = null;
  let datos1 = null;
  https.get(url1, (response) => {
    let resContent1 = '';
    response.on("data", (data) => {
      resContent1 += data;
    });

    response.on("end", () => {
      const jsonObj1 = JSON.parse(resContent1);
      characterData1 = Array.isArray(jsonObj1) ? jsonObj1 : []; // Asegurarse de que sea un array

      // Si no se encontró en la primera API, seguir buscando en la segunda API
      if (!characterData1.length) {
        console.log("No se encontró en la primera API, buscando en la segunda...");
      }
      // Llamar a la segunda API
      https.get(url2, (response) => {
        let resContent2 = '';
        response.on("data", (data) => {
          resContent2 += data;
        });
        response.on("end", () => {
          const jsonObj2 = JSON.parse(resContent2);
          characterData2 = Array.isArray(jsonObj2) && jsonObj2.length > 0 ? jsonObj2[0] : null; // Obtener el primer personaje
          // Si hay personajes en la primera API, buscar coincidencias
          if (characterData1.length > 0 && characterData2) {
            for (let i = 0; i < characterData1.length; i++) {
              if (characterData1[i].fullName === characterData2.name) {
                datos1 = characterData1[i]; // Almacenar el personaje que coincide
                break;
              }
            }
          }
          // Comprobar si se encontró en alguna de las APIs
          if (datos1 && characterData2) {
            res.render("individual.ejs", {
              character1: datos1,
              character2: characterData2,
            });
          } else if (!datos1 && characterData2) {
            res.render("individual.ejs", {
              character1: null, // Asumiendo que characterData1[0] podría ser relevante
              character2: characterData2,
            });
          } else {
            res.send("Personaje no encontrado. Intenta con otro nombre.");
          }
        });
      }).on("error", (e) => {
        console.log("Error al realizar la solicitud a la segunda API", e);
        res.send("Error en la solicitud a la segunda API.");
      });
    });
  }).on("error", (e) => {
    console.log("Error al realizar la solicitud a la primera API", e);
    res.send("Error en la solicitud a la primera API.");
  });
});


app.listen(3000, () => {
  console.log("Listening on port 3000"); 
});
