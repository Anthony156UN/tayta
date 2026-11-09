const TaytaLocal = (() => {
  let connection;
  function open() {
    if (connection) return connection;
    connection = new Promise((resolve, reject) => {
      const request = indexedDB.open("tayta-practica", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("datos");
        request.result.createObjectStore("clases", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          new Error("No se pudo abrir el almacenamiento de este navegador."),
        );
      request.onblocked = () =>
        reject(
          new Error("Cierra otras pestañas de TAYTA y vuelve a intentarlo."),
        );
    });
    return connection;
  }
  async function operation(store, action, value, key) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        store,
        action === "get" || action === "getAll" ? "readonly" : "readwrite",
      );
      const objectStore = transaction.objectStore(store);
      let request;
      if (action === "get") request = objectStore.get(key);
      if (action === "getAll") request = objectStore.getAll();
      if (action === "put")
        request =
          key === undefined
            ? objectStore.put(value)
            : objectStore.put(value, key);
      if (action === "delete") request = objectStore.delete(key);
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () =>
        reject(
          new Error(
            "No se pudo guardar. Revisa el espacio disponible y los permisos del navegador.",
          ),
        );
      transaction.onabort = () =>
        reject(
          new Error("El navegador canceló el guardado. Inténtalo de nuevo."),
        );
    });
  }
  async function saveProfile(value) {
    const email = value.email.trim().toLowerCase();
    const existing = await operation("datos", "get", null, "cuenta:" + email);
    const current = await operation("datos", "get", null, "perfil");
    const profile = {
      ...value,
      email,
      id:
        existing?.id ||
        (current?.email?.toLowerCase() === email ? current.id : value.id),
    };
    await operation("datos", "put", profile, "cuenta:" + email);
    await operation("datos", "put", profile, "perfil");
    return profile;
  }
  async function mutateLesson(value, remove = false) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["datos", "clases"], "readwrite");
      const store = tx.objectStore("clases");
      let reason = "No se pudo guardar el cambio.";
      const profileRequest = tx.objectStore("datos").get("perfil");
      profileRequest.onsuccess = () => {
        const profile = profileRequest.result;
        if (!profile) {
          reason = "Inicia sesión con tu perfil de práctica.";
          tx.abort();
          return;
        }
        const oldRequest = store.get(value.id);
        oldRequest.onsuccess = () => {
          const old = oldRequest.result;
          if (
            (old && old.authorId !== profile.id) ||
            ((remove || value.editing) && !old)
          ) {
            reason =
              "Esta publicación no está disponible para editar con tu perfil.";
            tx.abort();
            return;
          }
          if (remove) store.delete(value.id);
          else {
            const clean = {
              ...value,
              author: profile.name,
              authorId: profile.id,
              created: old?.created || Date.now(),
              updated: Date.now(),
            };
            delete clean.editing;
            store.put(clean);
          }
        };
      };
      tx.oncomplete = () => resolve(value.id);
      tx.onerror = () => reject(new Error(reason));
      tx.onabort = () => reject(new Error(reason));
    });
  }
  return {
    id: () =>
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "clase-" +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2),
    profile: async () => {
      const profile = await operation("datos", "get", null, "perfil");
      if (profile?.email) {
        const key = "cuenta:" + profile.email.trim().toLowerCase();
        if (!(await operation("datos", "get", null, key)))
          await operation("datos", "put", profile, key);
      }
      return profile;
    },
    saveProfile,
    signout: () => operation("datos", "delete", null, "perfil"),
    draft: () => operation("datos", "get", null, "borrador"),
    saveDraft: (value) => operation("datos", "put", value, "borrador"),
    clearDraft: () => operation("datos", "delete", null, "borrador"),
    publish: (value) => mutateLesson(value),
    remove: (id) => mutateLesson({ id }, true),
    classes: () => operation("clases", "getAll"),
    lesson: (id) => operation("clases", "get", null, id),
  };
})();
