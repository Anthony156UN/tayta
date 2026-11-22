import { TeachersPage, TeacherDetails } from "./teachers";
import { useMemo, useState } from "react";
import {
  catalog,
  photos,
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
  | "perfil"
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

const classes = catalog;
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
              <Icon name="user" size={18} /> Iniciar sesión
            </button>
            <button
              className="menu-button"
              onClick={() => setMenu(!menu)}
              aria-label="Abrir menú"
            >
              <Icon name={menu ? "close" : "menu"} />
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
        {view === "perfil" && <TeacherProfile openBooking={openBooking} />}
        {view === "panel" && (
          <Dashboard onPublish={() => setModal("publish")} notify={notify} />
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
          <button onClick={() => navigate("panel")}>Enseña en TAYTA</button>
          <button>Centro de ayuda</button>
        </div>
        <div>
          <strong>Recibe historias con sabiduría</strong>
          <div className="subscribe">
            <input aria-label="Correo electrónico" placeholder="tu@correo.pe" />
            <button
              onClick={() => notify("Gracias por sumarte a la comunidad")}
            >
              Unirme
            </button>
          </div>
        </div>
        <small>© 2026 TAYTA. Hecho con respeto por los saberes del Perú.</small>
      </footer>

      <nav className="mobile-nav" aria-label="Navegación móvil">
        {(
          [
            ["inicio", "home", "Inicio"],
            ["explorar", "compass", "Explorar"],
            ["favoritos", "heart", "Favoritos"],
            ["reservas", "calendar", "Reservas"],
            ["panel", "user", "Mi cuenta"],
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
        <Modal
          type={modal}
          selected={classes.find((c) => c.id === selected)!}
          close={() => setModal(null)}
          notify={(m) => {
            setModal(null);
            notify(m);
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
  favorites,
  toggleFavorite,
  openBooking,
}: any) {
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <strong>+2,500</strong> encuentros que ya dejan huella
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
              <small>Profesores verificados por TAYTA</small>
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
          <button className="text-link" onClick={() => navigate("explorar")}>
            Ver todas <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <button
              className="category-card"
              key={c.name}
              onClick={() => {
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
          <button className="text-link" onClick={() => navigate("explorar")}>
            Explorar todo <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="card-grid">
          {classes.slice(0, 3).map((c, i) => (
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
          <button aria-label="Reproducir historia">
            <Icon name="play" filled />
          </button>
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
              <strong>180+</strong>
              <small>maestros activos</small>
            </span>
            <span>
              <strong>4.9/5</strong>
              <small>valoración promedio</small>
            </span>
            <span>
              <strong>12</strong>
              <small>regiones del Perú</small>
            </span>
          </div>
          <button className="primary-button" onClick={() => navigate("perfil")}>
            Conoce nuestra historia <Icon name="arrow" size={18} />
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
            Quiero ser profesor <Icon name="arrow" size={18} />
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
            Ver clase <Icon name="arrow" size={16} />
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
        {["Todas", ...new Set(classes.map((c) => c.category))].map((c) => (
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
        <span>
          Ordenar: <b>Recomendadas</b>
        </span>
      </div>
      {filtered.length ? (
        <div className="card-grid explore-grid">
          {filtered.map((c: any, i: number) => (
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

function TeacherProfile({ openBooking }: any) {
  return (
    <div className="page profile-page">
      <div className="profile-cover">
        <div
          className="profile-photo"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="profile-intro">
          <span className="verified-label">
            <Icon name="check" size={14} /> Identidad verificada
          </span>
          <h1>Rosa Quispe</h1>
          <p className="profile-role">Maestra tejedora · Cusco</p>
          <div className="profile-stats">
            <span>
              <Icon name="star" filled /> 4.9 <small>(38 reseñas)</small>
            </span>
            <span>
              <Icon name="book" /> 126 estudiantes
            </span>
            <span>
              <Icon name="clock" /> 42 años de experiencia
            </span>
          </div>
          <button className="primary-button" onClick={() => openBooking(1)}>
            Reservar una clase
          </button>
        </div>
      </div>
      <div className="profile-content">
        <article>
          <h2>Mi historia</h2>
          <p>
            Aprendí a tejer junto a mi madre y mi abuela en Chinchero. Cada
            diseño guarda un relato de nuestra comunidad, de la tierra y de
            quienes estuvieron antes. Hoy comparto estas técnicas para que
            viajen hacia nuevas manos sin perder su raíz.
          </p>
          <h2>Lo que aprenderás</h2>
          <ul className="learning-list">
            <li>
              <Icon name="check" />
              Preparación de fibras y tintes naturales
            </li>
            <li>
              <Icon name="check" />
              Lectura de símbolos y patrones andinos
            </li>
            <li>
              <Icon name="check" />
              Técnicas base del telar de cintura
            </li>
          </ul>
        </article>
        <aside>
          <h3>Conoce a Rosa</h3>
          <div
            className="video-preview"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <button>
              <Icon name="play" filled />
            </button>
          </div>
          <p>“Te voy a enseñar con paciencia, como me enseñaron a mí.”</p>
        </aside>
      </div>
    </div>
  );
}

function Dashboard({ onPublish, notify }: any) {
  return (
    <div className="dashboard page">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">PANEL DEL PROFESOR</span>
          <h1>
            Buenos días, <em>Rosa</em>
          </h1>
          <p>Tu experiencia sigue inspirando. Aquí tienes el resumen de hoy.</p>
        </div>
        <button className="primary-button" onClick={onPublish}>
          <Icon name="plus" /> Publicar una clase
        </button>
      </div>
      <div className="metrics">
        <div>
          <span>
            <Icon name="calendar" />
          </span>
          <small>Clases este mes</small>
          <strong>12</strong>
          <em>+3 vs. mayo</em>
        </div>
        <div>
          <span>
            <Icon name="user" />
          </span>
          <small>Nuevos estudiantes</small>
          <strong>28</strong>
          <em>+18% este mes</em>
        </div>
        <div>
          <span>
            <Icon name="star" />
          </span>
          <small>Valoración</small>
          <strong>4.9</strong>
          <em>38 reseñas</em>
        </div>
        <div>
          <span>
            <Icon name="chart" />
          </span>
          <small>Ingresos del mes</small>
          <strong>S/ 1,840</strong>
          <em>+12% este mes</em>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="panel-card">
          <div className="panel-title">
            <h2>Próximas clases</h2>
            <button>Ver calendario</button>
          </div>
          {[
            "Hoy · 4:00 p. m.",
            "Jue 20 · 10:00 a. m.",
            "Sáb 22 · 11:30 a. m.",
          ].map((d, i) => (
            <div className="student-row" key={d}>
              <span className="mini-avatar">{["LM", "AS", "PV"][i]}</span>
              <div>
                <strong>
                  {["Lucía Mendoza", "Andrés Salazar", "Paola Vega"][i]}
                </strong>
                <small>{d} · Tejido andino</small>
              </div>
              <button onClick={() => notify("Mensaje abierto")}>Mensaje</button>
            </div>
          ))}
        </section>
        <ManageClasses />
      </div>
    </div>
  );
}

function Modal({ type, selected, close, notify }: any) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={close} aria-label="Cerrar">
          <Icon name="close" />
        </button>
        {type === "auth" && (
          <>
            <span className="eyebrow">BIENVENIDO A TAYTA</span>
            <h2>Entra a tu comunidad</h2>
            <p>Acceso de práctica. Usa datos de ejemplo.</p>
            <div className="role-switch">
              <button className="active">Soy estudiante</button>
              <button>Soy profesor</button>
            </div>
            <label>
              Correo electrónico
              <input type="email" placeholder="nombre@correo.pe" />
            </label>
            <label>
              Contraseña
              <input type="password" placeholder="Tu contraseña" />
            </label>
            <button
              className="primary-button full"
              onClick={() => notify("Acceso de demostración")}
            >
              Iniciar sesión
            </button>
            <button className="forgot">¿Olvidaste tu contraseña?</button>
            <div className="divider">o</div>
            <button
              className="secondary-button full"
              onClick={() => notify("Registro iniciado")}
            >
              Crear una cuenta
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
