async function iniciarInteracciones() {
  await prepararCatalogo();
  const pagina = document.body.dataset.pagina;
  const parametros = new URLSearchParams(window.location.search);
  const buscador = document.querySelector("#search");
  const categoria = document.querySelector("#catselect");
  const orden = document.querySelector("#sort");
  const distrito = document.querySelector("#district");
  const tarjetas = [...document.querySelectorAll(".card")];
  const dialogo = document.querySelector("#dialog");
  let modalidad = "todas";
  let favoritos = [];

  try {
    favoritos = JSON.parse(localStorage.getItem("tayta-favoritos") || "[]");
  } catch {
    favoritos = [];
  }

  function avisar(mensaje) {
    document.querySelector("#dialogcontent").textContent = mensaje;
    dialogo.showModal();
  }

  function normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function actualizarFavoritos() {
    document.querySelector("#favcount").textContent = favoritos.length;
    document.querySelectorAll("[data-fav]").forEach((boton) => {
      const guardado = favoritos.includes(boton.dataset.fav);
      boton.classList.toggle("saved", guardado);
      boton.setAttribute("aria-pressed", String(guardado));
      const title = boton.closest(".card")?.querySelector("h3")?.textContent;
      if (title)
        boton.setAttribute(
          "aria-label",
          (guardado ? "Quitar de favoritos: " : "Guardar en favoritos: ") +
            title,
        );
      boton.textContent = boton.classList.contains("heart")
        ? guardado
          ? "♥"
          : "♡"
        : guardado
          ? "♥ Guardada"
          : "♡ Guardar";
    });
  }

  function filtrar() {
    let visibles = 0;
    tarjetas.forEach((tarjeta) => {
      const coincideTexto = normalizar(tarjeta.textContent).includes(
        normalizar(buscador.value),
      );
      const coincideCategoria =
        !categoria?.value || tarjeta.dataset.categoria === categoria.value;
      const coincideModalidad =
        modalidad === "todas" ||
        tarjeta.dataset.modalidad === modalidad ||
        (tarjeta.dataset.modalidad === "ambas" &&
          ["virtual", "presencial"].includes(modalidad));
      const coincideDistrito =
        !distrito?.value || tarjeta.dataset.distrito === distrito.value;
      const coincideFavorito =
        pagina !== "favoritos" || favoritos.includes(tarjeta.dataset.id);
      tarjeta.hidden = !(
        coincideTexto &&
        coincideCategoria &&
        coincideModalidad &&
        coincideDistrito &&
        coincideFavorito
      );
      if (!tarjeta.hidden) visibles += 1;
    });
    const contador = document.querySelector("#resultcount");
    if (contador)
      contador.textContent = `${visibles} ${visibles === 1 ? "clase disponible" : "clases disponibles"}`;
    const vacio = document.querySelector("#sin-resultados");
    if (vacio) vacio.hidden = visibles !== 0;
  }

  buscador.value = parametros.get("q") || "";
  if (categoria) categoria.value = parametros.get("categoria") || "";

  document.querySelectorAll("[data-nav]").forEach((enlace) => {
    enlace.classList.toggle("active", enlace.dataset.nav === pagina);
  });

  document.querySelectorAll("[data-filter]").forEach((boton) => {
    boton.addEventListener("click", () => {
      modalidad = boton.dataset.filter;
      document
        .querySelectorAll("[data-filter]")
        .forEach((otro) => otro.classList.toggle("selected", otro === boton));
      filtrar();
    });
  });

  categoria?.addEventListener("change", filtrar);
  distrito?.addEventListener("change", filtrar);
  if (tarjetas.length) buscador.addEventListener("input", filtrar);

  orden?.addEventListener("change", () => {
    const propiedad =
      orden.value === "precio"
        ? "precio"
        : orden.value === "duracion"
          ? "duracion"
          : "posicion";
    tarjetas.sort(
      (a, b) => Number(a.dataset[propiedad]) - Number(b.dataset[propiedad]),
    );
    tarjetas.forEach((tarjeta) => tarjeta.parentElement.append(tarjeta));
  });

  document.querySelectorAll("[data-fav]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.fav;
      favoritos = favoritos.includes(id)
        ? favoritos.filter((valor) => valor !== id)
        : [...favoritos, id];
      try {
        localStorage.setItem("tayta-favoritos", JSON.stringify(favoritos));
      } catch {
        avisar(
          "El navegador no permite guardar favoritos. Se conservarán solo mientras esta página permanezca abierta.",
        );
      }
      actualizarFavoritos();
      if (tarjetas.length) filtrar();
    });
  });

  document
    .querySelector(".close")
    .addEventListener("click", () => dialogo.close());
  document
    .querySelector("#contrast")
    .addEventListener("click", () =>
      document.body.classList.toggle("contrast"),
    );
  document
    .querySelector("#textsize")
    .addEventListener("click", () => document.body.classList.toggle("large"));

  document.querySelector("#reserve")?.addEventListener("click", () => {
    const horario = document.querySelector("#schedule");
    if (!horario.value) {
      document.querySelector("#scheduleerror").textContent =
        "Selecciona un horario para continuar.";
      horario.focus();
      return;
    }
    document.querySelector("#scheduleerror").textContent = "";
    avisar(
      "Has seleccionado " +
        (document.querySelector("#student-modality")?.value || "esta clase") +
        ": " +
        horario.value +
        ". Las reservas reales se incorporarán próximamente. Esta acción no genera una inscripción ni un cobro.",
    );
  });

  document
    .querySelector("#syllabus")
    ?.addEventListener("click", () =>
      avisar(
        "Revisa el apartado «Esto te llevarás de la clase». El video se incorporará próximamente.",
      ),
    );

  actualizarFavoritos();
  if (tarjetas.length) filtrar();

  const studentModality = document.querySelector("#student-modality");
  if (studentModality) {
    studentModality.addEventListener("change", () => {
      const virtual = studentModality.value === "Virtual";
      document.querySelector("#offering-price").textContent = virtual
        ? "S/ 25 por persona"
        : "S/ 30 por persona";
      document.querySelector("#offering-mode").textContent = virtual
        ? "Virtual en directo"
        : "Presencial";
      document.querySelector("#offering-place").textContent = virtual
        ? "Desde tu casa"
        : "Pueblo Libre";
    });
  }
}
iniciarInteracciones().catch((error) => {
  const status = document.querySelector("#catalog-storage-status");
  if (status) status.textContent = error.message;
});
