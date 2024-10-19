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
  console.log("Entramos en search");
  try {
    const characterName = encodeURIComponent(req.params.characterName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '));

    const url1 = `https://thronesapi.com/api/v2/Characters`;
    const url2 = `https://anapioficeandfire.com/api/characters?name=${characterName}`;
    let datos1 = "";
    const [characterData1, characterData2] = await Promise.all([fetchData(url1), fetchData(url2)]);
    if (characterData1.length > 0 && Array.isArray(characterData2) && characterData2.length > 0) {
      for (let i = 0; i < characterData1.length; i++) {
        if (characterData1[i].fullName.toLowerCase() === characterData2[0].name.toLowerCase() || (characterData1[i].firstName.toLowerCase()+" "+characterData1[i].lastName.toLowerCase()) === characterData2[0].name.toLowerCase() ) {
          datos1 = characterData1[i];
          // Extraer el número de la URL en characterData2[0].url
          const urlParts = characterData2[0].url.split('/');
          iterador = urlParts[urlParts.length - 1]; // El último elemento es el número
          break;
        }
      }
    }

    if (datos1 && characterData2.length > 0) {
      console.log("TENGO AMBOS");
      console.log(datos1);
      console.log(characterData2);
      res.render("individual.ejs", {
        character1: datos1,
        character2: characterData2[0],
      });
    } else if (characterData2.length > 0) {
      console.log("TENGO solo1");
      console.log(datos1);
      console.log(characterData2[0]);
      res.render("individual.ejs", {
        character1: null,
        character2: characterData2[0],
      });
    } else {
      res.render("error.ejs");
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    res.send("Error en la solicitud.");
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
        character2: characterData2,
      });
    } else if (characterData2)  {
      res.render("individual.ejs", {
        character1: null,
        character2: characterData2,
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

app.get('/nextcharacter', async (req, res) => {
  if (iterador+1>max){
    iterador=min;
  }
  else{
    iterador+=1;
  }
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
        character2: characterData2,
      });
    } else if (characterData2)  {
      res.render("individual.ejs", {
        character1: null,
        character2: characterData2,
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

app.get('/backcharacter', async (req, res) => {
  if (iterador-1<min){
    iterador=max;
  }
  else{
    iterador-=1;
  }
  console.log("Entramos en cards")
  try {
    const url1 = `https://thronesapi.com/api/v2/Characters`;
    const url2 = `https://anapioficeandfire.com/api/characters/${iterador}`;
    let datos1="";
    // Llama a las APIs
    const [characterData1, characterData2] = await Promise.all([fetchData(url1), fetchData(url2)]);
    console.log("Datos1");
    console.log(characterData2);
    console.log("Datos1.2");
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
        character2: characterData2,
      });
    } else if (characterData2)  {
      res.render("individual.ejs", {
        character1: null,
        character2: characterData2,
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
app.get('/backhome', async (req, res) => res.redirect("/")); // Redirige a la página de inicio

app.get('/houses', async (req, res) => {
  const url1 = `https://thronesapi.com/api/v2/Characters`;
  const characters = await fetchData(url1); // Aquí es correcto
  // Supongamos que 'characters' es un array de objetos de personajes
  // Inicializa el Map
  let diccionario = new Map();


  // Recorre el array de personajes
  for (let i = 0; i < characters.length; i++) {
    const personaje = characters[i];
    if (personaje.family == "Targaryan") {
      personaje.family = "Targaryen"; // Cambia la familia a "Targaryen"
    }
    if (personaje.family == "Unkown") {
      personaje.family = "Unknown"; // Cambia la familia a "Targaryen"
    }
    if (personaje.family == "Lorathi") {
      personaje.family = "Lorath"; // Cambia la familia a "Targaryen"
    }
    if (personaje.family == "Sand" || personaje.family == "Viper" || personaje.family == "Worm") {
      personaje.family = "Martell"; // Cambia la familia a "Targaryen"
    }
    if (personaje.family == "Qyburn") {
      personaje.family = "Bolton"; // Cambia la familia a "Targaryen"
    }

    // Verifica si el personaje tiene una familia
    if (personaje.family) {
      // Simplifica el nombre de la casa (remueve "House " y recorta espacios)
      const familiaSimplificada = personaje.family.replace(/^House\s+/i, '').trim();

      // Si la familia no existe en el Map, inicialízala como un array
      if (!diccionario.has(familiaSimplificada)) {
        diccionario.set(familiaSimplificada, []); // Inicializa un array para esa familia
      }

      // Agrega el personaje completo al array correspondiente a la familia
      diccionario.get(familiaSimplificada).push(personaje);
    }
  }

  // Muestra el diccionario
  console.log(diccionario);
  
  // Renderiza la vista con el diccionario
  res.render("houses.ejs", { diccionario });
});



// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
