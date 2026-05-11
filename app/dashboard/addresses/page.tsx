"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Trash2, CheckCircle2, Home } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const addressSchema = z.object({
  label: z.string().min(2, "Label required (e.g., Main Shop)"),
  address: z.string().min(10, "Please enter full address"),
  pincode: z.string().regex(/^\d{6}$/, "Must be 6 digit pincode"),
})

type AddressFormValues = z.infer<typeof addressSchema>

type SavedAddress = {
  id: string;
  label: string;
  address: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const supabase = createClient()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema)
  })

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Load from Supabase
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (data && data.length > 0) {
          // Map snake_case to camelCase
          setAddresses(data.map(d => ({
            id: d.id,
            label: d.label,
            address: d.address,
            pincode: d.pincode,
            isDefault: d.is_default
          })))
        } else if (user?.user_metadata?.location) {
          // Auto-seed with registration address to DB
          const newAddr = {
            user_id: user.id,
            label: 'Primary Shop',
            address: user.user_metadata.location,
            pincode: '000000', // Mock
            is_default: true
          }
          const { data: inserted, error: insertError } = await supabase.from('user_addresses').insert(newAddr).select().single()
          if (inserted) {
            setAddresses([{
              id: inserted.id,
              label: inserted.label,
              address: inserted.address,
              pincode: inserted.pincode,
              isDefault: inserted.is_default
            }])
          }
        }
      }
      setIsLoaded(true)
    }
    loadData()
  }, [supabase])

  const onAddAddress = async (data: AddressFormValues) => {
    if (!user) return

    const newAddr = {
      user_id: user.id,
      label: data.label,
      address: data.address,
      pincode: data.pincode,
      is_default: addresses.length === 0
    }

    const { data: inserted, error } = await supabase.from('user_addresses').insert(newAddr).select().single()
    
    if (error) {
      toast.error("Failed to save address")
      return
    }

    setAddresses([...addresses, {
      id: inserted.id,
      label: inserted.label,
      address: inserted.address,
      pincode: inserted.pincode,
      isDefault: inserted.is_default
    }])
    toast.success("New address saved!")
    setIsModalOpen(false)
    reset()
  }

  const setDefault = async (id: string) => {
    if (!user) return
    
    // Set all to false
    await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id)
    // Set target to true
    await supabase.from('user_addresses').update({ is_default: true }).eq('id', id)

    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
    toast.success("Default delivery address updated")
  }

  const deleteAddress = async (id: string) => {
    const addrToDelete = addresses.find(a => a.id === id)
    if (addrToDelete?.isDefault && addresses.length > 1) {
      toast.error("Cannot delete default address. Please set another as default first.")
      return
    }

    await supabase.from('user_addresses').delete().eq('id', id)
    setAddresses(addresses.filter(addr => addr.id !== id))
    toast.info("Address removed")
  }

  if (!isLoaded) return <div className="p-10 text-center text-gray-500">Loading Address Book...</div>

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
          <p className="text-gray-500 text-lg">Manage your shop locations and warehouses for bulk deliveries.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 shadow-md">
          <Plus className="w-5 h-5 mr-2" /> Add New Shop
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((addr) => (
          <Card key={addr.id} className={`relative overflow-hidden transition-all ${addr.isDefault ? 'border-orange-500 shadow-md ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
            {addr.isDefault && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Default
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Home className={`w-5 h-5 ${addr.isDefault ? 'text-orange-500' : 'text-gray-400'}`} /> 
                {addr.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm space-y-1 h-24">
              <p className="line-clamp-2">{addr.address}</p>
              <p className="font-medium text-gray-900 pt-2">Pincode: {addr.pincode}</p>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100 flex gap-2">
              {!addr.isDefault && (
                <Button variant="outline" size="sm" onClick={() => setDefault(addr.id)} className="flex-1">
                  Set Default
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-none px-3">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No saved addresses found.</p>
            <p className="text-sm text-gray-400 mb-4">Add your first shop location to enable delivery.</p>
            <Button onClick={() => setIsModalOpen(true)} variant="outline">
              Add Address
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Delivery Location</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddAddress)} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Location Label (e.g., Warehouse 2)</label>
              <input {...register("label")} className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Secondary Godown" />
              {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Full Address</label>
              <textarea {...register("address")} rows={3} className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none resize-none" placeholder="Plot No 45, Industrial Area..." />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Pincode</label>
              <input {...register("pincode")} className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="110001" maxLength={6} />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Save Address</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
