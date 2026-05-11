"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

export type CartItem = {
  id: string;
  name: string;
  brand: string;
  pricePerKg: number;
  minOrderKg: number;
  quantityKg: number;
  image: string;
}

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantityKg'> & { quantityKg?: number }) => void;
  updateQuantity: (id: string, quantityKg: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalWeight: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("thokwale_cart")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse cart")
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to LocalStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("thokwale_cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (newItem: Omit<CartItem, 'quantityKg'> & { quantityKg?: number }) => {
    setItems(current => {
      const existing = current.find(i => i.id === newItem.id)
      const qtyToAdd = newItem.quantityKg || newItem.minOrderKg
      
      if (existing) {
        toast.success(`Added ${qtyToAdd}kg more of ${newItem.name}`)
        return current.map(i => i.id === newItem.id ? { ...i, quantityKg: i.quantityKg + qtyToAdd } : i)
      }
      
      toast.success(`${newItem.name} added to cart!`)
      return [...current, { ...newItem, quantityKg: Math.max(qtyToAdd, newItem.minOrderKg) }]
    })
  }

  const updateQuantity = (id: string, quantityKg: number) => {
    setItems(current => 
      current.map(i => {
        if (i.id === id) {
          if (quantityKg < i.minOrderKg) {
            toast.error(`Minimum order for ${i.name} is ${i.minOrderKg}kg`)
            return i;
          }
          return { ...i, quantityKg }
        }
        return i
      })
    )
  }

  const removeItem = (id: string) => {
    setItems(current => current.filter(i => i.id !== id))
    toast.info("Item removed from cart")
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.length
  const totalWeight = items.reduce((sum, item) => sum + item.quantityKg, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.pricePerKg * item.quantityKg), 0)

  return (
    <CartContext.Provider value={{
      items, addItem, updateQuantity, removeItem, clearCart,
      totalItems, totalWeight, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
