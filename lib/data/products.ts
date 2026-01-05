export interface Product {
  id: string
  category: "grains" | "pulses" | "rice" | "flours"
  subcategory: string
  brand: string
  productName: string
  pricePerQuintal: number
  stock: "in-stock" | "out-of-stock"
  stockQuantity: number
  brandLogo?: string
  image?: string
}

export const PRODUCTS: Product[] = [
  // Grains
  {
    id: "g1",
    category: "grains",
    subcategory: "Wheat",
    brand: "Shakti Bhog",
    productName: "Premium Sharbati Wheat",
    pricePerQuintal: 3200,
    stock: "in-stock",
    stockQuantity: 450,
  },
  {
    id: "g2",
    category: "grains",
    subcategory: "Corn",
    brand: "Savorit",
    productName: "Yellow Maize Bulk",
    pricePerQuintal: 2100,
    stock: "in-stock",
    stockQuantity: 1200,
  },
  // Pulses
  {
    id: "p1",
    category: "pulses",
    subcategory: "Lentils",
    brand: "Tata Sampann",
    productName: "Unpolished Toor Dal",
    pricePerQuintal: 9500,
    stock: "in-stock",
    stockQuantity: 300,
  },
  {
    id: "p2",
    category: "pulses",
    subcategory: "Chickpeas",
    brand: "Fortune",
    productName: "Kabuli Chana Large",
    pricePerQuintal: 8800,
    stock: "out-of-stock",
    stockQuantity: 0,
  },
  // Rice
  {
    id: "r1",
    category: "rice",
    subcategory: "Basmati",
    brand: "Daawat",
    productName: "Rozana Gold Basmati",
    pricePerQuintal: 7500,
    stock: "in-stock",
    stockQuantity: 600,
  },
  {
    id: "r2",
    category: "rice",
    subcategory: "Sona Masoori",
    brand: "India Gate",
    productName: "Old Sona Masoori Rice",
    pricePerQuintal: 5200,
    stock: "in-stock",
    stockQuantity: 800,
  },
  // Flours
  {
    id: "f1",
    category: "flours",
    subcategory: "Atta",
    brand: "Aashirvaad",
    productName: "Select Sharbati Atta",
    pricePerQuintal: 4200,
    stock: "in-stock",
    stockQuantity: 350,
  },
]

export const CATEGORIES = [
  { id: "grains", name: "Grains", description: "Wheat, Corn, Barley" },
  { id: "pulses", name: "Pulses", description: "Lentils, Chickpeas, Beans" },
  { id: "rice", name: "Rice", description: "Basmati, Long Grain, Sona Masoori" },
  { id: "flours", name: "Flours", description: "Wheat Atta, Maida, Besan" },
]
