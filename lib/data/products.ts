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

// Helper function to generate random price within a range
const getRandomPrice = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const PRODUCTS: Product[] = [
  // ===== GRAINS =====
  // Wheat (1000-3000)
  {
    id: "g1",
    category: "grains",
    subcategory: "Wheat",
    brand: "Sujata Gold",
    productName: "Premium Wheat",
    pricePerQuintal: getRandomPrice(1000, 3000),
    stock: "in-stock",
    stockQuantity: 500,
  },
  {
    id: "g2",
    category: "grains",
    subcategory: "Wheat",
    brand: "Tanatan",
    productName: "Tanatan Wheat",
    pricePerQuintal: getRandomPrice(1000, 3000),
    stock: "in-stock",
    stockQuantity: 450,
  },
  {
    id: "g3",
    category: "grains",
    subcategory: "Wheat",
    brand: "Sarbati Moti",
    productName: "Sarbati Moti Wheat",
    pricePerQuintal: getRandomPrice(1000, 3000),
    stock: "in-stock",
    stockQuantity: 480,
  },

  // Maize/Corn (8000-11000)
  {
    id: "g4",
    category: "grains",
    subcategory: "Maize",
    brand: "Panshree",
    productName: "Premium Maize",
    pricePerQuintal: getRandomPrice(8000, 11000),
    stock: "in-stock",
    stockQuantity: 300,
  },
  {
    id: "g5",
    category: "grains",
    subcategory: "Maize",
    brand: "Rajdhani",
    productName: "Rajdhani Maize",
    pricePerQuintal: getRandomPrice(8000, 11000),
    stock: "in-stock",
    stockQuantity: 280,
  },
  {
    id: "g6",
    category: "grains",
    subcategory: "Maize",
    brand: "Murliwala",
    productName: "Murliwala Maize",
    pricePerQuintal: getRandomPrice(8000, 11000),
    stock: "in-stock",
    stockQuantity: 320,
  },

  // Sorghum/Jowar (10000-12000)
  {
    id: "g7",
    category: "grains",
    subcategory: "Sorghum",
    brand: "Murliwala",
    productName: "Premium Jowar",
    pricePerQuintal: getRandomPrice(10000, 12000),
    stock: "in-stock",
    stockQuantity: 250,
  },
  {
    id: "g8",
    category: "grains",
    subcategory: "Sorghum",
    brand: "Manik",
    productName: "Manik Jowar",
    pricePerQuintal: getRandomPrice(10000, 12000),
    stock: "in-stock",
    stockQuantity: 240,
  },

  // Pearl Millet/Bajra (11000-12000)
  {
    id: "g9",
    category: "grains",
    subcategory: "Pearl Millet",
    brand: "Murliwala",
    productName: "Premium Bajra",
    pricePerQuintal: getRandomPrice(11000, 12000),
    stock: "in-stock",
    stockQuantity: 220,
  },
  {
    id: "g10",
    category: "grains",
    subcategory: "Pearl Millet",
    brand: "Panshree",
    productName: "Panshree Bajra",
    pricePerQuintal: getRandomPrice(11000, 12000),
    stock: "in-stock",
    stockQuantity: 210,
  },

  // Finger Millet/Ragi (9000-12000)
  {
    id: "g11",
    category: "grains",
    subcategory: "Finger Millet",
    brand: "Ashok",
    productName: "Ashok Ragi",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 200,
  },
  {
    id: "g12",
    category: "grains",
    subcategory: "Finger Millet",
    brand: "Tanatan",
    productName: "Tanatan Ragi",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 190,
  },

  // ===== PULSES =====
  // Moong (9000-12000)
  {
    id: "p1",
    category: "pulses",
    subcategory: "Moong",
    brand: "Tata Sampan",
    productName: "Tata Sampan Moong",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 200,
  },
  {
    id: "p2",
    category: "pulses",
    subcategory: "Moong",
    brand: "Rajdhani",
    productName: "Rajdhani Moong",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 180,
  },
  {
    id: "p3",
    category: "pulses",
    subcategory: "Moong",
    brand: "Mangat Ram",
    productName: "Mangat Ram Moong",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 170,
  },

  // Arhar/Toor (9000-12000)
  {
    id: "p4",
    category: "pulses",
    subcategory: "Arhar",
    brand: "Tata Sampan",
    productName: "Tata Sampan Arhar",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 190,
  },
  {
    id: "p5",
    category: "pulses",
    subcategory: "Arhar",
    brand: "Rajdhani",
    productName: "Rajdhani Arhar",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 185,
  },
  {
    id: "p6",
    category: "pulses",
    subcategory: "Arhar",
    brand: "Mangat Ram",
    productName: "Mangat Ram Arhar",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 175,
  },

  // Urad (9000-12000)
  {
    id: "p7",
    category: "pulses",
    subcategory: "Urad",
    brand: "Tata Sampan",
    productName: "Tata Sampan Urad",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 160,
  },
  {
    id: "p8",
    category: "pulses",
    subcategory: "Urad",
    brand: "Rajdhani",
    productName: "Rajdhani Urad",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 155,
  },
  {
    id: "p9",
    category: "pulses",
    subcategory: "Urad",
    brand: "Mangat Ram",
    productName: "Mangat Ram Urad",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 150,
  },

  // Masoor (9000-12000)
  {
    id: "p10",
    category: "pulses",
    subcategory: "Masoor",
    brand: "Tata Sampan",
    productName: "Tata Sampan Masoor",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 170,
  },
  {
    id: "p11",
    category: "pulses",
    subcategory: "Masoor",
    brand: "Rajdhani",
    productName: "Rajdhani Masoor",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 165,
  },
  {
    id: "p12",
    category: "pulses",
    subcategory: "Masoor",
    brand: "Mangat Ram",
    productName: "Mangat Ram Masoor",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 160,
  },

  // ===== RICE =====
  // Basmati (13000-15000)
  {
    id: "r1",
    category: "rice",
    subcategory: "Basmati",
    brand: "Galaxy",
    productName: "Galaxy Basmati",
    pricePerQuintal: getRandomPrice(13000, 15000),
    stock: "in-stock",
    stockQuantity: 300,
  },
  {
    id: "r2",
    category: "rice",
    subcategory: "Basmati",
    brand: "DC",
    productName: "DC Basmati",
    pricePerQuintal: getRandomPrice(13000, 15000),
    stock: "in-stock",
    stockQuantity: 290,
  },
  {
    id: "r3",
    category: "rice",
    subcategory: "Basmati",
    brand: "Sher Khan",
    productName: "Sher Khan Basmati",
    pricePerQuintal: getRandomPrice(13000, 15000),
    stock: "in-stock",
    stockQuantity: 280,
  },

  // Sella Rice (5000-9000)
  {
    id: "r4",
    category: "rice",
    subcategory: "Sella",
    brand: "Galaxy",
    productName: "Galaxy Sella",
    pricePerQuintal: getRandomPrice(5000, 9000),
    stock: "in-stock",
    stockQuantity: 350,
  },
  {
    id: "r5",
    category: "rice",
    subcategory: "Sella",
    brand: "DC",
    productName: "DC Sella",
    pricePerQuintal: getRandomPrice(5000, 9000),
    stock: "in-stock",
    stockQuantity: 340,
  },
  {
    id: "r6",
    category: "rice",
    subcategory: "Sella",
    brand: "Munna Bhaiya",
    productName: "Munna Bhaiya Sella",
    pricePerQuintal: getRandomPrice(5000, 9000),
    stock: "in-stock",
    stockQuantity: 330,
  },

  // Mansuri Rice (5000-9000)
  {
    id: "r7",
    category: "rice",
    subcategory: "Mansuri",
    brand: "Sher Khan",
    productName: "Sher Khan Mansuri",
    pricePerQuintal: getRandomPrice(5000, 9000),
    stock: "in-stock",
    stockQuantity: 310,
  },
  {
    id: "r8",
    category: "rice",
    subcategory: "Mansuri",
    brand: "Jannat",
    productName: "Jannat Mansuri",
    pricePerQuintal: getRandomPrice(5000, 9000),
    stock: "in-stock",
    stockQuantity: 300,
  },
  {
    id: "r9",
    category: "rice",
    subcategory: "Mansuri",
    brand: "Palki",
    productName: "Palki Mansuri",
    pricePerQuintal: getRandomPrice(5000, 9000),
    stock: "in-stock",
    stockQuantity: 290,
  },

  // Kollam Rice (11000-12000)
  {
    id: "r10",
    category: "rice",
    subcategory: "Kollam",
    brand: "Laxmi Rice",
    productName: "Laxmi Kollam",
    pricePerQuintal: getRandomPrice(11000, 12000),
    stock: "in-stock",
    stockQuantity: 250,
  },
  {
    id: "r11",
    category: "rice",
    subcategory: "Kollam",
    brand: "Scooter",
    productName: "Scooter Kollam",
    pricePerQuintal: getRandomPrice(11000, 12000),
    stock: "in-stock",
    stockQuantity: 240,
  },

  // ===== FLOURS =====
  // MP Atta (5000-8000)
  {
    id: "f1",
    category: "flours",
    subcategory: "MP Atta",
    brand: "Rishta",
    productName: "Rishta MP Atta",
    pricePerQuintal: getRandomPrice(5000, 8000),
    stock: "in-stock",
    stockQuantity: 280,
  },
  {
    id: "f2",
    category: "flours",
    subcategory: "MP Atta",
    brand: "KRML",
    productName: "KRML MP Atta",
    pricePerQuintal: getRandomPrice(5000, 8000),
    stock: "in-stock",
    stockQuantity: 270,
  },
  {
    id: "f3",
    category: "flours",
    subcategory: "MP Atta",
    brand: "Aashirwad",
    productName: "Aashirwad MP Atta",
    pricePerQuintal: getRandomPrice(5000, 8000),
    stock: "in-stock",
    stockQuantity: 290,
  },

  // UP Atta (4000-6000)
  {
    id: "f4",
    category: "flours",
    subcategory: "UP Atta",
    brand: "Rishta",
    productName: "Rishta UP Atta",
    pricePerQuintal: getRandomPrice(4000, 6000),
    stock: "in-stock",
    stockQuantity: 300,
  },
  {
    id: "f5",
    category: "flours",
    subcategory: "UP Atta",
    brand: "KRML",
    productName: "KRML UP Atta",
    pricePerQuintal: getRandomPrice(4000, 6000),
    stock: "in-stock",
    stockQuantity: 310,
  },
  {
    id: "f6",
    category: "flours",
    subcategory: "UP Atta",
    brand: "Aashirwad",
    productName: "Aashirwad UP Atta",
    pricePerQuintal: getRandomPrice(4000, 6000),
    stock: "in-stock",
    stockQuantity: 320,
  },
  {
    id: "f7",
    category: "flours",
    subcategory: "UP Atta",
    brand: "Shiva",
    productName: "Shiva UP Atta",
    pricePerQuintal: getRandomPrice(4000, 6000),
    stock: "in-stock",
    stockQuantity: 300,
  },

  // Multi Grain Atta (9000-12000)
  {
    id: "f8",
    category: "flours",
    subcategory: "Multi Grain Atta",
    brand: "Rishta",
    productName: "Rishta Multi Grain",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 200,
  },
  {
    id: "f9",
    category: "flours",
    subcategory: "Multi Grain Atta",
    brand: "KRML",
    productName: "KRML Multi Grain",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 210,
  },
  {
    id: "f10",
    category: "flours",
    subcategory: "Multi Grain Atta",
    brand: "Aashirwad",
    productName: "Aashirwad Multi Grain",
    pricePerQuintal: getRandomPrice(9000, 12000),
    stock: "in-stock",
    stockQuantity: 220,
  },
]

export const CATEGORIES = [
  { id: "grains", name: "Grains", description: "Wheat, Maize, Sorghum, Pearl Millet, Finger Millet" },
  { id: "pulses", name: "Pulses", description: "Moong, Arhar, Urad, Masoor" },
  { id: "rice", name: "Rice", description: "Basmati, Sella, Mansuri, Kollam" },
  { id: "flours", name: "Flours", description: "MP Atta, UP Atta, Multi-grain Atta" },
]
