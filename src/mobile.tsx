import { TeacherCard, TeachersPage, TeacherDetails } from "./teachers";
import { useMemo, useState } from "react";

type IconName =
  | "arrow"
  | "book"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "heart"
  | "home"
  | "menu"
  | "moon"
  | "play"
  | "search"
  | "sparkles"
  | "star"
  | "sun"
  | "user"
  | "users";

const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v11h14V10M9 21v-7h6v7" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z" />,
  play: <path d="m9 7 8 5-8 5z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z" />
      <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z" />
    </>
  ),
  star: (
    <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  fill = "none",
}: {
  name: IconName;
  size?: number;
  fill?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

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

const classes = catalog;
const categories = [
  { name: "Arte y oficio", icon: "✦", count: "86 clases" },
  { name: "Cocina", icon: "◌", count: "64 clases" },
  { name: "Música", icon: "♫", count: "42 clases" },
  { name: "Historias", icon: "“", count: "38 clases" },
];

type Page = "inicio" | "clases" | "profesores" | "panel";
type Modal = null | "login" | "register" | "reserve" | "success" | "teacher";

export default function App() {
  const [page, setPage] = useState<Page>("inicio");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState(classes[0]);
  const [favorites, setFavorites] = useFavorites();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [panelMode, setPanelMode] = useState<"student" | "teacher">("student");

  const [publisher, setPublisher] = useState(false);
  const [teacher, setTeacher] = useState(teachers[0]);
  const showTeacher = (t = teachers[0]) => {
    setTeacher(t);
    setModal("teacher");
  };
  const filtered = getClasses().filter(
    (item) =>
      (category === "Todas" || item.category === category) &&
      `${item.title} ${item.teacher}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const navigate = (next: Page) => {
    setPage(next);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openReserve = (item = classes[0]) => {
    setSelected(item);
    setModal("reserve");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="header">
        <div className="shell nav-wrap">
          <button
            className="brand"
            onClick={() => navigate("inicio")}
            aria-label="Ir al inicio"
          >
            <span className="brand-mark">T</span>
            <span>
              <b>TAYTA</b>
              <small>El que sabe, enseña</small>
            </span>
          </button>
          <nav
            className={menu ? "nav open" : "nav"}
            aria-label="Navegación principal"
          >
            {(
              [
                ["inicio", "Inicio"],
                ["clases", "Clases"],
                ["profesores", "Profesores"],
              ] as [Page, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                className={page === key ? "active" : ""}
                onClick={() => navigate(key)}
              >
                {label}
              </button>
            ))}
            <button
              className={
                page === "panel" ? "active mobile-only" : "mobile-only"
              }
              onClick={() => navigate("panel")}
            >
              Mi espacio
            </button>
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button"
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
            >
              <Icon name={dark ? "sun" : "moon"} />
            </button>
            <button
              className="text-button desktop-only"
              onClick={() => setModal("login")}
            >
              Iniciar sesión
            </button>
            <button
              className="button small desktop-only"
              onClick={() => setModal("register")}
            >
              Crear cuenta
            </button>
            <button
              className="avatar-button desktop-only"
              onClick={() => navigate("panel")}
              aria-label="Abrir mi espacio"
            >
              <Icon name="user" size={19} />
            </button>
            <button
              className="icon-button menu-button"
              onClick={() => setMenu(!menu)}
              aria-label="Abrir menú"
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {page === "inicio" && (
          <Home
            navigate={navigate}
            openReserve={openReserve}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onTeacher={showTeacher}
          />
        )}
        {page === "clases" && (
          <ClassesPage
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            filtered={filtered}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openReserve={openReserve}
          />
        )}
        {page === "profesores" && <TeachersPage onTeacher={showTeacher} />}
        {page === "panel" && (
          <Dashboard
            publish={() => setPublisher(true)}
            mode={panelMode}
            setMode={setPanelMode}
            navigate={navigate}
            favorites={favorites}
          />
        )}
      </main>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark">T</span>
              <span>
                <b>TAYTA</b>
                <small>El que sabe, enseña</small>
              </span>
            </div>
            <p>
              Una comunidad donde la experiencia encuentra nuevas generaciones.
            </p>
          </div>
          <div>
            <b>Explora</b>
            <button onClick={() => navigate("clases")}>Clases</button>
            <button onClick={() => navigate("profesores")}>Profesores</button>
          </div>
          <div>
            <b>Comunidad</b>
            <button onClick={() => setModal("register")}>Quiero enseñar</button>
            <button onClick={() => setModal("register")}>
              Quiero aprender
            </button>
          </div>
          <div>
            <b>Ayuda</b>
            <button>Centro de ayuda</button>
            <button>Accesibilidad</button>
          </div>
        </div>
        <div className="shell copyright">
          <span>© 2025 TAYTA. Hecho con respeto en Perú.</span>
          <span>Privacidad · Términos</span>
        </div>
      </footer>

      {publisher && (
        <Publisher
          close={() => setPublisher(false)}
          done={() => {
            setPublisher(false);
            setSearch("");
            setCategory("Todas");
            navigate("clases");
          }}
        />
      )}
      {modal === "reserve" && (
        <BookingForm
          item={selected}
          close={() => setModal(null)}
          onDone={() => setModal("success")}
        />
      )}
      {modal && modal !== "reserve" && (
        <ModalView
          teacher={teacher}
          findTeacher={() => {
            setSearch(teacher.name);
            setCategory("Todas");
            setModal(null);
            navigate("clases");
          }}
          type={modal}
          close={() => setModal(null)}
          selected={selected}
          onSuccess={() => setModal("success")}
          onRegister={() => setModal("register")}
        />
      )}

      <nav className="bottom-nav" aria-label="Navegación móvil">
        <button
          className={page === "inicio" ? "active" : ""}
          onClick={() => navigate("inicio")}
        >
          <Icon name="home" />
          <span>Inicio</span>
        </button>
        <button
          className={page === "clases" ? "active" : ""}
          onClick={() => navigate("clases")}
        >
          <Icon name="search" />
          <span>Explorar</span>
        </button>
        <button
          className={page === "profesores" ? "active" : ""}
          onClick={() => navigate("profesores")}
        >
          <Icon name="users" />
          <span>Profesores</span>
        </button>
        <button
          className={page === "panel" ? "active" : ""}
          onClick={() => navigate("panel")}
        >
          <Icon name="user" />
          <span>Mi espacio</span>
        </button>
      </nav>
    </div>
  );
}

function Home({
  navigate,
  openReserve,
  favorites,
  toggleFavorite,
  onTeacher,
}: any) {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <Icon name="sparkles" size={17} /> Conocimiento que trasciende
              generaciones
            </div>
            <h1>
              La sabiduría se comparte,
              <br />
              <em>el futuro se construye.</em>
            </h1>
            <p>
              Aprende de quienes tienen toda una vida de experiencia. Clases
              cercanas, humanas y llenas de historias que vale la pena
              conservar.
            </p>
            <div className="hero-actions">
              <button className="button" onClick={() => navigate("clases")}>
                Explorar clases <Icon name="arrow" />
              </button>
              <button
                className="button secondary"
                onClick={() => navigate("profesores")}
              >
                Conocer profesores
              </button>
            </div>
            <div className="trust-row">
              <div className="avatar-stack">
                {teachers.map((t) => (
                  <img key={t.name} src={t.image} alt="" />
                ))}
              </div>
              <div>
                <span>
                  <b>4.9</b> <span className="stars">★★★★★</span>
                </span>
                <small>Más de 2,400 estudiantes aprendiendo</small>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="shape shape-one" />
            <div className="shape shape-two" />
            <img
              src={photos.hero}
              alt="Maestro artesano guiando a una estudiante en un taller"
            />
            <div className="floating-card">
              <span className="float-icon">
                <Icon name="play" fill="currentColor" />
              </span>
              <span>
                <b>Aprende a tu ritmo</b>
                <small>En vivo o desde casa</small>
              </span>
            </div>
            <div className="quote-card">
              <span>“</span>
              <p>Lo que sé cobra sentido cuando lo comparto.</p>
              <small>— Elena, 68 años</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <div>
            <span className="kicker">ENCUENTRA TU PASIÓN</span>
            <h2>¿Qué te gustaría aprender?</h2>
            <p>Conocimientos reales, enseñados con paciencia y dedicación.</p>
          </div>
          <button className="link-button" onClick={() => navigate("clases")}>
            Ver todas <Icon name="arrow" />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              className="category-card"
              key={cat.name}
              onClick={() => navigate("clases")}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>
                <b>{cat.name}</b>
                <small>{cat.count}</small>
              </span>
              <Icon name="chevron" />
            </button>
          ))}
        </div>
      </section>

      <section className="section tinted">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">APRENDE HOY</span>
              <h2>Clases que dejan huella</h2>
              <p>Las favoritas de nuestra comunidad esta semana.</p>
            </div>
            <button className="link-button" onClick={() => navigate("clases")}>
              Explorar catálogo <Icon name="arrow" />
            </button>
          </div>
          <div className="class-grid">
            {classes.slice(0, 3).map((item) => (
              <ClassCard
                key={item.id}
                item={item}
                favorite={favorites.includes(item.id)}
                toggleFavorite={toggleFavorite}
                openReserve={openReserve}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading centered">
          <div>
            <span className="kicker">QUIENES ENSEÑAN</span>
            <h2>Una vida entera de experiencia</h2>
            <p>
              Conoce a personas extraordinarias dispuestas a compartir lo que
              saben.
            </p>
          </div>
        </div>
        <div className="teacher-grid">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.name}
              teacher={teacher}
              onClick={() => onTeacher(teacher)}
            />
          ))}
        </div>
      </section>

      <section className="shell join">
        <div>
          <span className="kicker">TU EXPERIENCIA IMPORTA</span>
          <h2>¿Tienes algo que enseñar?</h2>
          <p>
            Comparte tu conocimiento, conecta con nuevas generaciones y genera
            ingresos haciendo lo que amas.
          </p>
          <button className="button light" onClick={() => navigate("panel")}>
            Quiero ser profesor <Icon name="arrow" />
          </button>
        </div>
        <div className="join-stat">
          <b>+180</b>
          <span>profesores ya comparten su legado en TAYTA</span>
        </div>
      </section>
    </>
  );
}

function ClassCard({ item, favorite, toggleFavorite, openReserve }: any) {
  return (
    <article className="class-card">
      <div className="card-image">
        <img src={item.image} alt={`Clase de ${item.title}`} />
        <span className="pill">{item.category}</span>
        <button
          className={favorite ? "favorite active" : "favorite"}
          onClick={() => toggleFavorite(item.id)}
          aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Icon
            name="heart"
            size={19}
            fill={favorite ? "currentColor" : "none"}
          />
        </button>
        <button
          className="play-button"
          onClick={() => openReserve(item)}
          aria-label="Ver presentación"
        >
          <Icon name="play" fill="currentColor" />
        </button>
      </div>
      <div className="card-content">
        <div className="rating">
          <Icon name="star" size={16} fill="currentColor" />{" "}
          <b>{item.rating}</b> <span>({item.reviews})</span>
        </div>
        <h3>{item.title}</h3>
        <p>Con {item.teacher}</p>
        <div className="meta">
          <span>
            <Icon name="clock" size={16} /> {item.time}
          </span>
          <span>{item.level}</span>
        </div>
        <div className="card-footer">
          <div>
            <small>Desde</small>
            <strong>S/ {item.price}</strong>
          </div>
          <button className="button compact" onClick={() => openReserve(item)}>
            Reservar
          </button>
        </div>
      </div>
    </article>
  );
}

function ClassesPage({
  search,
  setSearch,
  category,
  setCategory,
  filtered,
  favorites,
  toggleFavorite,
  openReserve,
}: any) {
  const [order, setOrder] = useState("Más recomendadas");
  return (
    <div className="page shell">
      <div className="page-title">
        <span className="kicker">APRENDE ALGO NUEVO</span>
        <h1>Clases con propósito</h1>
        <p>Explora conocimientos que han tomado toda una vida perfeccionar.</p>
      </div>
      <div className="catalog-toolbar">
        <label className="search-box">
          <Icon name="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clase o profesor..."
          />
        </label>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          aria-label="Ordenar clases"
        >
          <option>Más recomendadas</option>
          <option>Menor precio</option>
          <option>Mejor valoradas</option>
        </select>
      </div>
      <div className="filter-chips">
        {["Todas", ...new Set(getClasses().map((c) => c.category))].map(
          (item) => (
            <button
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </div>
      <div className="results-line">
        <b>{filtered.length} clases encontradas</b>
        <span>Clases en vivo y grabadas</span>
      </div>
      {filtered.length ? (
        <div className="class-grid">
          {[...filtered]
            .sort((a, b) =>
              order === "Menor precio"
                ? a.price - b.price
                : order === "Mejor valoradas"
                  ? b.rating - a.rating
                  : 0,
            )
            .map((item: any) => (
              <ClassCard
                key={item.id}
                item={item}
                favorite={favorites.includes(item.id)}
                toggleFavorite={toggleFavorite}
                openReserve={openReserve}
              />
            ))}
        </div>
      ) : (
        <div className="empty">
          <Icon name="search" size={36} />
          <h3>No encontramos esa clase</h3>
          <p>Prueba con otro término o categoría.</p>
        </div>
      )}
    </div>
  );
}

function Dashboard({ publish, mode, setMode, navigate, favorites }: any) {
  return (
    <div className="page shell dashboard">
      <div className="dashboard-head">
        <div>
          <span className="kicker">MI ESPACIO TAYTA</span>
          <h1>Buenos días, Andrea</h1>
          <p>Aquí tienes todo listo para seguir aprendiendo.</p>
        </div>
        <div className="mode-toggle">
          <button
            className={mode === "student" ? "active" : ""}
            onClick={() => setMode("student")}
          >
            Estudiante
          </button>
          <button
            className={mode === "teacher" ? "active" : ""}
            onClick={() => setMode("teacher")}
          >
            Profesor
          </button>
        </div>
      </div>
      {mode === "teacher" && <ManageClasses />}

      {mode === "student" ? (
        <>
          <div className="stats-grid">
            <div>
              <span className="stat-icon">
                <Icon name="calendar" />
              </span>
              <span>
                <b>2</b>
                <small>Próximas clases</small>
              </span>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="heart" />
              </span>
              <span>
                <b>{favorites.length}</b>
                <small>Clases favoritas</small>
              </span>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="book" />
              </span>
              <span>
                <b>7</b>
                <small>Clases completadas</small>
              </span>
            </div>
          </div>
          <h2>Tu próxima clase</h2>
          <div className="next-class">
            <img src={photos.pottery} alt="" />
            <div>
              <span className="pill">MAÑANA · 4:00 PM</span>
              <h3>Cerámica con historia</h3>
              <p>Con Elena Quispe · Sesión en vivo</p>
            </div>
            <button className="button">
              Entrar a la clase <Icon name="play" fill="currentColor" />
            </button>
          </div>
          <div className="dashboard-grid">
            <BookingList />
            <div className="panel-card">
              <h2>Continúa explorando</h2>
              <p>Hay nuevas historias esperando por ti.</p>
              <button
                className="button secondary full"
                onClick={() => navigate("clases")}
              >
                Ver clases
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="stats-grid">
            <div>
              <span className="stat-icon">
                <Icon name="users" />
              </span>
              <span>
                <b>128</b>
                <small>Estudiantes</small>
              </span>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="calendar" />
              </span>
              <span>
                <b>8</b>
                <small>Reservas este mes</small>
              </span>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="star" />
              </span>
              <span>
                <b>4.9</b>
                <small>Valoración</small>
              </span>
            </div>
          </div>
          <div className="teacher-actions">
            <div>
              <span className="stat-icon">
                <Icon name="book" />
              </span>
              <h3>Publica una nueva clase</h3>
              <p>Comparte un nuevo conocimiento con la comunidad.</p>
              <button className="button" onClick={publish}>
                Crear clase
              </button>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="play" />
              </span>
              <h3>Sube un video</h3>
              <p>Presenta tu experiencia y conecta con estudiantes.</p>
              <button className="button secondary">Subir video</button>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="sparkles" />
              </span>
              <h3>Destaca tu perfil</h3>
              <p>Llega a más personas con una promoción especial.</p>
              <button className="button secondary">Ver promociones</button>
            </div>
          </div>
          <div className="dashboard-grid">
            <div className="panel-card">
              <div className="panel-title">
                <h2>Próximas sesiones</h2>
                <button className="link-button">Administrar horarios</button>
              </div>
              {classes.slice(0, 3).map((c, i) => (
                <div className="schedule-row" key={c.id}>
                  <span>
                    <b>{12 + i}</b>
                    <small>JUN</small>
                  </span>
                  <div>
                    <b>{c.title}</b>
                    <small>
                      {i + 3} estudiantes · {4 + i}:00 PM
                    </small>
                  </div>
                  <button className="text-button">Detalles</button>
                </div>
              ))}
            </div>
            <div className="panel-card">
              <h2>Tu perfil está al 80%</h2>
              <p>Añade un video de presentación para generar más confianza.</p>
              <div className="progress">
                <i />
              </div>
              <button className="button secondary full">
                Completar perfil
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ModalView({
  teacher,
  findTeacher,
  type,
  close,
  selected,
  onSuccess,
  onRegister,
}: any) {
  if (type === "success")
    return (
      <div className="modal-backdrop" onMouseDown={close}>
        <div
          className="modal success-modal"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="success-icon">
            <Icon name="check" size={34} />
          </span>
          <h2>¡Tu reserva está lista!</h2>
          <p>
            Elegiste {selected.title} con {selected.teacher}. Esta reserva es de
            práctica.
          </p>
          <button className="button full" onClick={close}>
            Volver a explorar
          </button>
        </div>
      </div>
    );
  if (type === "teacher")
    return (
      <TeacherDetails
        teacher={teacher}
        close={close}
        findTeacher={findTeacher}
      />
    );
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div
        className="modal auth-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={close}>
          <Icon name="close" />
        </button>
        <div className="brand center-brand">
          <span className="brand-mark">T</span>
          <span>
            <b>TAYTA</b>
          </span>
        </div>
        <h2>{type === "login" ? "Qué gusto verte" : "Empieza a compartir"}</h2>
        <p>
          {type === "login"
            ? "Acceso de práctica. Usa datos de ejemplo."
            : "Registro de práctica. Usa datos de ejemplo."}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            close();
          }}
        >
          {type === "register" && (
            <>
              <div className="account-types">
                <label>
                  <input type="radio" name="type" defaultChecked /> Quiero
                  aprender
                </label>
                <label>
                  <input type="radio" name="type" /> Quiero enseñar
                </label>
              </div>
              <label>
                Nombre completo
                <input required placeholder="Tu nombre" />
              </label>
            </>
          )}
          <label>
            Correo electrónico
            <input type="email" required placeholder="tu@correo.com" />
          </label>
          <label>
            Contraseña
            <input type="password" required placeholder="Mínimo 8 caracteres" />
          </label>
          <button className="button full" type="submit">
            {type === "login" ? "Iniciar sesión" : "Crear mi cuenta"}
          </button>
        </form>
        {type === "login" && (
          <p className="switch-auth">
            ¿Aún no tienes cuenta?{" "}
            <button onClick={onRegister}>Regístrate gratis</button>
          </p>
        )}
      </div>
    </div>
  );
}
