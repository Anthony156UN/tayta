const catalogImageUrls = [];
const catalogCovers = {
  Cocina: "cocina",
  Oficios: "madera",
  "Arte y costura": "arte",
  Tecnología: "tecnologia",
  Negocios: "negocios",
  "Idiomas y música": "musica",
};
function localImage(lesson) {
  if (!lesson.cover)
    return "assets/" + (catalogCovers[lesson.category] || "arte") + ".jpg";
  const url = URL.createObjectURL(lesson.cover);
  catalogImageUrls.push(url);
  return url;
}
async function prepararCatalogo() {
  const account = document.querySelector("[data-account]");
  try {
    const profile = await TaytaLocal.profile();
    if (account && profile) {
      account.textContent = profile.name;
      account.setAttribute("aria-label", "Mi cuenta: " + profile.name);
    }
  } catch {}
  const page = document.body.dataset.pagina;
  if (
    !["inicio", "explorar", "virtual", "presencial", "favoritos"].includes(page)
  )
    return;
  const grid =
    document.querySelector("#results .grid") ||
    document.querySelector("main .grid");
  if (!grid) return;
  const status = document.createElement("p");
  status.id = "catalog-storage-status";
  status.className = "field-help";
  status.setAttribute("role", "status");
  grid.before(status);
  try {
    const lessons = (await TaytaLocal.classes()).sort(
      (a, b) => (b.updated || b.created) - (a.updated || a.created),
    );
    for (const lesson of [...lessons].reverse()) {
      if (page === "virtual" && lesson.modality === "Presencial") continue;
      if (page === "presencial" && lesson.modality === "Virtual") continue;
      const source = grid.querySelector(".card");
      if (!source) continue;
      const card = source.cloneNode(true);
      card.dataset.id = lesson.id;
      card.dataset.categoria = lesson.category;
      card.dataset.modalidad = lesson.modality.toLowerCase();
      card.dataset.distrito = lesson.location || "";
      const prices = [
        lesson.modality !== "Presencial"
          ? Number(lesson.virtualPrice)
          : Infinity,
        lesson.modality !== "Virtual" ? Number(lesson.onsitePrice) : Infinity,
      ];
      card.dataset.precio = String(Math.min(...prices));
      card.dataset.duracion = lesson.duration;
      card.dataset.posicion = "-1";
      card.querySelectorAll("a").forEach((a) => {
        a.href = "mi-clase.html?id=" + encodeURIComponent(lesson.id);
        a.removeAttribute("aria-label");
      });
      const image = card.querySelector("img");
      image.src = localImage(lesson);
      image.alt = "Portada de " + lesson.title;
      card.querySelector(".badge").textContent =
        lesson.modality === "Ambas" ? "Virtual o presencial" : lesson.modality;
      card.querySelector("h3 a").textContent = lesson.title;
      card.querySelector(".cattext").textContent = lesson.category;
      card.querySelector(".teacherline").textContent = lesson.author;
      const bottom = card.querySelector(".cardbottom");
      bottom.replaceChildren();
      const duration = document.createElement("span");
      duration.textContent =
        lesson.duration +
        " min" +
        (lesson.location ? " · " + lesson.location : "");
      const price = document.createElement("span");
      price.className = "price";
      price.textContent =
        (lesson.modality === "Ambas" ? "Desde " : "") +
        "S/ " +
        Math.min(...prices).toFixed(2);
      bottom.append(duration, price);
      const heart = card.querySelector("[data-fav]");
      heart.dataset.fav = lesson.id;
      heart.setAttribute("aria-label", "Guardar en favoritos: " + lesson.title);
      heart.classList.remove("saved");
      heart.textContent = "♡";
      heart.setAttribute("aria-pressed", "false");
      grid.prepend(card);
      const district = document.querySelector("#district");
      if (
        district &&
        lesson.location &&
        ![...district.options].some(
          (option) => option.value === lesson.location,
        )
      ) {
        const option = document.createElement("option");
        option.value = lesson.location;
        option.textContent = lesson.location;
        district.append(option);
      }
    }
  } catch (error) {
    status.textContent =
      "No se pudieron cargar tus clases guardadas. " + error.message;
  }
}
window.addEventListener("pagehide", () =>
  catalogImageUrls.forEach((url) => URL.revokeObjectURL(url)),
);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) location.reload();
});
