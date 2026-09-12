// data/products.ts
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  imageHover: string;
  rating: number;
  reviews: number;
  oldPrice: number;
  price: number;
  discount: number;
  badge?: string;
  isNew?: boolean;
}

export const newArrivals: Product[] = [
  {
    id: "1",
    sku: "GXK20",
    name: "Huntsman V3 Pro Tenkeyless",
    description:
      "Teclado mecánico analógico con switches ópticos y polling rate de 8000 Hz.",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
    rating: 5.0,
    reviews: 48,
    oldPrice: 900,
    price: 679.0,
    discount: 45,
    isNew: true,
  },
  {
    id: "2",
    sku: "LOGITECH G",
    name: "PRO X Superlight 2 DEX",
    description:
      "Mouse inalámbrico ultraligero con sensor HERO 2 y 95 horas de batería.",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews: 124,
    oldPrice: 750,
    price: 489.0,
    discount: 35,
    isNew: true,
  },
  {
    id: "3",
    sku: "STEELSERIES",
    name: "Arctis Nova Pro Wireless",
    description:
      "Audífonos inalámbricos con cancelación activa de ruido y audio Hi-Res.",
    image:
      "https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviews: 89,
    oldPrice: 1400,
    price: 1049.0,
    discount: 25,
    isNew: true,
  },
  {
    id: "4",
    sku: "HYPERX",
    name: "QuadCast 2 Streaming Microphone",
    description:
      "Micrófono USB para streaming con patrón cardioide y montaje antivibración.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1520170350707-b2da59970118?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    reviews: 67,
    oldPrice: 900,
    price: 549.0,
    discount: 39,
    isNew: true,
  },
  {
    id: "5",
    sku: "RAZER",
    name: "Goliathus Extended Chroma",
    description:
      "Mousepad extendido con iluminación RGB Chroma y superficie microtexturizada.",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    reviews: 210,
    oldPrice: 350,
    price: 210.0,
    discount: 40,
    isNew: true,
  },
  {
    id: "6",
    sku: "LOGITECH",
    name: "Brio 500 Full HD Webcam",
    description:
      "Cámara web Full HD 1080p con corrección automática de luz y campo amplio.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    reviews: 156,
    oldPrice: 800,
    price: 560.0,
    discount: 30,
    isNew: true,
  },
  {
    id: "7",
    sku: "ASUS ROG",
    name: "ROG Swift PG279QM Monitor",
    description: 'Monitor gamer 27" QHD con 240 Hz, 1 ms y tecnología G-Sync.',
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviews: 78,
    oldPrice: 3200,
    price: 2450.0,
    discount: 23,
    isNew: true,
  },
  {
    id: "8",
    sku: "CORSAIR",
    name: "K70 RGB Pro Mechanical",
    description:
      "Teclado mecánico con switches Cherry MX y chasis de aluminio anodizado.",
    image:
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?q=80&w=600&auto=format&fit=crop",
    imageHover:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviews: 195,
    oldPrice: 950,
    price: 720.0,
    discount: 24,
    isNew: true,
  },
];
