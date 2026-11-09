const profileForm = document.querySelector("#register-form");
const profileName = document.querySelector("#profile-name");
const profileEmail = document.querySelector("#profile-email");
const profileError = document.querySelector("#register-error");
const profileButton = document.querySelector("#register-button");
const signoutButton = document.querySelector("#signout");
let currentProfile;
TaytaLocal.profile()
  .then((profile) => {
    currentProfile = profile;
    if (!profile) return;
    profileName.value = profile.name;
    profileEmail.value = profile.email;
    profileButton.textContent = "Guardar y continuar →";
    signoutButton.hidden = false;
  })
  .catch((error) => {
    profileError.textContent = error.message;
  });
profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileError.textContent = "";
  if (!profileName.value.trim()) {
    profileError.textContent = "Escribe tu nombre.";
    profileName.focus();
    return;
  }
  profileButton.disabled = true;
  try {
    await TaytaLocal.saveProfile({
      id:
        currentProfile?.email?.toLowerCase() ===
        profileEmail.value.trim().toLowerCase()
          ? currentProfile.id
          : TaytaLocal.id(),
      name: profileName.value.trim(),
      email: profileEmail.value.trim(),
    });
    location.href = "ensenar.html";
  } catch (error) {
    profileError.textContent = error.message;
    profileButton.disabled = false;
  }
});
signoutButton.addEventListener("click", async () => {
  try {
    await TaytaLocal.signout();
    location.reload();
  } catch (error) {
    profileError.textContent = error.message;
  }
});
