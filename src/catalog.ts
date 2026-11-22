export const heroImage = "./assets/tayta-hero.webp";
export const classImage = "./assets/tayta-classes.webp";
export const cajonImage = "./assets/class-cajon.webp";
export const cocinaImage = "./assets/class-cocina.webp";
export const ceramicaImage = "./assets/class-ceramica.webp";
export const quechuaImage = "./assets/class-quechua.webp";
export const plantasImage = "./assets/class-plantas.webp";

export const photos = {
  hero: "./assets/hero.webp",
  pottery: "./assets/pottery.webp",
  workshop: "./assets/workshop.webp",
  craft: "./assets/craft.webp",
  teacher1: "./assets/teacher1.webp",
  teacher2: "./assets/teacher2.webp",
  teacher3: "./assets/teacher3.webp",
};

const desktop = [
  {
    id: 1,
    title: "Tejido andino en telar de cintura",
    teacher: "Rosa Quispe",
    place: "Cusco",
    price: 45,
    rating: 4.9,
    reviews: 38,
    mode: "Presencial",
    image: heroImage,
    position: "center",
    category: "Artesanía",
    promoted: true,
  },
  {
    id: 2,
    title: "Cajón peruano: ritmo y tradición",
    teacher: "Don Julio Salazar",
    place: "Lima",
    price: 35,
    rating: 4.8,
    reviews: 52,
    mode: "Virtual",
    image: cajonImage,
    position: "center",
    category: "Música",
    promoted: false,
  },
  {
    id: 3,
    title: "Secretos de la cocina norteña",
    teacher: "Elena Rojas",
    place: "Trujillo",
    price: 40,
    rating: 5.0,
    reviews: 29,
    mode: "Virtual",
    image: cocinaImage,
    position: "center",
    category: "Cocina",
    promoted: true,
  },
  {
    id: 4,
    title: "Cerámica ancestral de Chulucanas",
    teacher: "Manuel Yarlequé",
    place: "Piura",
    price: 50,
    rating: 4.9,
    reviews: 21,
    mode: "Presencial",
    image: ceramicaImage,
    position: "center",
    category: "Artesanía",
    promoted: false,
  },
  {
    id: 5,
    title: "Quechua para conversar y recordar",
    teacher: "María Huamán",
    place: "Ayacucho",
    price: 30,
    rating: 4.7,
    reviews: 44,
    mode: "Virtual",
    image: quechuaImage,
    position: "center",
    category: "Idiomas",
    promoted: false,
  },
  {
    id: 6,
    title: "Huerto casero y plantas medicinales",
    teacher: "Amalia Torres",
    place: "Arequipa",
    price: 38,
    rating: 4.9,
    reviews: 33,
    mode: "Presencial",
    image: plantasImage,
    position: "center",
    category: "Bienestar",
    promoted: false,
  },
];

const mobile = [
  {
    id: 1,
    title: "Cerámica con historia",
    teacher: "Elena Quispe",
    category: "Arte y oficio",
    level: "Inicial",
    price: 45,
    rating: 4.9,
    reviews: 86,
    time: "1 h 30 min",
    image: photos.pottery,
  },
  {
    id: 2,
    title: "Tejido andino desde cero",
    teacher: "Rosa Huamán",
    category: "Arte y oficio",
    level: "Inicial",
    price: 38,
    rating: 4.8,
    reviews: 62,
    time: "1 h",
    image: photos.workshop,
  },
  {
    id: 3,
    title: "Historias que merecen ser contadas",
    teacher: "Carlos Mendoza",
    category: "Historias",
    level: "Todo nivel",
    price: 30,
    rating: 5.0,
    reviews: 41,
    time: "50 min",
    image: photos.craft,
  },
  {
    id: 4,
    title: "Cocina peruana de toda la vida",
    teacher: "María Salazar",
    category: "Cocina",
    level: "Intermedio",
    price: 55,
    rating: 4.9,
    reviews: 103,
    time: "2 h",
    image: photos.hero,
  },
];

export const teachers = [
  {
    name: "Elena Quispe",
    craft: "Maestra ceramista",
    years: "42 años de experiencia",
    classes: 6,
    rating: 4.9,
    image: photos.teacher1,
    quote: "Cada pieza guarda la memoria de unas manos.",
  },
  {
    name: "José Ramírez",
    craft: "Maestro ebanista",
    years: "38 años de experiencia",
    classes: 4,
    rating: 4.8,
    image: photos.teacher2,
    quote: "La paciencia también se puede enseñar.",
  },
  {
    name: "Carlos Mendoza",
    craft: "Narrador e historiador",
    years: "35 años de experiencia",
    classes: 5,
    rating: 5.0,
    image: photos.teacher3,
    quote: "Contar es otra forma de dejar huella.",
  },
];

export const catalog = [
  ...desktop.map((c) => ({
    ...c,
    level: "Todo nivel",
    time: "Duración por consultar",
  })),
  ...mobile.map((c) => ({
    ...c,
    id: c.id + 10,
    place: "Por consultar",
    mode: "Por consultar",
    promoted: false,
    position: "center",
  })),
];
export function publications(): typeof catalog {
  try {
    return JSON.parse(localStorage.getItem("tayta.publicaciones") || "[]");
  } catch {
    return [];
  }
}
export function getClasses(mobileFirst = false) {
  return [
    ...publications(),
    ...(mobileFirst ? [...catalog.slice(6), ...catalog.slice(0, 6)] : catalog),
  ];
}
