"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Star, ShieldCheck, Factory, Truck, Info, CheckCircle2, Lock } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "../../components/CartProvider"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  
  const [user, setUser] = useState<any>(null)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState<number>(0)
  
  const supabase = createClient()
  const productId = params.id as string

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      const { data: fetchedProduct } = await supabase.from('products').select('*, brands(name), categories(name)').eq('id', productId).single()
      
      if (fetchedProduct) {
        setProduct(fetchedProduct)
        setQuantity(fetchedProduct.min_order_bags * fetchedProduct.bag_weight_kg)
      }
      setLoading(false)
    }
    loadData()
  }, [supabase, productId])

  if (loading) return <div className="p-10 text-center">Loading product...</div>
  
  if (!product) return <div className="p-10 text-center">Product not found.</div>

  const isRetailer = user?.user_metadata?.role === "retailer"
  const totalValue = quantity * product.price_per_kg
  const minOrderKg = product.min_order_bags * product.bag_weight_kg
  const mrpPerKg = Math.round(product.price_per_kg * 1.4) // 40% margin assumption

  const handleAddToCart = () => {
    if (!isRetailer) {
      toast.error("Only Verified Retailers can add to cart.")
      router.push("/dashboard/journey")
      return
    }
    
    if (quantity < minOrderKg) {
      toast.error(`Minimum order quantity is ${minOrderKg} kg`)
      return
    }
    
    if (quantity > product.stock_kg) {
      toast.error(`Only ${product.stock_kg} kg available in stock`)
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      brand: product.brands?.name || "Unbranded",
      pricePerKg: product.price_per_kg,
      minOrderKg: minOrderKg,
      quantityKg: quantity,
      image: product.image_url || "/placeholder.jpg"
    })
    toast.success("Added to cart!")
  }

  let featuresList = []
  try {
    featuresList = typeof product.features === 'string' ? JSON.parse(product.features) : product.features
  } catch (e) {
    featuresList = []
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          
          {/* Left: Product Image & Badges */}
          <div className="p-6 md:p-10 bg-gray-50 flex flex-col items-center justify-center relative">
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                B2B Exclusive
              </span>
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> In Stock
              </span>
            </div>
            
            <div className="relative w-full aspect-square max-w-md rounded-xl overflow-hidden shadow-lg border-4 border-white">
              <Image src={product.image_url || "/placeholder.jpg"} alt={product.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="mt-8 flex items-center gap-6 text-gray-500 text-sm font-medium">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500"/> Quality Assured</div>
              <div className="flex items-center gap-1.5"><Factory className="w-4 h-4 text-gray-400"/> Direct from Mill</div>
            </div>
          </div>

          {/* Right: Product Details & Action */}
          <div className="p-6 md:p-10 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-orange-600 uppercase tracking-wider">{product.brands?.name || "Unbranded"}</p>
              <div className="flex items-center gap-1 text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 
                4.8 <span className="text-gray-400 font-normal">(124)</span>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            {/* Pricing Section (GATED) */}
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 mb-6">
              {isRetailer ? (
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Wholesale Price</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-gray-900">₹{product.price_per_kg}</span>
                      <span className="text-gray-500 mb-1 font-medium">/ kg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 line-through">MRP: ₹{mrpPerKg}/kg</p>
                    <p className="text-sm font-bold text-green-600">Margin: {Math.round(((mrpPerKg - product.price_per_kg)/mrpPerKg)*100)}%</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-col py-2 relative overflow-hidden">
                  <div className="filter blur-md opacity-40 select-none pointer-events-none flex items-end gap-2">
                    <span className="text-4xl font-black text-gray-900">₹{product.price_per_kg}</span>
                    <span className="text-gray-500 mb-1 font-medium">/ kg</span>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <Lock className="w-6 h-6 text-gray-400 mb-1" />
                    <p className="text-sm font-bold text-gray-700">Retailer Account Required</p>
                    <p className="text-xs text-gray-500">Upgrade to view wholesale B2B pricing</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Wholesale distribution from verified mills. Guaranteed authentic quality directly from {product.brands?.name || "the brand"} for the {product.categories?.name || ""} category.
            </p>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Info className="w-4 h-4"/> Key Specifications</h3>
              <ul className="grid grid-cols-2 gap-2">
                {featuresList && featuresList.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Quantity (Kg)</label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(minOrderKg, quantity - product.bag_weight_kg))}
                      disabled={!isRetailer || quantity <= minOrderKg}
                      className="px-4 py-3 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >-</button>
                    <input 
                      type="number" 
                      value={quantity}
                      disabled={!isRetailer}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full text-center py-3 font-bold text-gray-900 outline-none appearance-none" 
                    />
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock_kg, quantity + product.bag_weight_kg))}
                      disabled={!isRetailer || quantity >= product.stock_kg}
                      className="px-4 py-3 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >+</button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 text-center">Min Order: {minOrderKg}kg</p>
                </div>
                
                <div className="w-full sm:w-2/3 flex flex-col justify-end">
                  <Button 
                    onClick={handleAddToCart}
                    className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                      isRetailer 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {isRetailer ? (
                      <>
                        <ShoppingCart className="w-5 h-5" /> Add to Cart (₹{totalValue.toLocaleString()})
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" /> Login as Retailer to Buy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400 pt-2">
                <Truck className="w-4 h-4" /> Dispatches within 24 hours of order confirmation
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
