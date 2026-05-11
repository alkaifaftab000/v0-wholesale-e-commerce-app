"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PackageSearch, Clock, PackageCheck, MapPin, Truck } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadOrders() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (data) {
          setOrders(data)
        }
      }
      setLoading(false)
    }
    loadOrders()
  }, [supabase])

  if (loading) return <div className="p-10 text-center">Loading orders...</div>

  if (orders.length === 0) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto text-center space-y-6 mt-12">
        <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageSearch className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">No Orders Yet</h1>
        <p className="text-gray-500">You haven't placed any wholesale orders.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-500 text-lg">Track your bulk orders and recent invoices.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const date = new Date(order.created_at).toLocaleDateString("en-IN", { 
            day: 'numeric', month: 'short', year: 'numeric' 
          })
          
          return (
            <Card key={order.id} className="border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 border-b border-gray-100 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order ID: {order.id.split('-')[0]}</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" /> Placed on {date}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                    <PackageCheck className="w-3 h-3" /> {order.status}
                  </span>
                  <p className="text-sm font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Items List */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-start text-sm">
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-gray-500">{item.brand}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium text-gray-900">{item.quantityKg} kg</p>
                            <p className="text-gray-500 text-xs">@ ₹{item.pricePerKg}/kg</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Payment Info */}
                  <div className="space-y-4 md:border-l border-gray-100 md:pl-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400"/> Delivery Location
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">{order.delivery_address.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.delivery_address.address}</p>
                      <p className="text-xs text-gray-500">PIN: {order.delivery_address.pincode}</p>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-gray-400"/> Order Details
                      </h4>
                      <p className="text-xs text-gray-600">Total Weight: <span className="font-medium">{order.total_weight_kg} kg</span></p>
                      <p className="text-xs text-gray-600 uppercase mt-1">Payment: <span className="font-medium">{order.payment_method}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
