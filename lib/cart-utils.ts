import type { Product, Cart, CartItem } from "./types"

const LOT_SIZE_QUINTALS = 1.5 // 1.5 quintals per lot
const BAG_SIZE_KG = 50 // 50kg per bag
const GST_PERCENT = 0.09 // 9% GST

export const getCart = (userId: string): Cart => {
  if (typeof window === "undefined") return { items: [], subtotal: 0, gst: 0, deliveryCharge: 0, total: 0 }
  const cartData = localStorage.getItem(`cart_${userId}`)
  if (!cartData) return { items: [], subtotal: 0, gst: 0, deliveryCharge: 0, total: 0 }
  return JSON.parse(cartData)
}

export const saveCart = (userId: string, cart: Cart) => {
  if (typeof window === "undefined") return
  localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))
}

export const calculateCartTotals = (items: CartItem[]): Cart => {
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0)
  const gst = Math.round(subtotal * GST_PERCENT)
  const deliveryCharge = subtotal >= 50000 ? 0 : 1500
  const total = subtotal + gst + deliveryCharge

  return { items, subtotal, gst, deliveryCharge, total }
}

export const addToCart = (userId: string, product: Product, quantity: number): { success: boolean; cart: Cart } => {
  const cart = getCart(userId)
  const existingItemIndex = cart.items.findIndex((item) => item.id === product.id)

  const totalQuintal = quantity * LOT_SIZE_QUINTALS
  const totalBags = Math.ceil((totalQuintal * 100) / BAG_SIZE_KG)
  const itemTotal = Math.round(totalQuintal * product.pricePerQuintal)

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity
    const newTotalQuintal = newQuantity * LOT_SIZE_QUINTALS
    cart.items[existingItemIndex] = {
      ...cart.items[existingItemIndex],
      quantity: newQuantity,
      totalQuintal: newTotalQuintal,
      totalBags: Math.ceil((newTotalQuintal * 100) / BAG_SIZE_KG),
      itemTotal: Math.round(newTotalQuintal * product.pricePerQuintal),
    }
  } else {
    const newItem: CartItem = {
      ...product,
      cartItemId: Math.random().toString(36).substring(7),
      quantity,
      bagSize: BAG_SIZE_KG,
      totalBags,
      totalQuintal,
      itemTotal,
    }
    cart.items.push(newItem)
  }

  const updatedCart = calculateCartTotals(cart.items)
  saveCart(userId, updatedCart)
  console.log("[v0] Product added to cart:", product.productName, "New Total:", updatedCart.total)
  return { success: true, cart: updatedCart }
}

export const updateCartItemQuantity = (
  userId: string,
  cartItemId: string,
  newQuantity: number,
): { success: boolean; cart: Cart } => {
  const cart = getCart(userId)
  const itemIndex = cart.items.findIndex((item) => item.cartItemId === cartItemId)

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      const totalQuintal = newQuantity * LOT_SIZE_QUINTALS
      cart.items[itemIndex] = {
        ...cart.items[itemIndex],
        quantity: newQuantity,
        totalQuintal: totalQuintal,
        totalBags: Math.ceil((totalQuintal * 100) / BAG_SIZE_KG),
        itemTotal: Math.round(totalQuintal * cart.items[itemIndex].pricePerQuintal),
      }
    }
  }

  const updatedCart = calculateCartTotals(cart.items)
  saveCart(userId, updatedCart)
  return { success: true, cart: updatedCart }
}

export const removeFromCart = (userId: string, cartItemId: string): { success: boolean; cart: Cart } => {
  const cart = getCart(userId)
  cart.items = cart.items.filter((item) => item.cartItemId !== cartItemId)
  const updatedCart = calculateCartTotals(cart.items)
  saveCart(userId, updatedCart)
  return { success: true, cart: updatedCart }
}

export const clearCart = (userId: string) => {
  saveCart(userId, { items: [], subtotal: 0, gst: 0, deliveryCharge: 0, total: 0 })
}

export const getCartItemCount = (userId: string): number => {
  const cart = getCart(userId)
  return cart.items.length
}
