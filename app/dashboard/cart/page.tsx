"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, ArrowRight, MapPin, AlertCircle } from "lucide-react"
import { useCart } from "../components/CartProvider"
import { toast } from "sonner"
import Link from "next/link"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalWeight, totalPrice } = useCart()
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user?.user_metadata?.role !== "retailer") {
        toast.error("Cart is locked for basic users")
        router.push("/dashboard/journey")
        return
      }

      // Load addresses from Supabase (same source as /dashboard/addresses)
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          label: d.label,
          address: d.address,
          pincode: d.pincode,
          isDefault: d.is_default,
        }))
        setAddresses(mapped)
        const def = mapped.find((a: any) => a.isDefault)
        if (def) setSelectedAddress(def.id)
        else setSelectedAddress(mapped[0].id)
      }
      
      setLoading(false)
    }
    loadData()
  }, [supabase, router])

  const proceedToCheckout = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }
    if (totalItems === 0) {
      toast.error("Your cart is empty")
      return
    }
    
    // Pass selected address to checkout via local storage or query param
    localStorage.setItem("thokwale_checkout_address", selectedAddress)
    router.push("/dashboard/checkout")
  }

  if (loading) return <div className="p-10 text-center">Loading cart...</div>

  if (totalItems === 0) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-32 h-32 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500">Looks like you haven't added any wholesale products to your cart yet.</p>
        <Button asChild className="mt-8 bg-orange-600 hover:bg-orange-700">
          <Link href="/dashboard/categories">Browse Categories</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-orange-600" /> Review Bulk Order
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold text-orange-600 uppercase mb-1">{item.brand}</p>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight pr-4">{item.name}</h3>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-2xl font-black text-gray-900">₹{item.pricePerKg}</span>
                      <span className="text-sm font-medium text-gray-500 mb-1">/ kg</span>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-bold text-gray-500 uppercase">Weight:</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                          <button onClick={() => updateQuantity(item.id, item.quantityKg - 50)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 font-bold">-</button>
                          <input type="number" value={item.quantityKg} readOnly className="w-16 text-center py-1.5 font-bold text-gray-900 text-sm outline-none bg-transparent" />
                          <button onClick={() => updateQuantity(item.id, item.quantityKg + 50)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 font-bold">+</button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-0.5">Item Total</p>
                        <p className="font-bold text-orange-600 text-lg">₹{(item.pricePerKg * item.quantityKg).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-gray-100 shadow-sm sticky top-24">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Address Selection */}
              <div>
                <label className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" /> Select Shop
                </label>
                {addresses.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {addresses.map(addr => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedAddress === addr.id 
                            ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-bold text-sm text-gray-900">{addr.label}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{addr.address}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">No Address Found</p>
                      <Link href="/dashboard/addresses" className="underline mt-1 block">Add an address</Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Items</span>
                  <span className="font-medium">{totalItems} Brands</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Weight</span>
                  <span className="font-medium text-blue-600 bg-blue-50 px-2 rounded">{totalWeight.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Wholesale Value</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Estimated Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 border-t border-gray-100 pt-6 flex-col items-stretch gap-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-900 font-bold uppercase text-xs">Subtotal</span>
                <span className="text-2xl font-black text-gray-900">₹{totalPrice.toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={proceedToCheckout} 
                disabled={!selectedAddress}
                className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg rounded-xl shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
