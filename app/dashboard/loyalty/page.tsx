"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Zap, Truck, Gift, TrendingUp, HelpCircle } from "lucide-react"

export default function LoyaltyPage() {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('loyalty_points')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setLoyaltyPoints(data.loyalty_points || 0)
        }
      }
      setLoading(false)
    }
    loadData()
  }, [supabase])

  const currentDiscount = (Math.floor(loyaltyPoints / 10) * 1).toFixed(0); 

  if (loading) return <div className="p-10 text-center">Loading rewards...</div>

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">ThokWale Rewards</h1>
        <p className="text-gray-500 text-lg">Earn points on every order and unlock exclusive B2B benefits.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-orange-200 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Award className="w-48 h-48" />
          </div>
          <CardContent className="p-8 md:p-10 relative z-10 flex flex-col justify-center h-full">
            <p className="text-orange-100 font-medium mb-2 uppercase tracking-wider">Your Balance</p>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-6xl font-black">{loyaltyPoints.toLocaleString()}</span>
              <span className="text-xl text-orange-200 mb-2">Pts</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block self-start border border-white/20">
              <p className="font-semibold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                You've unlocked a {currentDiscount}% discount!
              </p>
              <p className="text-sm text-orange-100 mt-1">Available to apply on your next bulk order.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm flex flex-col justify-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> How to Earn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-bold text-gray-900 text-xl mb-1">1 Point</p>
              <p className="text-sm text-gray-500">For every 50kg of products ordered through ThokWale.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-bold text-gray-900 text-xl mb-1">1% Discount</p>
              <p className="text-sm text-gray-500">Redeemable for every 10 points on your total cart value.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Exclusive Partner Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cashback Rewards</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Use your accumulated points to apply direct discounts to your invoice at checkout, maximizing your wholesale margins.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Priority Dispatch</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Loyal partners (&gt;200kg/month) get priority logistics routing, ensuring your shelves are stocked faster than competitors.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Dedicated Account Manager</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Top tier retailers receive a dedicated WhatsApp line for instant support, custom quotes, and brand negotiations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
