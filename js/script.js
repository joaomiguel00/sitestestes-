document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("aberto");
    });
  }

  var form = document.querySelector(".form-contato");
  if (form) {
    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var aviso = document.querySelector(".aviso-envio");
      if (aviso) {
        aviso.textContent =
          "Mensagem enviada com sucesso (site de teste, nenhum dado foi realmente enviado).";
      }
      form.reset();
    });
  }
});
