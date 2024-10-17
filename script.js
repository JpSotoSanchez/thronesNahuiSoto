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

app.route("/").get((req, res) => {
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

app.post("/search", (req, res) => {
  const word = encodeURIComponent(req.body.character);
  const url = `https://anapioficeandfire.com/api/characters?name=${word}`;
  https
    .get(url, (response) => {
      let resContent = "";
      response.on("data", (data) => {
        resContent += data;
      });

      response.on("end", () => {
        try {
          const jsonObj = JSON.parse(resContent);
          if (jsonObj.length > 0) {
            const character = jsonObj[0];
            res.render("individual.ejs", {
              character: character,
            });
          } else {
            res.send("Personaje no encontrado. Intenta con otro nombre.");
          }
        } catch (error) {
          console.log("Error al parsear la respuesta", error);
          res.send("Error al procesar los datos. Inténtalo de nuevo.");
        }
      });
    })
    .on("error", (e) => {
      console.log("Error al realizar la solicitud", e);
      res.send("Error en la solicitud. Inténtalo de nuevo.");
    });
});

app.post("/backhome", (req, res) => {
  res.redirect("/");
});

// Esto inicia el servidor y hace que escuche en el puerto 5000
app.listen(3000, () => {
  console.log("Listening on port 3000"); // Mensaje en la consola cuando el servidor está listo
});
