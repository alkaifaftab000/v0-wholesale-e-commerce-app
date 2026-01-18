"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCart, updateCartItemQuantity, removeFromCart, GUEST_ID } from "@/lib/cart-utils"
import type { Cart } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingCart,
  Truck,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const guestUserId = GUEST_ID

  useEffect(() => {
    setCart(getCart(guestUserId))
    setIsLoading(false)
  }, [])

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    if (!cart) return

    const item = cart.items.find((i) => i.cartItemId === cartItemId)
    if (!item) return

    const newQuantity = item.quantity + delta
    if (newQuantity < 1) return

    const result = updateCartItemQuantity(guestUserId, cartItemId, newQuantity)
    if (result.success) {
      setCart({ ...result.cart })
      window.dispatchEvent(new Event("storage"))
    }
  }

  const handleRemoveItem = (cartItemId: string) => {
    const result = removeFromCart(guestUserId, cartItemId)
    if (result.success) {
      setCart({ ...result.cart })
      window.dispatchEvent(new Event("storage"))
      toast({
        title: "Item removed",
        description: "The product has been removed from your cart.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F6]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF8F6] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md w-full border border-[#E5D5D0]">
          <div className="w-20 h-20 bg-[#FDF8F6] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-[#6F4E37] opacity-20" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D1B14] mb-2">Your cart is empty</h1>
          <p className="text-[#8C786F] mb-8">Start adding premium grains and pulses to your wholesale order.</p>
          <Button asChild className="w-full bg-[#6F4E37] hover:bg-[#5D402E] h-12 rounded-xl font-bold">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F6] pb-20">
      <header className="bg-white border-b h-20 flex items-center px-4 md:px-8 sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-[#FDF8F6]">
            <Link href="/">
              <ArrowLeft className="h-5 w-5 text-[#6F4E37]" />
            </Link>
          </Button>
          <h1 className="text-xl font-extrabold text-[#2D1B14]">Shopping Cart</h1>
          <Badge variant="secondary" className="ml-2 bg-[#6F4E37]/10 text-[#6F4E37] border-none">
            {cart.items.length} Items
          </Badge>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <Card key={item.cartItemId} className="border-none shadow-sm overflow-hidden group">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-32 h-32 bg-muted/30 rounded-2xl flex items-center justify-center text-4xl shrink-0">
                        {item.category === "grains" ? "🌾" : item.category === "pulses" ? "🫘" : "🍚"}
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#8C786F]/60">
                                {item.brand}
                              </span>
                              <Badge variant="outline" className="text-[9px] uppercase h-4 px-1 leading-none">
                                {item.subcategory}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-bold text-[#2D1B14]">{item.productName}</h3>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#6F4E37]">₹{item.itemTotal.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground italic">
                              ₹{item.pricePerQuintal.toLocaleString()} / Quintal
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4 bg-[#FDF8F6] p-1 rounded-xl">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-white"
                              onClick={() => handleUpdateQuantity(item.cartItemId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="flex flex-col items-center min-w-[32px]">
                              <span className="text-sm font-bold leading-none">{item.quantity}</span>
                              <span className="text-[9px] font-medium text-[#8C786F] uppercase">Lots</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-white"
                              onClick={() => handleUpdateQuantity(item.cartItemId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-bold text-[#2D1B14]">{item.totalQuintal} Quintals</p>
                              <p className="text-[10px] text-muted-foreground font-medium">
                                ({item.totalBags} × {item.bagSize}kg Bags)
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl"
                              onClick={() => handleRemoveItem(item.cartItemId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm border border-[#E5D5D0]/50">
                <Truck className="h-5 w-5 text-[#6F4E37] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-[#2D1B14]">Wholesale Delivery</h4>
                  <p className="text-xs text-muted-foreground">Standard 3-5 business days delivery for bulk orders.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm border border-[#E5D5D0]/50">
                <ShieldCheck className="h-5 w-5 text-[#6F4E37] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-[#2D1B14]">Quality Verified</h4>
                  <p className="text-xs text-muted-foreground">All products are verified for B2B export standards.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden sticky top-28">
              <CardHeader className="bg-[#6F4E37] text-white">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C786F] font-medium">Subtotal ({cart.items.length} items)</span>
                  <span className="font-bold text-[#2D1B14]">₹{cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C786F] font-medium">GST (9%)</span>
                  <span className="font-bold text-[#2D1B14]">₹{cart.gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8C786F] font-medium">Delivery</span>
                    {cart.subtotal < 50000 && (
                      <div className="group relative">
                        <AlertCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          Free delivery on orders above ₹50,000
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={cn("font-bold", cart.deliveryCharge === 0 ? "text-green-600" : "text-[#2D1B14]")}>
                    {cart.deliveryCharge === 0 ? "FREE" : `₹${cart.deliveryCharge.toLocaleString()}`}
                  </span>
                </div>

                {cart.subtotal < 50000 && (
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1">
                      Free Delivery Progress
                    </p>
                    <div className="h-1.5 w-full bg-amber-200/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${(cart.subtotal / 50000) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-amber-600 mt-2 font-medium italic">
                      Add ₹{(50000 - cart.subtotal).toLocaleString()} more for free delivery
                    </p>
                  </div>
                )}

                <Separator className="bg-[#E5D5D0]" />

                <div className="flex justify-between items-center">
                  <span className="text-base font-extrabold text-[#2D1B14]">Estimated Total</span>
                  <span className="text-xl font-black text-[#6F4E37]">₹{cart.total.toLocaleString()}</span>
                </div>

                <Button
                  className="w-full bg-[#6F4E37] hover:bg-[#5D402E] text-white font-bold h-12 rounded-xl group"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="text-[10px] text-center text-muted-foreground font-medium">
                  Tax and delivery calculated at checkout
                </p>
              </CardContent>
            </Card>

            <div className="bg-white/50 border border-[#E5D5D0] p-6 rounded-2xl text-center space-y-3">
              <p className="text-xs font-bold text-[#2D1B14] uppercase tracking-wider">Wholesale Orders</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Browse and order premium wholesale products directly from Shyam Wholesale Solutions.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
