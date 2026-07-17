export type ProductCategory = "Para ella" | "Para él" | "Unisex";

export type Product = {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  size: string;
  price: number;
  previousPrice?: number;
  tag?: string;
  image: string;
  accent: string;
  notes: string[];
  description: string;
};

export const STORE = {
  name: "ESENCIA",
  shippingMessage: "Envíos a todo El Salvador",
  currency: "USD",
  locale: "es-SV",
};

// Para colocar tus productos, cambia los datos de cada bloque.
// En `image` agrega una ruta como "/productos/perfume-1.png" y guarda
// la fotografía dentro de la carpeta `public/productos`.
export const products: Product[] = [
  {
    id: 1,
    name: "Perfume 01",
    brand: "TU MARCA",
    category: "Para ella",
    size: "100 ml",
    price: 69,
    previousPrice: 79,
    tag: "Más vendido",
    image: "",
    accent: "#d8c8b0",
    notes: ["Vainilla", "Jazmín", "Ámbar"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
  {
    id: 2,
    name: "Perfume 02",
    brand: "TU MARCA",
    category: "Para él",
    size: "100 ml",
    price: 72,
    tag: "Nuevo",
    image: "",
    accent: "#aeb8ad",
    notes: ["Cedro", "Bergamota", "Cuero"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
  {
    id: 3,
    name: "Perfume 03",
    brand: "TU MARCA",
    category: "Unisex",
    size: "80 ml",
    price: 65,
    image: "",
    accent: "#d9d2c4",
    notes: ["Sándalo", "Higo", "Almizcle"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
  {
    id: 4,
    name: "Perfume 04",
    brand: "TU MARCA",
    category: "Para ella",
    size: "90 ml",
    price: 74,
    image: "",
    accent: "#d8b8ae",
    notes: ["Rosa", "Peonía", "Madera"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
  {
    id: 5,
    name: "Perfume 05",
    brand: "TU MARCA",
    category: "Para él",
    size: "100 ml",
    price: 78,
    image: "",
    accent: "#a5aaa3",
    notes: ["Vetiver", "Pimienta", "Incienso"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
  {
    id: 6,
    name: "Perfume 06",
    brand: "TU MARCA",
    category: "Unisex",
    size: "75 ml",
    price: 62,
    tag: "Edición especial",
    image: "",
    accent: "#c7b893",
    notes: ["Neroli", "Té blanco", "Ámbar"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
  {
    id: 7,
    name: "Perfume 07",
    brand: "TU MARCA",
    category: "Para ella",
    size: "100 ml",
    price: 68,
    image: "",
    accent: "#cab9ad",
    notes: ["Cereza", "Rosa", "Tonka"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
  {
    id: 8,
    name: "Perfume 08",
    brand: "TU MARCA",
    category: "Para él",
    size: "100 ml",
    price: 76,
    image: "",
    accent: "#9ca6a1",
    notes: ["Mandarina", "Salvia", "Madera"],
    description: "Agrega aquí una descripción corta del perfume y de su aroma.",
  },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat(STORE.locale, {
    style: "currency",
    currency: STORE.currency,
  }).format(value);
}
