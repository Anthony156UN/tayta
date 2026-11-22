import { useState, useEffect } from "react";
import { publications, heroImage } from "./catalog";
export function useFavorites() {
  const [ids, setIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("tayta.favoritos") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("tayta.favoritos", JSON.stringify(ids));
    } catch {}
  }, [ids]);
  return [ids, setIds] as const;
}
export function Publisher({
  close,
  done,
  editing,
}: {
  editing?: ReturnType<typeof publications>[number];
  close: () => void;
  done: () => void;
}) {
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const file = f.get("foto") as File;
    try {
      let image = editing?.image || heroImage;
      if (file.size) {
        if (!file.type.startsWith("image/")) throw Error("Elige una imagen.");
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
        canvas.width = bitmap.width * scale;
        canvas.height = bitmap.height * scale;
        canvas
          .getContext("2d")!
          .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        image = canvas.toDataURL("image/jpeg", 0.72);
        bitmap.close();
      }
      const title = String(f.get("titulo")).trim(),
        teacher = String(f.get("nombre")).trim();
      if (!title || !teacher) throw Error("Escribe el título y tu nombre.");
      localStorage.setItem(
        "tayta.publicaciones",
        JSON.stringify([
          {
            id: editing?.id || Date.now(),
            title,
            teacher,
            price: Number(f.get("precio")),
            image,
            mode: f.get("modalidad"),
            category: f.get("categoria"),
            position: "center",
            place: "Por consultar",
            time: "Por consultar",
            level: "Todo nivel",
            rating: 0,
            reviews: 0,
            promoted: false,
          },
          ...publications().filter((c) => c.id !== editing?.id),
        ]),
      );
      done();
    } catch (e) {
      setError(
        e instanceof Error && e.message.startsWith("Escribe")
          ? e.message
          : "No se pudo guardar. Revisa la foto o el espacio disponible.",
      );
    }
  }
  return (
    <div className="modal-backdrop">
      <form
        role="dialog"
        aria-label="Publicar una clase"
        className="modal"
        onSubmit={submit}
      >
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2>{editing ? "Editar clase" : "Publicar una clase"}</h2>
        <label>
          Título de la clase
          <input
            name="titulo"
            defaultValue={editing?.title}
            required
            maxLength={100}
          />
        </label>
        <label>
          Tu nombre
          <input
            name="nombre"
            defaultValue={editing?.teacher}
            required
            maxLength={70}
          />
        </label>
        <label>
          Categoría
          <select name="categoria" defaultValue={editing?.category}>
            {[
              "Artesanía",
              "Cocina",
              "Música",
              "Idiomas",
              "Bienestar",
              "Historias",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Modalidad
          <select name="modalidad" defaultValue={editing?.mode}>
            <option>Presencial</option>
            <option>Virtual</option>
            <option>Ambas</option>
          </select>
        </label>
        <label>
          Precio (S/)
          <input
            type="number"
            min="0"
            step=".01"
            name="precio"
            defaultValue={editing?.price}
            required
          />
        </label>
        <label>
          Foto de la clase
          <input type="file" name="foto" accept="image/*" />
        </label>
        <p>Tu clase se guardará en el catálogo de este navegador.</p>
        {error && <p role="alert">{error}</p>}
        <button className="button primary-button full">
          {editing ? "Guardar cambios" : "Publicar clase"}
        </button>
      </form>
    </div>
  );
}

export function ManageClasses() {
  const [rows, setRows] = useState(publications);
  const [editing, setEditing] = useState<(typeof rows)[number]>();
  return (
    <section className="panel-card">
      <h2>Mis clases publicadas</h2>
      {!rows.length && (
        <p>Aquí aparecerán las clases que publiques desde este navegador.</p>
      )}
      {rows.map((c) => (
        <div className="class-admin" key={c.id}>
          <strong>{c.title}</strong>
          <span>S/ {c.price}</span>
          <button className="secondary-button" onClick={() => setEditing(c)}>
            Editar
          </button>
          <button
            onClick={() => {
              if (window.confirm("¿Eliminar esta clase?")) {
                const remaining = publications().filter(
                  (row) => row.id !== c.id,
                );
                localStorage.setItem(
                  "tayta.publicaciones",
                  JSON.stringify(remaining),
                );
                setRows(remaining);
              }
            }}
          >
            Eliminar
          </button>
        </div>
      ))}
      {editing && (
        <Publisher
          editing={editing}
          close={() => setEditing(undefined)}
          done={() => {
            setEditing(undefined);
            setRows(publications());
          }}
        />
      )}
    </section>
  );
}
type Booking = {
  id: string;
  title: string;
  teacher: string;
  date: string;
  time: string;
};
function reservations(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem("tayta.reservas") || "[]");
  } catch {
    return [];
  }
}
export function BookingForm({ item, close, onDone }: any) {
  const [error, setError] = useState("");
  return (
    <div className="modal-backdrop">
      <form
        className="modal"
        role="dialog"
        aria-label="Reservar clase"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const date = String(data.get("date")),
            time = String(data.get("time")),
            id = [item.id, date, time].join("-");
          try {
            const rows = reservations();
            if (!rows.some((r) => r.id === id))
              localStorage.setItem(
                "tayta.reservas",
                JSON.stringify([
                  ...rows,
                  { id, title: item.title, teacher: item.teacher, date, time },
                ]),
              );
            onDone();
          } catch {
            setError("No se pudo guardar la reserva.");
          }
        }}
      >
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label="Cerrar"
        >
          ×
        </button>
        <span className="eyebrow kicker">RESERVA TU LUGAR</span>
        <h2>{item.title}</h2>
        <p>
          Con {item.teacher} · S/ {item.price}
        </p>
        <label>
          Elige una fecha
          <input
            type="date"
            name="date"
            min={new Date().toLocaleDateString("en-CA")}
            required
          />
        </label>
        <label>
          Horario
          <select name="time">
            <option>10:00</option>
            <option>16:00</option>
            <option>18:30</option>
          </select>
        </label>
        <p>Reserva de práctica guardada en este navegador, sin cobro.</p>
        {error && <p role="alert">{error}</p>}
        <button className="primary-button button full">
          Confirmar reserva
        </button>
      </form>
    </div>
  );
}
export function BookingList() {
  const rows = reservations();
  return (
    <section className="panel-card">
      <h2>Mis reservas</h2>
      {rows.length === 0 ? (
        <p>Aquí aparecerá tu primera reserva.</p>
      ) : (
        rows.map((r) => (
          <article key={r.id}>
            <h3>{r.title}</h3>
            <p>
              {r.teacher} · {r.date} · {r.time}
            </p>
          </article>
        ))
      )}
    </section>
  );
}
