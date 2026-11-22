import { TeachersPage, TeacherDetails } from "./teachers";
import { useState } from "react";
import {
  getTeachers,
  teachers,
  getClasses,
  heroImage,
  classImage,
} from "./catalog";
import {
  Publisher,
  ManageClasses,
  BookingForm,
  BookingList,
  useFavorites,
} from "./shared";
type View =
  | "profesores"
  | "inicio"
  | "explorar"
  | "favoritos"
  | "reservas"
  | "panel";
type IconName =
  | "search"
  | "sun"
  | "moon"
  | "heart"
  | "user"
  | "home"
  | "calendar"
  | "compass"
  | "star"
  | "clock"
  | "map"
  | "video"
  | "arrow"
  | "check"
  | "menu"
  | "close"
  | "play"
  | "plus"
  | "edit"
  | "chart"
  | "book";

const iconPaths: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20.4 15.3A8.5 8.5 0 0 1 8.7 3.6 8.5 8.5 0 1 0 20.4 15.3Z" />,
  heart: (
    <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v11h14V10M9 21v-7h6v7" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 4-4 2 2-4 4-2Z" />
    </>
  ),
  star: (
    <path d="m12 2.5 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6L9 8.5l3-6Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  map: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  play: <path d="m9 6 9 6-9 6V6Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
    <>
      <path d="m14 5 5 5L8 21H3v-5L14 5Z" />
      <path d="m12 7 5 5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  book: (
    <>
      <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4Z" />
      <path d="M8 20V8a4 4 0 0 0-4-4" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  filled = false,
}: {
  name: IconName;
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

const categories = [
  { name: "Artesanía", subtitle: "Tejido, cerámica y más", symbol: "✣" },
  { name: "Cocina", subtitle: "Recetas con historia", symbol: "♨" },
  { name: "Música", subtitle: "Ritmos del Perú", symbol: "♫" },
  { name: "Idiomas", subtitle: "Quechua y lenguas vivas", symbol: "Aa" },
  { name: "Bienestar", subtitle: "Sabiduría natural", symbol: "⌁" },
];

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Ir al inicio">
      <span className="logo-mark">T</span>
      <span>
        <strong>TAYTA</strong>
        <small>EL QUE SABE, ENSEÑA</small>
      </span>
    </button>
  );
}

