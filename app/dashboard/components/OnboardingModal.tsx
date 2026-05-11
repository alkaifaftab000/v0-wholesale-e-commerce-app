"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { User, Phone, Calendar, Store } from "lucide-react"

const onboardingSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select a gender"),
  businessType: z.string().min(1, "Please select a business type"),
})

type OnboardingValues = z.infer<typeof onboardingSchema>

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema)
  })

  useEffect(() => {
    async function checkOnboardingStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // If they are missing key demographic data (usually missing if registered via Google without our form)
        if (!user.user_metadata?.phone || !user.user_metadata?.business_type) {
          setIsOpen(true)
        }
      }
      setLoading(false)
    }
    checkOnboardingStatus()
  }, [supabase])

  const onSubmit = async (data: OnboardingValues) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: data.username,
          phone: data.phone,
          dob: data.dob,
          gender: data.gender,
          business_type: data.businessType,
        }
      })
      
      if (error) throw error
      
      toast.success("Profile completed successfully!")
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Welcome to ThokWale! To give you the best wholesale experience, we need a few more details about your business.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Preferred Username *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" {...register("username")} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Username" />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="tel" {...register("phone")} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="10-digit number" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Date of Birth *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="date" {...register("dob")} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none" />
              </div>
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Gender *</label>
              <select {...register("gender")} className="w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none bg-white">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Business Type *</label>
              <div className="relative">
                <Store className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select {...register("businessType")} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none bg-white">
                  <option value="">Select Type</option>
                  <option value="Retailer">Retailer (Kirana)</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="HoReCa">HoReCa (Hotel/Restaurant/Cafe)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType.message}</p>}
            </div>
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700">
            {isSubmitting ? "Saving..." : "Complete Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
