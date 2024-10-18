// Importa el módulo 'express' que es un framework para construir servidores web en Node.js
const express = require("express");
const https = require("https"); // Para realizar solicitudes HTTP seguras

// Crea una aplicación de Express
const app = express();

// Configuración de Middlewares
app.use(express.json()); // Permite manejar datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Maneja datos enviados a través de formularios HTML
app.set("view engine", "ejs"); // Configura EJS como el motor de plantillas
app.use(express.static("public")); // Permite servir archivos estáticos

// Middleware personalizado para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack); // Muestra el error en la consola
  res.status(500).send("Something went wrong"); // Responde con un mensaje de error
});

var iterador=1;
var min=1;
var max=2134;

// Ruta principal que renderiza la página de inicio
app.get('/', (req, res) => {
  res.render("home.ejs",{iterador});
});

// Función para hacer una solicitud HTTPS y obtener datos
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let resContent = '';
      response.on("data", (data) => resContent += data);
      response.on("end", () => resolve(JSON.parse(resContent))); // Resuelve la promesa con los datos obtenidos
    }).on("error", (error) => reject(error)); // Rechaza la promesa en caso de error
  }); 
};

// Ruta para buscar un personaje por nombre
// Ruta para buscar un personaje por nombre
app.get('/search/:characterName', async (req, res) => {
  console.log("Entramos en search")
    try {
      // Captura y formatea el nombre del personaje desde la URL
      const characterName = encodeURIComponent(req.params.characterName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra
        .join(' ')); // Une las palabras en un solo string
  
      // URLs de las APIs
      const url1 = `https://thronesapi.com/api/v2/Characters`;
      const url2 = `https://anapioficeandfire.com/api/characters?name=${characterName}`;
      let datos1="";
      // Llama a las APIs
      const [characterData1, characterData2] = await Promise.all([fetchData(url1), fetchData(url2)]);
      // Verifica qué datos recibimos
      // Busca coincidencias entre los resultados de las dos APIs
      if (characterData1.length > 0 && characterData2) {
        for (let i = 0; i < characterData1.length; i++) {
          if (characterData1[i].fullName == characterData2[0].name) {
            datos1 = characterData1[i]; // Almacenar el personaje que coincide
            break;
          }
        }
      }
      // Renderiza la vista con los datos encontrados
      if (datos1 && characterData2) {
        res.render("individual.ejs", {
          character1: datos1,
          character2: characterData2[0],
          
        });
      } else if (characterData2)  {
        res.render("individual.ejs", {
          character1: null,
          character2: characterData2[0],
          
        });
      }
      else{
        res.render("error.ejs"); 
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error); // Muestra el error en la consola
      res.send("Error en la solicitud."); // Responde con un mensaje de error
    }
});



app.get('/cards', async (req, res) => {
  iterador=1;
  console.log("Entramos en cards")
  try {
    const url1 = `https://thronesapi.com/api/v2/Characters`;
    const url2 = `https://anapioficeandfire.com/api/characters/${iterador}`;
    let datos1="";
    // Llama a las APIs
    const [characterData1, characterData2] = await Promise.all([fetchData(url1), fetchData(url2)]);
    console.log(characterData2);
    console.log(characterData2[0]);
    if (characterData1.length > 0 && characterData2) {
      for (let i = 0; i < characterData1.length; i++) {
        if (characterData1[i].fullName == characterData2.name) {
          datos1 = characterData1[i]; // Almacenar el personaje que coincide
          break;
        }
      }
    }
    if (datos1 && characterData2) {
      res.render("individual.ejs", {
        character1: datos1,
        character2: characterData2[0],
      });
    } else if (characterData2)  {
      res.render("individual.ejs", {
        character1: null,
        character2: characterData2[0],
      });
    }
    else{
      res.render("error.ejs"); 
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error); // Muestra el error en la consola
    res.send("Error en la solicitud."); // Responde con un mensaje de error
  }
});
  
// Otras rutas para navegación
app.get('/backhome', (req, res) => res.redirect("/")); // Redirige a la página de inicio
app.get('/about', (req, res) => res.render("about.ejs")); // Renderiza la página 'about'
app.get('/houses', (req, res) => res.render("houses.ejs")); // Renderiza la página de casas

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
