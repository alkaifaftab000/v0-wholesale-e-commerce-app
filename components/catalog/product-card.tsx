"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart, Info, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addToCart } from "@/lib/cart-utils"

interface ProductCardProps {
  product: Product
  userId: string
}

export function ProductCard({ product, userId }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()

  const maxLots = Math.floor(product.stockQuantity / product.quintalPerLot)
  const isOutOfStock = product.stock === "out-of-stock" || maxLots === 0
  const totalPrice = product.pricePerQuintal * (quantity * product.quintalPerLot)

  const handleIncrement = () => {
    if (quantity < maxLots) {
      setQuantity((prev) => prev + 1)
    } else {
      toast({
        title: "Stock limit reached",
        description: `Only ${maxLots} lots available in stock.`,
        variant: "destructive",
      })
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    const result = addToCart(userId, product, quantity)
    if (result.success) {
      setIsAdded(true)
      toast({
        title: "Added to Cart",
        description: `${product.productName} (${quantity} lots) added successfully.`,
      })
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  return (
    <Card
      className={`overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-md ${isOutOfStock ? "opacity-60 grayscale" : "opacity-100"}`}
    >
      <div className="relative aspect-square bg-muted/30">
        {product.productImage ? (
          <Image
            src={product.productImage || "/placeholder.svg"}
            alt={product.productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
            {product.category === "grains"
              ? "🌾"
              : product.category === "pulses"
                ? "🫘"
                : product.category === "rice"
                  ? "🍚"
                  : "🍞"}
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {isOutOfStock && (
            <Badge variant="destructive" className="font-bold uppercase tracking-wider">
              Out of Stock
            </Badge>
          )}
          {product.stock === "limited" && !isOutOfStock && (
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              Limited Stock
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 backdrop-blur shadow-sm">
            {product.brand}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-[#2D1B14] line-clamp-1">{product.productName}</h3>
          <Badge variant="outline" className="text-[10px] uppercase">
            {product.subcategory}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-[#8C786F]">
            <span className="font-bold text-[#6F4E37] text-lg">₹{product.pricePerQuintal.toLocaleString()}</span>
            <span className="ml-1 italic">/ Quintal</span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            ₹{totalPrice.toLocaleString()} for {quantity * product.quintalPerLot} Quintals
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        {!isOutOfStock ? (
          <>
            <div className="flex items-center justify-between w-full bg-muted/30 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">{quantity}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Lots</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={handleIncrement}
                disabled={quantity >= maxLots}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex gap-2 w-full">
              <Button
                className={`flex-1 font-bold h-10 transition-colors ${isAdded ? "bg-green-600 hover:bg-green-700" : "bg-[#6F4E37] hover:bg-[#5D402E]"}`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 border-[#E5D5D0] bg-transparent">
                <Info className="h-4 w-4 text-[#6F4E37]" />
              </Button>
            </div>
          </>
        ) : (
          <Button disabled className="w-full h-10 font-bold bg-muted-foreground/30">
            Currently Unavailable
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
