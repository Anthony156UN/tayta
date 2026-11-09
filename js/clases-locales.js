const localUrls = [];
const priceText = (lesson) => {
  const prices = [];
  if (lesson.modality !== "Presencial")
    prices.push("Virtual: S/ " + Number(lesson.virtualPrice).toFixed(2));
  if (lesson.modality !== "Virtual")
    prices.push("Presencial: S/ " + Number(lesson.onsitePrice).toFixed(2));
  return prices.join(" · ");
};
function coverSource(lesson) {
  if (!lesson.cover)
    return "assets/" + (catalogCovers[lesson.category] || "arte") + ".jpg";
  const url = URL.createObjectURL(lesson.cover);
  localUrls.push(url);
  return url;
}
let deleteTarget;
const deleteDialog = document.querySelector("#delete-dialog");
function requestDelete(lesson) {
  deleteTarget = lesson;
  document.querySelector("#delete-title").textContent = lesson.title;
  document.querySelector("#delete-error").textContent = "";
  deleteDialog.showModal();
}
document
  .querySelector("#delete-cancel")
  .addEventListener("click", () => deleteDialog.close());
document
  .querySelector("#delete-confirm")
  .addEventListener("click", async (event) => {
    if (!deleteTarget) return;
    event.currentTarget.disabled = true;
    try {
      await TaytaLocal.remove(deleteTarget.id);
      try {
        const favorites = JSON.parse(
          localStorage.getItem("tayta-favoritos") || "[]",
        );
        localStorage.setItem(
          "tayta-favoritos",
          JSON.stringify(favorites.filter((id) => id !== deleteTarget.id)),
        );
      } catch {}
      location.href = "mis-clases.html?eliminada=1";
    } catch (error) {
      document.querySelector("#delete-error").textContent = error.message;
      document.querySelector("#delete-confirm").disabled = false;
    }
  });
async function showClasses() {
  const list = document.querySelector("#local-classes");
  if (!list) return;
  const status = document.querySelector("#local-list-status");
  try {
    const profile = await TaytaLocal.profile();
    const lessons = (await TaytaLocal.classes())
      .filter((lesson) => lesson.authorId === profile?.id)
      .sort((a, b) => (b.updated || b.created) - (a.updated || a.created));
    const params = new URLSearchParams(location.search);
    const success = document.querySelector("#publication-success");
    success.hidden = !params.has("publicada") && !params.has("eliminada");
    if (params.has("eliminada"))
      success.textContent =
        "Clase eliminada. Ya no aparece en los catálogos de esta práctica.";
    document.querySelector("#local-empty").hidden = lessons.length !== 0;
    for (const lesson of lessons) {
      const fragment = document
        .querySelector("#local-card-template")
        .content.cloneNode(true);
      const card = fragment.querySelector("article");
      fragment.querySelector("a").href =
        "mi-clase.html?id=" + encodeURIComponent(lesson.id);
      fragment.querySelector("img").src = coverSource(lesson);
      fragment.querySelector("img").alt = "Portada de " + lesson.title;
      fragment.querySelector(".badge").textContent = lesson.modality;
      fragment.querySelector("h3").textContent = lesson.title;
      fragment.querySelector(".teacherline").textContent = lesson.author;
      fragment.querySelector(".cattext").textContent = lesson.category;
      fragment.querySelector(".cardbottom").textContent = priceText(lesson);
      const actions = document.createElement("div");
      actions.className = "class-actions";
      const edit = document.createElement("a");
      edit.className = "outline";
      edit.href = "ensenar.html?editar=" + encodeURIComponent(lesson.id);
      edit.textContent = "Editar";
      edit.setAttribute("aria-label", "Editar: " + lesson.title);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "outline danger-text";
      remove.textContent = "Eliminar";
      remove.setAttribute("aria-label", "Eliminar: " + lesson.title);
      remove.addEventListener("click", () => requestDelete(lesson));
      actions.append(edit, remove);
      card.append(actions);
      list.append(fragment);
    }
    status.textContent = profile
      ? lessons.length + (lessons.length === 1 ? " clase publicada con tu perfil en esta práctica." : " clases publicadas con tu perfil en esta práctica.")
      : "Inicia sesión con tu correo de ejemplo para ver tus publicaciones.";
  } catch (error) {
    status.textContent = error.message;
  }
}
async function showLesson() {
  const status = document.querySelector("#local-detail-status");
  if (!status) return;
  try {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const lesson = id ? await TaytaLocal.lesson(id) : null;
    if (!lesson) {
      status.textContent =
        "Esta clase se eliminó o no está guardada en este navegador. Vuelve al catálogo.";
      return;
    }
    document.querySelector("#local-title").textContent = lesson.title;
    document.querySelector("#local-cover").src = coverSource(lesson);
    document.querySelector("#local-author").textContent =
      "Con " + lesson.author;
    document.querySelector("#local-description").textContent =
      lesson.description;
    document.querySelector("#local-mode").textContent = lesson.modality;
    document.querySelector("#local-duration").textContent =
      lesson.duration + " minutos";
    document.querySelector("#local-price").textContent = priceText(lesson);
    document.querySelector("#local-place").textContent = lesson.location
      ? "Distrito: " + lesson.location
      : "Desde tu casa.";
    const profile = await TaytaLocal.profile();
    if (profile?.id === lesson.authorId) {
      document.querySelector("#owner-actions").hidden = false;
      document.querySelector("#edit-lesson").href =
        "ensenar.html?editar=" + encodeURIComponent(lesson.id);
      document
        .querySelector("#delete-lesson")
        .addEventListener("click", () => requestDelete(lesson));
    }
    document.querySelector("#local-detail").hidden = false;
    status.textContent = params.has("actualizada")
      ? "Cambios guardados. Tu publicación ya está actualizada."
      : "";
  } catch (error) {
    status.textContent = error.message;
  }
}
showClasses();
showLesson();
window.addEventListener("pagehide", () =>
  localUrls.forEach((url) => URL.revokeObjectURL(url)),
);
