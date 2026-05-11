import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, PackageCheck, Users, Warehouse, MapPin, TrendingUp, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardHome() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const userName = data?.user?.user_metadata?.full_name || data?.user?.user_metadata?.name || data?.user?.email?.split('@')[0] || "User"

  // 1. Fetch User Stats (Orders)
  let totalOrders = 0
  let totalBags = 0
  let totalWeight = 0

  if (data?.user) {
    const { data: orders } = await supabase.from('orders').select('total_price, total_weight_kg').eq('user_id', data.user.id)
    if (orders) {
      totalOrders = orders.length
      totalWeight = orders.reduce((acc, order) => acc + (order.total_weight_kg || 0), 0)
      // Estimate bags based on 50kg average if not explicitly stored
      totalBags = Math.round(totalWeight / 50)
    }
  }

  // 2. Fetch Platform Overview Stats
  const { count: brandsCount } = await supabase.from('brands').select('*', { count: 'exact', head: true })
  const { count: retailersCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'retailer')
  const { data: warehousesData } = await supabase.from('warehouses').select('capacity_tonnes')
  
  const totalCapacityTonnes = warehousesData ? warehousesData.reduce((acc, wh) => acc + wh.capacity_tonnes, 0) : 0

  const stats = [
    {
      title: "Active Brands",
      value: `${brandsCount || 0}+`,
      subtitle: "Verified wholesale partners",
      icon: Building2,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Warehouse Capacity",
      value: `${(totalCapacityTonnes / 1000).toFixed(1)}k Tonnes`,
      subtitle: "Available storage space",
      icon: Warehouse,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Trusted Retailers",
      value: `${retailersCount || 0}+`,
      subtitle: "Active B2B connections",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Cities Serviced",
      value: "150+",
      subtitle: "Pan-India delivery network",
      icon: MapPin,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Upcoming Stock",
      value: "45 New Brands",
      subtitle: "Arriving this month",
      icon: PackageCheck,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Daily Transactions",
      value: "₹2.5Cr+",
      subtitle: "Average wholesale volume",
      icon: TrendingUp,
      color: "bg-yellow-100 text-yellow-600",
    },
  ]

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Greeting */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, <span className="text-orange-600 capitalize">{userName}</span>! 👋
        </h1>
        <p className="text-gray-500 text-lg">Here's what's happening in your wholesale network today.</p>
      </div>

      {/* User Personal Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/10 rounded-lg"><PackageCheck className="w-5 h-5 text-white" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{totalOrders}</h3>
              <p className="text-gray-400 text-sm font-medium">Total Orders Placed</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-600 to-orange-500 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-lg"><Package className="w-5 h-5 text-white" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{totalBags} <span className="text-xl opacity-80">Bags</span></h3>
              <p className="text-orange-100 text-sm font-medium">Total Quantity Ordered</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-lg"><Warehouse className="w-5 h-5 text-white" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{totalWeight.toLocaleString()} <span className="text-xl opacity-80">kg</span></h3>
              <p className="text-blue-100 text-sm font-medium">Total Weight Sourced</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Overview</h2>
        <p className="text-gray-500 mb-6">Real-time statistics of the ThokWale B2B network.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Promotional Banner */}
      <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl mb-8 md:mb-0">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
            Network Expansion
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Connect directly with verified farmers & brands
          </h2>
          <p className="text-orange-100 text-lg mb-6">
            ThokWale provides an end-to-end B2B procurement platform. Find better margins, transparent pricing, and robust logistics all in one place.
          </p>
          <a href="/dashboard/products/1" className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-gray-50 transition-colors">
            View Featured Product
          </a>
        </div>
      </div>
    </div>
  )
}
