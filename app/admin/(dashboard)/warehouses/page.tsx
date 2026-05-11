"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Warehouse, MapPin, PackageCheck, User, TrendingUp, AlertTriangle } from "lucide-react"

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('warehouses').select('*').order('name')
      if (data) {
        setWarehouses(data)
        if (data.length > 0) setSelectedId(data[0].id)
      }
      setLoading(false)
    }
    loadData()
  }, [supabase])

  useEffect(() => {
    async function fetchOrders() {
      if (!selectedId) return
      const { data } = await supabase.from('orders').select('*').eq('warehouse_id', selectedId).order('created_at', { ascending: false }).limit(5)
      setRecentOrders(data || [])
    }
    fetchOrders()
  }, [supabase, selectedId])

  if (loading) return <div className="p-10 text-center">Loading Warehouses...</div>

  const selectedWarehouse = warehouses.find(w => w.id === selectedId)

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Logistics Hubs</h1>
        <p className="text-gray-500">Monitor storage capacities, inventory health, and active brands across all ThokWale warehouses.</p>
      </div>

      {/* Warehouse Selectors */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {warehouses.map((warehouse) => (
          <button
            key={warehouse.id}
            onClick={() => setSelectedId(warehouse.id)}
            className={`min-w-[250px] text-left p-6 rounded-2xl border transition-all ${
              selectedId === warehouse.id 
                ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20" 
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Warehouse className={`w-6 h-6 ${selectedId === warehouse.id ? 'text-orange-500' : 'text-gray-400'}`} />
              <h3 className="font-bold text-lg">{warehouse.name}</h3>
            </div>
            <p className={`text-sm flex items-center gap-1 ${selectedId === warehouse.id ? 'text-gray-400' : 'text-gray-500'}`}>
              <MapPin className="w-4 h-4" /> {warehouse.location}
            </p>
          </button>
        ))}
      </div>

      {/* Bento Grid for Selected Warehouse */}
      {selectedWarehouse && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Bento Box 1: Utilization */}
          <Card className="md:col-span-2 border-gray-100 shadow-sm bg-gradient-to-br from-white to-orange-50/30">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Capacity Utilization</h2>
                  <p className="text-gray-500">Current stock vs maximum designed capacity</p>
                </div>
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-black text-gray-900">
                      {(selectedWarehouse.current_stock_tonnes / 1000).toFixed(1)}k <span className="text-xl font-medium text-gray-500">/ {(selectedWarehouse.capacity_tonnes / 1000).toFixed(1)}k Tonnes</span>
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {Math.round((selectedWarehouse.current_stock_tonnes / selectedWarehouse.capacity_tonnes) * 100)}%
                  </span>
                </div>
                
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(selectedWarehouse.current_stock_tonnes / selectedWarehouse.capacity_tonnes) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bento Box 2: Manager */}
          <Card className="border-gray-100 shadow-sm bg-gray-900 text-white">
            <CardContent className="p-8 h-full flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-700">
                <User className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{selectedWarehouse.manager_name}</h3>
              <p className="text-gray-400 text-sm mb-4">Facility Manager</p>
              <button className="w-full py-2 bg-white text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                Contact Manager
              </button>
            </CardContent>
          </Card>

          {/* Bento Box 3: Active Brands */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Active Brands</h3>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-2">{selectedWarehouse.active_brands_count}</p>
              <p className="text-sm text-gray-500">Brands actively storing inventory at this location.</p>
            </CardContent>
          </Card>

          {/* Bento Box 4: Health Status */}
          <Card className="md:col-span-1 border-green-100 shadow-sm bg-green-50/50">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="p-4 bg-green-100 text-green-600 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Operational Status: Optimal</h3>
              <p className="text-green-700 text-sm">No maintenance required. Dispatch SLA is at 99.8%.</p>
            </CardContent>
          </Card>

          {/* Bento Box 5: Recent Dispatch Logs */}
          <Card className="md:col-span-3 border-gray-100 shadow-sm bg-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Dispatch Logs</h3>
                  <p className="text-gray-500 text-sm">Latest orders routed through this facility.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-400 italic py-4">No recent dispatches recorded.</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">Order #{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">{(order.total_weight_kg).toLocaleString()} kg</p>
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Dispatched</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  )
}
