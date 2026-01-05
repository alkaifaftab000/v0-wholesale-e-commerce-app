"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getCart, clearCart } from "@/lib/cart-utils"
import type { Cart, DeliveryAddress } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronRight, ArrowLeft, Truck, CreditCard, ShoppingBag, Loader2, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [cart, setCart] = useState<Cart | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [addressOption, setAddressOption] = useState("registered")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [address, setAddress] = useState<DeliveryAddress>({
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    phone: "",
  })

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profileData)

      const userCart = getCart(user.id)
      if (!userCart || userCart.items.length === 0) {
        router.push("/cart")
        return
      }
      setCart(userCart)

      // Initialize address with profile data
      if (profileData) {
        setAddress((prev) => ({
          ...prev,
          addressLine1: profileData.address || "",
          contactPerson: profileData.business_name || "",
          phone: profileData.phone || "",
        }))
      }

      setIsLoading(false)
    }
    init()
  }, [supabase, router])

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    console.log("[v0] Placing order for user:", user?.id, "Total:", cart?.total)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (user) {
      clearCart(user.id)
      console.log("[v0] Order placed successfully, cart cleared")
      window.dispatchEvent(new Event("storage"))
      setStep(4)
    }
    setIsProcessing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F6]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F6]">
      {/* Checkout Header */}
      <header className="bg-white border-b h-20 flex items-center sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cart" className="flex items-center text-sm font-bold text-[#6F4E37]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div
              className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? "text-[#6F4E37]" : "text-muted-foreground"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? "bg-[#6F4E37] text-white" : "bg-muted"}`}
              >
                1
              </div>
              Order Review
            </div>
            <div
              className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? "text-[#6F4E37]" : "text-muted-foreground"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-[#6F4E37] text-white" : "bg-muted"}`}
              >
                2
              </div>
              Delivery
            </div>
            <div
              className={`flex items-center gap-2 text-sm font-bold ${step >= 3 ? "text-[#6F4E37]" : "text-muted-foreground"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? "bg-[#6F4E37] text-white" : "bg-muted"}`}
              >
                3
              </div>
              Payment
            </div>
          </div>
          <Link href="/" className="font-extrabold text-[#6F4E37]">
            Shyam Wholesale Solutions
          </Link>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto p-4 md:p-8">
        {step < 4 ? (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-6">
              {/* Step 1: Review Order */}
              {step === 1 && (
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-white border-b">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-[#6F4E37]" /> Review Your Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-[#E5D5D0]/30">
                      {cart?.items.map((item) => (
                        <div key={item.cartItemId} className="p-6 flex justify-between items-center">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-muted/30 rounded-xl flex items-center justify-center text-2xl">
                              {item.category === "grains" ? "🌾" : item.category === "pulses" ? "🫘" : "🍚"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#8C786F] uppercase tracking-tighter">
                                {item.brand}
                              </p>
                              <h4 className="font-bold text-[#2D1B14]">{item.productName}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.quantity} Lots ({item.totalQuintal} Quintals)
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#6F4E37]">₹{item.itemTotal.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">₹{item.pricePerQuintal}/Quintal</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-[#FDF8F6]/50 border-t flex justify-end">
                    <Button onClick={() => setStep(2)} className="bg-[#6F4E37] hover:bg-[#5D402E] font-bold px-8 h-12">
                      Continue to Delivery <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 2: Delivery Address */}
              {step === 2 && (
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-white border-b">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Truck className="h-5 w-5 text-[#6F4E37]" /> Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    <RadioGroup value={addressOption} onValueChange={setAddressOption} className="space-y-4">
                      <div
                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${addressOption === "registered" ? "border-[#6F4E37] bg-[#6F4E37]/5" : "border-[#E5D5D0]/30"}`}
                      >
                        <RadioGroupItem value="registered" id="registered" className="mt-1" />
                        <Label htmlFor="registered" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-extrabold text-[#2D1B14] flex items-center gap-2">
                              <Building2 className="h-4 w-4" /> Registered Business Address
                            </span>
                            <Badge className="bg-[#6F4E37] text-white text-[10px]">Default</Badge>
                          </div>
                          <p className="text-sm text-[#8C786F] leading-relaxed">
                            {profile?.address || "Address not specified"}
                          </p>
                          <div className="mt-3 flex gap-4 text-[10px] font-bold text-[#6F4E37] uppercase tracking-wider">
                            <span>Phone: +91 {profile?.phone}</span>
                            <span>GST: {profile?.gst_number}</span>
                          </div>
                        </Label>
                      </div>

                      <div
                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${addressOption === "alternate" ? "border-[#6F4E37] bg-[#6F4E37]/5" : "border-[#E5D5D0]/30"}`}
                      >
                        <RadioGroupItem value="alternate" id="alternate" className="mt-1" />
                        <Label htmlFor="alternate" className="flex-1 cursor-pointer">
                          <span className="font-extrabold text-[#2D1B14]">Add Alternate Address</span>
                          <p className="text-sm text-[#8C786F]">Deliver to a different warehouse or storefront.</p>
                        </Label>
                      </div>
                    </RadioGroup>

                    {addressOption === "alternate" && (
                      <div className="grid gap-4 mt-6 animate-in fade-in slide-in-from-top-4">
                        <div className="grid gap-2">
                          <Label htmlFor="addressLine1">Address Line 1</Label>
                          <Input id="addressLine1" placeholder="Warehouse #, Building, Street" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="pincode">PIN Code</Label>
                            <Input id="pincode" maxLength={6} />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-6 bg-[#FDF8F6]/50 border-t flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)} className="text-[#8C786F] font-bold">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Review
                    </Button>
                    <Button onClick={() => setStep(3)} className="bg-[#6F4E37] hover:bg-[#5D402E] font-bold px-8 h-12">
                      Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-white border-b">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#6F4E37]" /> Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      {[
                        { id: "cod", title: "Cash on Delivery", desc: "Pay via cash/cheque upon receiving shipment" },
                        {
                          id: "bank",
                          title: "Direct Bank Transfer",
                          desc: "Transfer funds within 24h to confirm order",
                        },
                        { id: "credit", title: "Business Credit", desc: "Available for partners with 30+ day tenure" },
                      ].map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === method.id ? "border-[#6F4E37] bg-[#6F4E37]/5" : "border-[#E5D5D0]/30"}`}
                        >
                          <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <span className="font-extrabold text-[#2D1B14]">{method.title}</span>
                            <p className="text-sm text-[#8C786F]">{method.desc}</p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className="p-6 bg-[#FDF8F6]/50 border-t flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(2)} className="text-[#8C786F] font-bold">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Delivery
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-[#6F4E37] hover:bg-[#5D402E] font-black px-10 h-12 text-lg shadow-lg shadow-[#6F4E37]/20"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                        </>
                      ) : (
                        "Confirm Wholesale Order"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            {/* Price Summary Sidebar */}
            <aside className="space-y-6">
              <Card className="border-none shadow-md overflow-hidden sticky top-28">
                <CardHeader className="bg-[#2D1B14] text-white">
                  <CardTitle className="text-lg">Checkout Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8C786F] font-medium">Subtotal</span>
                    <span className="font-bold text-[#2D1B14]">₹{cart?.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8C786F] font-medium">GST (9%)</span>
                    <span className="font-bold text-[#2D1B14]">₹{cart?.gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8C786F] font-medium">Delivery</span>
                    <span className={cn("font-bold", cart?.deliveryCharge === 0 ? "text-green-600" : "text-[#2D1B14]")}>
                      {cart?.deliveryCharge === 0 ? "FREE" : `₹${cart?.deliveryCharge.toLocaleString()}`}
                    </span>
                  </div>

                  <Separator className="bg-[#E5D5D0]" />

                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-extrabold text-[#2D1B14]">Payable Total</span>
                    <span className="text-2xl font-black text-[#6F4E37]">₹{cart?.total.toLocaleString()}</span>
                  </div>

                  <div className="pt-4 p-4 bg-[#FDF8F6] rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-700">Locked Pricing</p>
                      <p className="text-[10px] text-[#8C786F] leading-tight">
                        Wholesale rates are secured for this session based on your business tier.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        ) : (
          /* Step 4: Success State */
          <div className="max-w-2xl mx-auto py-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-black text-[#2D1B14] mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-[#8C786F] mb-12">
              Your wholesale order #SH-928374 has been confirmed. You will receive a copy of the proforma invoice on{" "}
              <span className="font-bold text-[#2D1B14]">{user?.email}</span> shortly.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <Card className="text-left border-none shadow-sm p-6 bg-white">
                <p className="text-[10px] font-black uppercase text-[#8C786F] mb-2 tracking-widest">Next Steps</p>
                <ul className="space-y-3">
                  {[
                    "Account manager will call for scheduling",
                    "Shipment preparation begins (24-48h)",
                    "Track real-time via dashboard",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-[#2D1B14]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6F4E37]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="text-left border-none shadow-sm p-6 bg-white">
                <p className="text-[10px] font-black uppercase text-[#8C786F] mb-2 tracking-widest">Support</p>
                <p className="text-sm font-bold text-[#2D1B14] mb-2">Need to adjust your order?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Call your dedicated relationship manager at +91 1800-SHYAM-99 or email us at
                  support@shyamwholesale.com
                </p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#6F4E37] hover:bg-[#5D402E] font-bold h-14 px-12 rounded-xl">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#E5D5D0] text-[#6F4E37] font-bold h-14 px-12 rounded-xl bg-white"
              >
                Print Order Receipt
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
