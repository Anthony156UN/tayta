const lessonTitle = document.querySelector("#lesson-title");
if (lessonTitle) {
  const guitar =
    new URLSearchParams(location.search).get("clase") === "guitarra";
  if (guitar) {
    lessonTitle.textContent = "Tus primeros acordes de guitarra";
    document.querySelector("#lesson-teacher").textContent = "Miguel Vásquez";
    document.querySelector("#lesson-cover").src = "assets/musica.jpg";
    const goals = [
      "Sostener la guitarra cómodamente.",
      "Ubicar tres acordes básicos.",
      "Practicar un primer patrón de rasgueo.",
    ];
    document.querySelectorAll("#lesson-goals li").forEach((item, index) => {
      item.textContent = goals[index];
    });
  }
  const player = document.querySelector("#student-player");
  const fileInput = document.querySelector("#student-video");
  const error = document.querySelector("#student-video-error");
  let videoUrl;
  let selectedPlan;
  function clearVideo() {
    player.pause();
    player.removeAttribute("src");
    player.load();
    player.hidden = true;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    videoUrl = undefined;
    fileInput.value = "";
  }
  document.querySelector("#simulate-access").addEventListener("click", () => {
    selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    document.querySelector("#access-summary").textContent =
      selectedPlan === "compra"
        ? "Compra individual · S/ 20 por esta clase · Sin renovación."
        : "Suscripción a esta clase · S/ 15 por mes · Acceso durante la vigencia. La renovación y cancelación reales aún no están implementadas.";
    document.querySelector("#access-review").hidden = false;
  });
  document.querySelectorAll('input[name="plan"]').forEach((input) =>
    input.addEventListener("change", () => {
      document.querySelector("#access-review").hidden = true;
    }),
  );
  document.querySelector("#confirm-access").addEventListener("click", () => {
    clearVideo();
    document.querySelector("#player-locked").hidden = true;
    document.querySelector("#student-player-section").hidden = false;
    document.querySelector("#access-status").textContent =
      selectedPlan === "compra"
        ? "Prueba de compra individual habilitada. No se efectuó ningún cobro."
        : "Prueba de suscripción habilitada. No existe una suscripción ni cobros recurrentes.";
    document.querySelector("#access-review").hidden = true;
    fileInput.focus();
  });
  document.querySelector("#reset-access").addEventListener("click", () => {
    clearVideo();
    error.textContent = "";
    document.querySelector("#student-player-section").hidden = true;
    document.querySelector("#player-locked").hidden = false;
    document.querySelector("#simulate-access").focus();
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    clearVideo();
    error.textContent = "";
    if (
      !["video/mp4", "video/webm"].includes(file.type) ||
      !file.size ||
      file.size > 100 * 1024 * 1024
    ) {
      error.textContent = "Selecciona un MP4 o WebM de hasta 100 MB.";
      return;
    }
    videoUrl = URL.createObjectURL(file);
    player.src = videoUrl;
    player.hidden = false;
  });
  player.addEventListener("error", () => {
    clearVideo();
    error.textContent =
      "No se pudo reproducir el video. Prueba con otro formato compatible con tu navegador.";
  });
  window.addEventListener("pagehide", () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  });
}
