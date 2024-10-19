window.onload = function () {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling;

      // Contraer todos los demás contenidos
      document
        .querySelectorAll(".accordion-content")
        .forEach((otherContent) => {
          if (otherContent !== content) {
            otherContent.style.maxHeight = null; // Contraer los demás
          }
        });

      // Alternar el contenido actual
      if (content.style.maxHeight) {
        content.style.maxHeight = null; // Contraer si ya está desplegado
      } else {
        content.style.maxHeight = content.scrollHeight + "px"; // Desplegar el contenido
      }
    });
  });
};
