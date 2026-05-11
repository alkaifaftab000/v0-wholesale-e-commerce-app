import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Package, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch Admin Aggregates
  const { count: usersCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true })
  const { count: pendingCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'pending_retailer')
  const { count: retailersCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'retailer')
  
  const { data: orders } = await supabase.from('orders').select('total_price')
  const totalGMV = orders ? orders.reduce((acc, order) => acc + (order.total_price || 0), 0) : 0

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h1>
        <p className="text-gray-500">Real-time statistics across the entire ThokWale network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{usersCount || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
              <h3 className="text-2xl font-bold text-gray-900">{pendingCount || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Verified Retailers</p>
              <h3 className="text-2xl font-bold text-gray-900">{retailersCount || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total GMV</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalGMV.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mt-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to the Admin Portal</h2>
          <p className="text-gray-500 mb-6">Use the sidebar to manage users, approve incoming retailer verification requests, configure warehouse capacities, and upload new brands and categories directly to the database.</p>
        </div>
      </div>
    </div>
  )
}
