import { photos, getTeachers, getClasses } from "./catalog";
export function TeacherCard({ teacher, onClick }: any) {
  return (
    <article className="teacher-card" onClick={onClick}>
      <div className="teacher-photo">
        <img
          src={teacher.image}
          alt={teacher.quote ? teacher.name : teacher.craft}
        />
        <span>✓</span>
      </div>
      <div>
        <div className="rating">★ {teacher.rating}</div>
        <h3>{teacher.name}</h3>
        <p className="teacher-craft">{teacher.craft}</p>
        {teacher.quote && <p className="teacher-quote">“{teacher.quote}”</p>}
        <div className="teacher-meta">
          <span>{teacher.years}</span>
          <span>
            {teacher.classes} {teacher.classes === 1 ? "clase" : "clases"}
          </span>
        </div>
        <button className="link-button">Ver perfil →</button>
      </div>
    </article>
  );
}

export function TeachersPage({ onTeacher }: any) {
  return (
    <div className="page shell teacher-directory">
      <div className="page-title">
        <span className="kicker">MAESTROS DE VIDA</span>
        <h1>Personas que inspiran</h1>
        <p>Experiencia, oficio y paciencia para acompañarte en cada paso.</p>
      </div>
      <div className="teacher-feature">
        <img src={photos.teacher1} alt="Elena Quispe, maestra ceramista" />
        <div>
          <span className="pill">Profesora de la semana</span>
          <h2>Elena Quispe</h2>
          <p className="lead">
            “La arcilla me enseñó que todo puede volver a empezar.”
          </p>
          <p>
            Maestra ceramista ayacuchana con más de cuatro décadas preservando
            técnicas tradicionales y creando nuevas formas de compartirlas.
          </p>
          <div className="feature-stats">
            <span>
              <b>42</b> años enseñando
            </span>
            <span>
              <b>4.9</b> valoración
            </span>
            <span>
              <b>680</b> estudiantes
            </span>
          </div>
          <button className="button" onClick={() => onTeacher()}>
            Conocer a Elena →
          </button>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <h2>Conoce a la comunidad</h2>
          <p>Cada profesor tiene una historia única para compartir.</p>
        </div>
      </div>
      <div className="teacher-grid">
        {getTeachers().map((teacher) => (
          <TeacherCard
            key={teacher.name}
            teacher={teacher}
            onClick={() => onTeacher(teacher)}
          />
        ))}
      </div>
    </div>
  );
}

export function TeacherDetails({ teacher, close, findTeacher }: any) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div
        role="dialog"
        aria-label={teacher.name}
        className="modal teacher-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button aria-label="Cerrar" className="modal-close" onClick={close}>
          ×
        </button>
        <div className="modal-cover">
          <img src={photos.workshop} alt="" />
        </div>
        <img
          className="profile-avatar"
          src={teacher.image}
          alt={teacher.name}
        />
        <span className="kicker">{teacher.craft}</span>
        <h2>{teacher.name}</h2>
        <p>{teacher.quote}</p>
        <p>
          {teacher.years} · {teacher.rating} estrellas
        </p>
        {getClasses().some((c) => c.teacher === teacher.name) ? (
          <button className="button primary-button full" onClick={findTeacher}>
            Ver clases de {teacher.name}
          </button>
        ) : (
          <p>Aún no tiene clases disponibles.</p>
        )}
      </div>
    </div>
  );
}
