"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Truck, Percent, Gift, BookOpen, Clock, Building2 } from "lucide-react"

export default function RetailerBenefitsPage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Retailer Benefits</h1>
        <p className="text-gray-500 text-lg">Welcome to the inner circle. Here is everything you unlock as a Verified Retailer.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-orange-200 bg-orange-50 shadow-sm relative overflow-hidden">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none">
            <Percent className="w-48 h-48 text-orange-600" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-orange-900">
              <Percent className="w-6 h-6 text-orange-600" /> Wholesale B2B Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-800 leading-relaxed relative z-10">
            Gain immediate access to factory-direct wholesale pricing across our entire catalog. Margins are guaranteed to be significantly better than standard MRP, allowing you to maximize your shop's profitability.
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <Gift className="w-6 h-6 text-green-600" /> ThokWale Loyalty Points
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            Earn 1 Loyalty Point for every 50kg you order. You can redeem these points at checkout for a direct discount on your invoice. 10 Points = 1% discount applied to your entire cart!
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <Building2 className="w-6 h-6 text-blue-600" /> Multi-Shop Management
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            Do you run multiple branches? You can save and manage multiple delivery addresses in your Address Book. Route specific bulk orders to different warehouse locations directly from the checkout screen.
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <BookOpen className="w-6 h-6 text-purple-600" /> Exclusive Catalogs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            Get early access to newly onboarded brands and exclusive regional produce before they are made available to the public or basic users. 
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <Truck className="w-6 h-6 text-indigo-600" /> Payment & Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            Unlock optimized payment gateways. Pay via UPI for an instant flat discount, or use Credit Cards for 1% cashback. Cash on Delivery is also supported for your peace of mind.
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <Clock className="w-6 h-6 text-rose-600" /> Priority Support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 leading-relaxed">
            As a Verified Retailer, your tickets and inquiries bypass the standard queue. Our B2B account managers are dedicated to resolving your logistics or sourcing issues immediately.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