function App() {
  const [teacher, setTeacher] = useState<(typeof teachers)[number] | null>(
    null,
  );
  const [view, setView] = useState<View>("inicio");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [favorites, setFavorites] = useFavorites();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [mode, setMode] = useState("Todas");
  const [modal, setModal] = useState<"auth" | "booking" | "publish" | null>(
    null,
  );
  const [selected, setSelected] = useState(1);
  const [name, setName] = useState(
    () => localStorage.getItem("tayta.nombre") || "",
  );
  const [toast, setToast] = useState("");

  const navigate = (next: View) => {
    setView(next);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleFavorite = (id: number) => {
    setFavorites((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
    );
  };
  const classes = getClasses();
  const filtered = classes.filter(
    (c) =>
      (category === "Todas" || c.category === category) &&
      (mode === "Todas" || c.mode === mode || c.mode === "Ambas") &&
      `${c.title} ${c.teacher} ${c.place}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const openBooking = (id: number) => {
    setSelected(id);
    setModal("booking");
  };
  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2800);
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="header">
        <div className="header-inner">
          <Logo onClick={() => navigate("inicio")} />
          <nav
            id="main-menu"
            className={menu ? "desktop-nav open" : "desktop-nav"}
            aria-label="Navegación principal"
          >
            <button
              className={view === "inicio" ? "active" : ""}
              onClick={() => navigate("inicio")}
            >
              Inicio
            </button>
            <button
              className={view === "explorar" ? "active" : ""}
              onClick={() => navigate("explorar")}
            >
              Explorar clases
            </button>
            <button onClick={() => navigate("profesores")}>Profesores</button>
            <button onClick={() => navigate("favoritos")}>Favoritos</button>
            <button onClick={() => navigate("reservas")}>Mis reservas</button>
            <button className="teach-link" onClick={() => navigate("panel")}>
              Quiero enseñar
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
            >
              <Icon name={dark ? "sun" : "moon"} />
            </button>
            <button className="login-button" onClick={() => setModal("auth")}>
              <Icon name="user" size={18} /> {name || "Iniciar sesión"}
            </button>
            <button
              className="menu-button"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
              aria-controls="main-menu"
              aria-expanded={menu}
            >
              <Icon name={menu ? "close" : "menu"} />
              <span>Menú</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === "profesores" && (
          <TeachersPage onTeacher={(t = teachers[0]) => setTeacher(t)} />
        )}
        {teacher && (
          <TeacherDetails
            teacher={teacher}
            close={() => setTeacher(null)}
            findTeacher={() => {
              setQuery(teacher.name);
              setCategory("Todas");
              setMode("Todas");
              setTeacher(null);
              navigate("explorar");
            }}
          />
        )}
        {view === "inicio" && (
          <Home
            query={query}
            setQuery={setQuery}
            navigate={navigate}
            setCategory={setCategory}
            setMode={setMode}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openBooking={openBooking}
          />
        )}
        {view === "explorar" && (
          <Explore
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            mode={mode}
            setMode={setMode}
            filtered={filtered}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openBooking={openBooking}
          />
        )}
        {view === "favoritos" && (
          <Collection
            title="Tus clases favoritas"
            subtitle="Todo lo que te inspira, guardado en un solo lugar."
            items={classes.filter((c) => favorites.includes(c.id))}
            empty="Aún no guardaste clases."
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openBooking={openBooking}
            navigate={navigate}
          />
        )}
        {view === "reservas" && (
          <div className="page">
            <BookingList />
          </div>
        )}

        {view === "panel" && (
          <section className="page">
            <div className="dashboard-head">
              <div>
                <h1>Quiero enseñar</h1>
                <p>Publica una clase o administra las que ya compartiste.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => setModal("publish")}
              >
                Publicar una clase
              </button>
            </div>
            <ManageClasses />
          </section>
        )}
      </main>

      <footer className="footer">
        <div>
          <Logo onClick={() => navigate("inicio")} />
          <p>Uniendo generaciones a través de lo que sabemos.</p>
        </div>
        <div>
          <strong>Descubre</strong>
          <button onClick={() => navigate("explorar")}>Explorar clases</button>
          <button onClick={() => navigate("profesores")}>Profesores</button>
        </div>
        <div>
          <strong>Comunidad</strong>
          <button onClick={() => navigate("panel")}>Quiero enseñar</button>
          <button onClick={() => navigate("favoritos")}>Favoritos</button>
          <button onClick={() => navigate("reservas")}>Mis reservas</button>
        </div>
        <small>© 2026 TAYTA. Hecho con respeto por los saberes del Perú.</small>
      </footer>

      <nav className="mobile-nav" aria-label="Navegación móvil">
        {(
          [
            ["inicio", "home", "Inicio"],
            ["explorar", "compass", "Explorar"],
            ["favoritos", "heart", "Favoritos"],
            ["reservas", "calendar", "Mis reservas"],
            ["panel", "plus", "Quiero enseñar"],
          ] as [View, IconName, string][]
        ).map(([v, i, l]) => (
          <button
            key={v}
            className={view === v ? "active" : ""}
            onClick={() => navigate(v)}
          >
            <Icon
              name={i}
              size={21}
              filled={v === "favoritos" && favorites.length > 0}
            />
            <span>{l}</span>
          </button>
        ))}
      </nav>

      {modal === "publish" && (
        <Publisher
          close={() => setModal(null)}
          done={() => {
            setModal(null);
            setQuery("");
            setCategory("Todas");
            setMode("Todas");
            navigate("explorar");
          }}
        />
      )}
      {modal === "booking" && (
        <BookingForm
          item={classes.find((c) => c.id === selected)}
          close={() => setModal(null)}
          onDone={() => {
            setModal(null);
            navigate("reservas");
          }}
        />
      )}
      {modal === "auth" && (
        <Access
          name={name}
          close={() => setModal(null)}
          save={(value: string) => {
            localStorage.setItem("tayta.nombre", value);
            setName(value);
            setModal(null);
            notify(value ? "Perfil de práctica abierto" : "Sesión cerrada");
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <Icon name="check" size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Home({
  query,
  setQuery,
  navigate,
  setCategory,
  setMode,
  favorites,
  toggleFavorite,
  openBooking,
}: any) {
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMode("Todas");
    setCategory("Todas");
    navigate("explorar");
  };
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">SABIDURÍA QUE TRASCIENDE GENERACIONES</span>
          <h1>
            Lo que sabes
            <br />
            <em>puede transformar</em>
            <br />
            una vida.
          </h1>
          <p>
            Aprende de quienes tienen toda una vida de experiencia. Clases
            únicas, historias reales y saberes que merecen continuar.
          </p>
          <form className="hero-search" onSubmit={submit}>
            <Icon name="search" size={22} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué te gustaría aprender?"
              aria-label="Buscar clases"
            />
            <button>Buscar</button>
          </form>
          <div className="trust">
            <div className="avatar-stack">
              <span>RQ</span>
              <span>JS</span>
              <span>ER</span>
            </div>
            <strong>{getTeachers().length} profesores</strong> comparten sus
            saberes
          </div>
        </div>
        <div className="hero-visual">
          <img
            src={heroImage}
            alt="Maestra peruana enseñando tejido andino a una estudiante"
          />
          <div className="hero-note">
            <span>
              <Icon name="star" size={17} filled />
            </span>
            <div>
              <strong>Aprende con confianza</strong>
              <small>Clases virtuales y presenciales</small>
            </div>
          </div>
          <div className="image-caption">
            <strong>Rosa, 68 años</strong>
            <span>Maestra tejedora · Cusco</span>
          </div>
        </div>
      </section>

      <section className="section category-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORA A TU MANERA</span>
            <h2>
              ¿Qué te gustaría <em>aprender hoy?</em>
            </h2>
          </div>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setMode("Todas");
              setCategory("Todas");
              navigate("explorar");
            }}
          >
            Ver todas <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <button
              className="category-card"
              key={c.name}
              onClick={() => {
                setQuery("");
                setMode("Todas");
                setCategory(c.name);
                navigate("explorar");
              }}
            >
              <span className="category-symbol">{c.symbol}</span>
              <span>
                <strong>{c.name}</strong>
                <small>{c.subtitle}</small>
              </span>
              <Icon name="arrow" size={18} />
            </button>
          ))}
        </div>
      </section>

      <section className="section featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CLASES CON HISTORIA</span>
            <h2>
              Aprende de los <em>mejores maestros</em>
            </h2>
          </div>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setMode("Todas");
              setCategory("Todas");
              navigate("explorar");
            }}
          >
            Explorar todo <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="card-grid">
          {getClasses()
            .slice(0, 3)
            .map((c, i) => (
              <ClassCard
                key={c.id}
                item={c}
                index={i}
                favorite={favorites.includes(c.id)}
                toggleFavorite={toggleFavorite}
                openBooking={openBooking}
              />
            ))}
        </div>
      </section>

      <section className="story">
        <div className="story-image">
          <img
            src={classImage}
            alt="Maestros peruanos compartiendo música, cocina y cerámica"
          />
        </div>
        <div className="story-copy">
          <span className="eyebrow">UNA COMUNIDAD CON PROPÓSITO</span>
          <h2>
            Cada saber merece
            <br />
            <em>seguir vivo.</em>
          </h2>
          <p>
            En TAYTA, los años no restan: suman historias, oficio y experiencia.
            Creamos encuentros donde los adultos mayores encuentran
            reconocimiento e ingresos, y nuevas generaciones reciben
            conocimientos que no están en los libros.
          </p>
          <div className="impact">
            <span>
              <strong>{getTeachers().length}</strong>
              <small>profesores en TAYTA</small>
            </span>
            <span>
              <strong>{getClasses().length}</strong>
              <small>clases disponibles</small>
            </span>
            <span>
              <strong>
                {new Set(getClasses().map((c) => c.category)).size}
              </strong>
              <small>categorías</small>
            </span>
          </div>
          <button
            className="primary-button"
            onClick={() => navigate("profesores")}
          >
            Conoce a los profesores <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>

      <section className="teach-cta">
        <div>
          <span className="eyebrow">TU EXPERIENCIA TIENE VALOR</span>
          <h2>¿Tienes algo que enseñar?</h2>
          <p>
            Comparte lo que sabes, conecta con nuevas generaciones y genera
            ingresos a tu ritmo. Nosotros te acompañamos en cada paso.
          </p>
          <button className="cream-button" onClick={() => navigate("panel")}>
            Quiero enseñar <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="cta-quote">
          <p>
            “Enseñar me devolvió las ganas de compartir. Ahora mis recetas viven
            en muchas familias.”
          </p>
          <span>Elena, 71 años · Maestra cocinera</span>
        </div>
      </section>
    </>
  );
}

function ClassCard({
  item,
  index = 0,
  favorite,
  toggleFavorite,
  openBooking,
}: any) {
  return (
    <article className="class-card">
      <div className="card-image">
        <div
          className="sprite"
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundPosition: item.position,
          }}
        />
        <span className={`mode ${item.mode === "Virtual" ? "virtual" : ""}`}>
          <Icon name={item.mode === "Virtual" ? "video" : "map"} size={14} />
          {item.mode}
        </span>
        {item.promoted && <span className="promoted">Promocionado</span>}
        <button
          className={favorite ? "favorite active" : "favorite"}
          onClick={() => toggleFavorite(item.id)}
          aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Icon name="heart" filled={favorite} />
        </button>
      </div>
      <div className="card-body">
        <div className="teacher-row">
          <span className={`mini-avatar avatar-${index}`}>
            {item.teacher
              .split(" ")
              .map((x: string) => x[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span>{item.teacher}</span>
          <span className="verified">
            <Icon name="check" size={12} />
          </span>
        </div>
        <h3>{item.title}</h3>
        <div className="card-meta">
          <span>
            <Icon name="star" size={15} filled /> <strong>{item.rating}</strong>{" "}
            ({item.reviews})
          </span>
          <span>
            <Icon name="map" size={15} /> {item.place}
          </span>
        </div>
        <div className="card-footer">
          <span>
            Desde <strong>S/ {item.price}</strong> / clase
          </span>
          <button onClick={() => openBooking(item.id)}>
            Reservar <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Explore({
  query,
  setQuery,
  category,
  setCategory,
  mode,
  setMode,
  filtered,
  favorites,
  toggleFavorite,
  openBooking,
}: any) {
  const [order, setOrder] = useState("recomendadas");
  const sorted = [...filtered].sort((a, b) =>
    order === "precio"
      ? a.price - b.price
      : order === "valoracion"
        ? b.rating - a.rating
        : 0,
  );
  return (
    <div className="page">
      <div className="page-title">
        <span className="eyebrow">ENCUENTRA TU PRÓXIMA HISTORIA</span>
        <h1>
          Explora clases con <em>sabiduría</em>
        </h1>
        <p>Personas reales, conocimientos únicos y encuentros a tu ritmo.</p>
      </div>
      <div className="explore-bar">
        <div className="search-box">
          <Icon name="search" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por clase, maestro o ciudad…"
          />
        </div>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          aria-label="Modalidad"
        >
          <option>Todas</option>
          <option>Virtual</option>
          <option>Presencial</option>
        </select>
      </div>
      <div className="chips">
        {["Todas", ...new Set(getClasses().map((c) => c.category))].map((c) => (
          <button
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="results-head">
        <strong>{filtered.length} clases encontradas</strong>
        <label>
          Ordenar por{" "}
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="recomendadas">Recomendadas</option>
            <option value="precio">Menor precio</option>
            <option value="valoracion">Mejor valoración</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="card-grid explore-grid">
          {sorted.map((c: any, i: number) => (
            <ClassCard
              key={c.id}
              item={c}
              index={i}
              favorite={favorites.includes(c.id)}
              toggleFavorite={toggleFavorite}
              openBooking={openBooking}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Icon name="search" size={36} />
          <h3>No encontramos coincidencias</h3>
          <p>Prueba con otra búsqueda o quita algún filtro.</p>
        </div>
      )}
    </div>
  );
}

function Collection({
  title,
  subtitle,
  items,
  empty,
  favorites,
  toggleFavorite,
  openBooking,
  navigate,
}: any) {
  return (
    <div className="page">
      <div className="page-title">
        <span className="eyebrow">TU COLECCIÓN</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {items.length ? (
        <div className="card-grid explore-grid">
          {items.map((c: any, i: number) => (
            <ClassCard
              key={c.id}
              item={c}
              index={i}
              favorite={favorites.includes(c.id)}
              toggleFavorite={toggleFavorite}
              openBooking={openBooking}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Icon name="heart" size={38} />
          <h3>{empty}</h3>
          <button
            className="primary-button"
            onClick={() => navigate("explorar")}
          >
            Explorar clases
          </button>
        </div>
      )}
    </div>
  );
}

function Access({
  name,
  save,
  close,
}: {
  name: string;
  save: (name: string) => void;
  close: () => void;
}) {
  const [value, setValue] = useState(name);
  return (
    <div className="modal-backdrop">
      <form
        className="modal"
        role="dialog"
        aria-label="Perfil de práctica"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) save(value.trim());
        }}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Cerrar"
          onClick={close}
        >
          ×
        </button>
        <h2>{name ? "Mi perfil" : "Iniciar sesión"}</h2>
        <p>
          Perfil de práctica en este navegador. Tus publicaciones y reservas se
          guardan en este equipo.
        </p>
        <label>
          Tu nombre
          <input
            required
            maxLength={60}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="given-name"
          />
        </label>
        <button disabled={!value.trim()} className="primary-button full">
          {name ? "Guardar nombre" : "Continuar"}
        </button>
        {name && (
          <button
            type="button"
            className="secondary-button full"
            onClick={() => save("")}
          >
            Cerrar sesión
          </button>
        )}
      </form>
    </div>
  );
}
export default App;
