"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail, Edit, History, X } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function AdminUsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [viewingOrdersUser, setViewingOrdersUser] = useState<any>(null)
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const supabase = createClient()

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    
    try {
      // Use the API route to update user role securely
      const res = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editingUser.id, role: editingUser.role })
      })

      if (!res.ok) throw new Error("Failed to update role")
      
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: editingUser.role } : u))
      toast.success(`Role updated to ${editingUser.role}!`)
      setEditingUser(null)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleViewOrders = async (user: any) => {
    setViewingOrdersUser(user)
    setLoadingOrders(true)
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (error) throw error
      setUserOrders(data || [])
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoadingOrders(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Business</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Joined</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-700 text-sm font-medium">
                  {user.businessName}
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={
                    user.role === 'retailer' ? 'bg-green-50 text-green-700 border-green-200' :
                    user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    user.role === 'pending_retailer' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }>
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {user.createdAt}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleViewOrders(user)}
                      className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                      title="View Orders"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit Role"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-10 text-center text-gray-500">No users found.</div>}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit User Role</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleUpdateRole}>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">User: <span className="font-bold text-gray-900">{editingUser.email}</span></p>
                <label className="block text-sm font-semibold mb-2">Select Role</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-orange-500"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="basic">Basic</option>
                  <option value="pending_retailer">Pending Retailer</option>
                  <option value="retailer">Retailer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" disabled={isUpdating} className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">
                {isUpdating ? "Saving..." : "Save Role"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Orders Modal */}
      {viewingOrdersUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold">Order History</h3>
                <p className="text-sm text-gray-500">{viewingOrdersUser.name} ({viewingOrdersUser.email})</p>
              </div>
              <button onClick={() => setViewingOrdersUser(null)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6"/></button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2">
              {loadingOrders ? (
                <p className="text-center py-10 text-gray-500">Loading orders...</p>
              ) : userOrders.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No orders found for this user.</p>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50">
                      <div>
                        <p className="font-bold text-gray-900">Order #{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-gray-900">₹{order.total_price.toLocaleString()}</p>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-none mt-1">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
