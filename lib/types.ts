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

export interface CartItem extends Product {
  cartItemId: string
  quantity: number // Number of lots (1 lot = 1.5 quintals = 150kg)
  bagSize: number // size in kg
  totalBags: number
  totalQuintal: number
  itemTotal: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  gst: number
  deliveryCharge: number
  total: number
}

export interface DeliveryAddress {
  addressLine1: string
  city: string
  state: string
  pincode: string
  contactPerson: string
  phone: string
}
