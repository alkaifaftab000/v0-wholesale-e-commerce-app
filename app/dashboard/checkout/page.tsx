"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Smartphone, Banknote, Building, MapPin, Receipt, CheckCircle2, ChevronLeft, ShieldCheck } from "lucide-react"
import { useCart } from "../components/CartProvider"
import { toast } from "sonner"
import confetti from "canvas-confetti"

export default function CheckoutPage() {
  const { items, totalWeight, totalPrice, clearCart } = useCart()
  const [user, setUser] = useState<any>(null)
  const [address, setAddress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<string>("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const [loyaltyPoints, setLoyaltyPoints] = useState(0)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user?.user_metadata?.role !== "retailer") {
        router.push("/dashboard")
        return
      }

      if (items.length === 0) {
        router.push("/dashboard/cart")
        return
      }

      // Fetch actual loyalty points
      const { data: profile } = await supabase.from('user_profiles').select('loyalty_points').eq('id', user.id).single()
      if (profile) {
        setLoyaltyPoints(profile.loyalty_points || 0)
      }

      const addressId = localStorage.getItem("thokwale_checkout_address")
      const savedAddresses = localStorage.getItem(`thokwale_addresses_${user?.id}`)
      
      if (savedAddresses && addressId) {
        const parsed = JSON.parse(savedAddresses)
        const addr = parsed.find((a: any) => a.id === addressId)
        if (addr) setAddress(addr)
        else setAddress(parsed[0])
      }
      
      setLoading(false)
    }
    loadData()
  }, [supabase, router, items])

  // Calculations
  const gstRate = 0.05 // 5% GST
  const gstAmount = totalPrice * gstRate
  
  // Loyalty calculation (1 pt per 50kg, 1% discount per 10 pts)
  const loyaltyPointsEarned = Math.floor(totalWeight / 50)
  
  // Discount is based on PREVIOUSLY earned points
  const discountPercentFromLoyalty = Math.floor(loyaltyPoints / 10) 
  const maxDiscountPercent = 5 // Cap at 5%
  const appliedLoyaltyPercent = Math.min(discountPercentFromLoyalty, maxDiscountPercent)
  const loyaltyDiscountValue = totalPrice * (appliedLoyaltyPercent / 100)
  
  // Calculate points deducted
  const pointsDeducted = appliedLoyaltyPercent * 10

  // Payment Logic
  let paymentSurcharge = 0
  let paymentDiscount = 0
  
  if (paymentMethod === "upi") {
    paymentDiscount = 100
  } else if (paymentMethod === "card") {
    paymentDiscount = totalPrice * 0.01 // 1% off
  } else if (paymentMethod === "cod") {
    paymentSurcharge = 50
  }

  const finalTotal = totalPrice + gstAmount - loyaltyDiscountValue - paymentDiscount + paymentSurcharge

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // 1. Fetch random warehouse
      const { data: warehouses } = await supabase.from('warehouses').select('id')
      let assignedWarehouseId = null
      if (warehouses && warehouses.length > 0) {
        const randomWh = warehouses[Math.floor(Math.random() * warehouses.length)]
        assignedWarehouseId = randomWh.id
      }

      const orderData = {
        user_id: user.id,
        items: items,
        delivery_address: address,
        total_weight_kg: totalWeight,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        status: 'confirmed',
        warehouse_id: assignedWarehouseId
      }

      const { error } = await supabase.from('orders').insert(orderData)
      if (error) throw error

      // Update Loyalty Points (Current - Deducted + Earned)
      const newLoyaltyBalance = loyaltyPoints - pointsDeducted + loyaltyPointsEarned
      await supabase.from('user_profiles').update({ loyalty_points: newLoyaltyBalance }).eq('id', user.id)

      setIsSuccess(true)
      clearCart()
      
      // Confetti
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
      
    } catch (error: any) {
      toast.error("Checkout Failed: " + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return <div className="p-10 text-center">Preparing Checkout...</div>

  if (isSuccess) {
    return (
      <div className="p-10 max-w-2xl mx-auto text-center space-y-6 mt-20">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-gray-900">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-600">Your bulk wholesale order has been confirmed.</p>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-left my-8">
          <p className="font-bold text-gray-900 mb-2">Delivery to: {address?.label}</p>
          <p className="text-gray-600 text-sm">{address?.address}</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">You earned <strong className="text-orange-600">{loyaltyPointsEarned} Loyalty Points</strong> on this order.</p>
          </div>
        </div>
        <Button onClick={() => router.push("/dashboard")} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-xl font-bold">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Cart
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Payment & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-gray-400" /> Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="font-bold text-gray-900 mb-1">{address?.label}</p>
              <p className="text-gray-600 text-sm">{address?.address}</p>
              <p className="text-gray-900 font-medium text-sm mt-2">PIN: {address?.pincode}</p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="w-5 h-5 text-gray-400" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod("upi")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3 ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Smartphone className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-bold text-gray-900">UPI</p>
                    <p className="text-xs text-green-600 font-bold mt-1">Flat ₹100 Off</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod("card")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3 ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-bold text-gray-900">Credit/Debit Card</p>
                    <p className="text-xs text-green-600 font-bold mt-1">1% Cashback</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3 ${paymentMethod === 'netbanking' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Building className={`w-6 h-6 ${paymentMethod === 'netbanking' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-bold text-gray-900">Net Banking</p>
                    <p className="text-xs text-gray-500 mt-1">Standard Rates</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3 ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-red-500 font-bold mt-1">+₹50 Logistics Fee</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Invoice */}
        <div className="space-y-6">
          <Card className="border-gray-100 shadow-sm sticky top-24">
            <CardHeader className="bg-gray-900 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5" /> Tax Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items Total ({items.length})</span>
                <span className="font-medium text-gray-900">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Weight</span>
                <span className="font-medium text-blue-600">{totalWeight.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-100 pt-4">
                <span className="text-gray-600">GST (5%)</span>
                <span className="font-medium text-gray-900">₹{gstAmount.toLocaleString()}</span>
              </div>
              
              {loyaltyDiscountValue > 0 && (
                <div className="flex justify-between text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <span>Loyalty Discount ({appliedLoyaltyPercent}%)</span>
                  <span>-₹{loyaltyDiscountValue.toLocaleString()}</span>
                </div>
              )}

              {paymentDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <span>Payment Discount</span>
                  <span>-₹{paymentDiscount.toLocaleString()}</span>
                </div>
              )}

              {paymentSurcharge > 0 && (
                <div className="flex justify-between text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <span>COD Handling Fee</span>
                  <span>+₹{paymentSurcharge.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="bg-gray-50 border-t border-gray-100 pt-6 flex-col items-stretch gap-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-900 font-bold uppercase text-xs">Total Amount</span>
                <span className="text-3xl font-black text-gray-900">₹{finalTotal.toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg rounded-xl shadow-md"
              >
                {isProcessing ? "Processing Payment..." : `Pay ₹${finalTotal.toLocaleString()}`}
              </Button>

              <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Encryption
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  )
}
