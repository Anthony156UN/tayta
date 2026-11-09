const publishForm = document.querySelector("#teachform");
const coverInput = document.querySelector("#cover-file");
const coverZone = document.querySelector("#cover-drop");
const coverError = document.querySelector("#cover-error");
const publishError = document.querySelector("#publish-error");
const publishButton = document.querySelector("#publish-button");
let cover;
let profile;
let editingLesson;
let editorReady = false;
const editId = new URLSearchParams(location.search).get("editar");
function updateModality() {
  const mode = document.querySelector("#modality").value;
  [
    ["virtual-fields", mode !== "Presencial"],
    ["locationfield", mode !== "Virtual"],
  ].forEach(([id, visible]) => {
    const section = document.getElementById(id);
    section.hidden = !visible;
    section.querySelectorAll("input").forEach((input) => {
      input.disabled = !visible;
      input.required = visible;
    });
  });
}
function selectPhoto(files) {
  coverError.textContent = "";
  if (!files.length) return;
  const file = files[0];
  if (
    files.length !== 1 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    !file.size ||
    file.size > 8 * 1024 * 1024
  ) {
    cover = undefined;
    coverInput.value = "";
    document.querySelector("#cover-preview").hidden = true;
    coverError.textContent =
      "Elige una sola foto JPG, PNG o WebP de hasta 8 MB.";
    return;
  }
  cover = file;
  document.querySelector("#cover-name").textContent =
    "Foto elegida: " + file.name;
  document.querySelector("#cover-preview").hidden = false;
}
coverInput.addEventListener("change", () => selectPhoto([...coverInput.files]));
coverZone.addEventListener("click", () => coverInput.click());
coverZone.addEventListener("keydown", (event) => {
  if (["Enter", " "].includes(event.key)) {
    event.preventDefault();
    coverInput.click();
  }
});
coverZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  coverZone.classList.add("dragging");
});
coverZone.addEventListener("dragleave", () =>
  coverZone.classList.remove("dragging"),
);
coverZone.addEventListener("drop", (event) => {
  event.preventDefault();
  coverZone.classList.remove("dragging");
  selectPhoto([...event.dataTransfer.files]);
});
document.querySelector("#cover-remove").addEventListener("click", () => {
  cover = undefined;
  coverInput.value = "";
  document.querySelector("#cover-preview").hidden = true;
  coverError.textContent = "";
});
document.querySelector("#modality").addEventListener("change", updateModality);
async function loadEditor() {
  try {
    profile = await TaytaLocal.profile();
    if (profile)
      document.querySelector("#publisher-name").textContent =
        "Publicarás como " + profile.name;
    if (editId) {
      editingLesson = await TaytaLocal.lesson(editId);
      if (!editingLesson || !profile || editingLesson.authorId !== profile.id) {
        publishError.textContent =
          "Inicia sesión con el perfil que publicó esta clase para editarla.";
        publishButton.disabled = true;
        return;
      }
      Object.entries(editingLesson).forEach(([name, value]) => {
        const input = publishForm.elements.namedItem(name);
        if (input && input.type !== "file") input.value = value;
      });
      if (editingLesson.cover) selectPhoto([editingLesson.cover]);
      publishButton.textContent = "Guardar cambios →";
      document.querySelector(".pagehead h1").textContent =
        "Edita tu publicación.";
      const status = document.querySelector("#edit-status");
      status.hidden = false;
      status.textContent =
        "Los cambios se reflejarán en el inicio y los catálogos.";
      updateModality();
      editorReady = true;
      return;
    }
    const draft = await TaytaLocal.draft();
    if (draft) {
      Object.entries(draft.fields).forEach(([name, value]) => {
        const input = publishForm.elements.namedItem(name);
        if (input) input.value = value;
      });
      if (draft.cover) selectPhoto([draft.cover]);
    }
    updateModality();
    editorReady = true;
  } catch (error) {
    publishError.textContent = error.message;
  }
}
publishForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  publishError.textContent = "";
  if (!editorReady) {
    publishError.textContent = "Espera a que termine de cargar el formulario.";
    return;
  }
  const fields = Object.fromEntries(new FormData(publishForm));
  if (
    !fields.title.trim() ||
    !fields.description.trim() ||
    (fields.modality !== "Virtual" && !fields.location.trim())
  ) {
    publishError.textContent =
      "Completa el nombre, la descripción y, si corresponde, el distrito.";
    return;
  }
  if (coverError.textContent) {
    coverZone.focus();
    return;
  }
  publishButton.disabled = true;
  try {
    profile = await TaytaLocal.profile();
    if (!profile) {
      await TaytaLocal.saveDraft({ fields, cover });
      const message = document.querySelector("#profile-required");
      message.hidden = false;
      message.scrollIntoView({ behavior: "smooth" });
      publishButton.disabled = false;
      return;
    }
    await TaytaLocal.publish({
      id: editingLesson?.id || TaytaLocal.id(),
      editing: Boolean(editingLesson),
      author: profile.name,
      authorId: profile.id,
      ...fields,
      cover,
      created: Date.now(),
    });
    if (!editingLesson) await TaytaLocal.clearDraft().catch(() => {});
    location.href = editingLesson
      ? "mi-clase.html?id=" +
        encodeURIComponent(editingLesson.id) +
        "&actualizada=1"
      : "mis-clases.html?publicada=1";
  } catch (error) {
    publishError.textContent = error.message;
    publishButton.disabled = false;
  }
});
updateModality();
loadEditor();
