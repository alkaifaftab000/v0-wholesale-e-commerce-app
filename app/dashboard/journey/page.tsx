"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, ShieldCheck, MapPin, Clock, Award, CheckCircle2, Store, Camera, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import Image from "next/image"
import confetti from "canvas-confetti"

const retailerSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  location: z.string().min(5, "Please enter full address"),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST Number format"),
  category: z.string().min(2, "Please specify primary category"),
})

type RetailerFormValues = z.infer<typeof retailerSchema>

export default function JourneyPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shopPhoto, setShopPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<RetailerFormValues>({
    resolver: zodResolver(retailerSchema)
  })

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [supabase])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be less than 5MB")
        return
      }
      setShopPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }

  const onSubmitRetailer = async (data: RetailerFormValues) => {
    setIsSubmitting(true)
    try {
      if (!shopPhoto) {
        throw new Error("Please upload a photo of your shop front for verification.")
      }

      toast.info("Uploading documents...")
      const fileExt = shopPhoto.name.split('.').pop()
      const fileName = `shop_${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('retailer_documents')
        .upload(filePath, shopPhoto)

      if (uploadError) {
        throw new Error("Failed to upload image. Did you create the public 'retailer_documents' bucket?")
      }

      const { data: { publicUrl } } = supabase.storage
        .from('retailer_documents')
        .getPublicUrl(filePath)

      toast.info("Submitting application...")
      const { error } = await supabase.auth.updateUser({
        data: {
          role: "pending_retailer",
          business_name: data.businessName,
          location: data.location,
          gst_number: data.gstNumber,
          primary_category: data.category,
          shop_photo_url: publicUrl
        }
      })

      if (error) throw error

      // Also create record in user_profiles
      const { error: profileError } = await supabase.from('user_profiles').upsert({
        id: user.id,
        business_name: data.businessName,
        gst_number: data.gstNumber,
        role: "pending_retailer",
        loyalty_points: 0
      })

      if (profileError) {
        console.error("Profile creation failed", profileError)
      }

      triggerConfetti()
      toast.success("Application Submitted! It takes 1-2 weeks for verification.", { duration: 5000 })
      
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      setUser(updatedUser)
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Journey...</div>
  if (!user) return null

  const role = user.user_metadata?.role || "basic"
  const isRetailer = role === "retailer"
  const isPending = role === "pending_retailer"

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Wholesale Journey</h1>
        <p className="text-gray-500 text-lg">Track your account progression to unlock better tiers and wholesale pricing.</p>
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 md:p-10 text-white">
          <h3 className="text-2xl font-bold flex items-center gap-3 mb-2"><MapPin className="w-8 h-8 text-orange-500"/> Account Status Timeline</h3>
          <p className="text-gray-300 max-w-2xl">Your journey from a basic browser to a loyal wholesale partner. Each tier unlocks new benefits, exclusive pricing, and priority support.</p>
        </div>
        <CardContent className="p-6 md:p-10 bg-gray-50/50">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-10 left-10 right-10 h-1.5 bg-gray-200 rounded-full z-0 hidden md:block"></div>
            <div className="absolute top-10 left-10 h-1.5 bg-orange-500 rounded-full z-0 hidden md:block transition-all duration-1000" style={{ width: isRetailer ? '100%' : isPending ? '50%' : '0%' }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mb-4 shadow-lg ring-8 ring-white">
                  <User className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Basic User</h4>
                <p className="text-sm text-gray-500 mt-2">Can browse catalog and view standard MRP pricing.</p>
              </div>
              
              {/* Step 2 */}
              <div className={`flex flex-col items-center text-center ${isPending || isRetailer ? '' : 'opacity-40 grayscale'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold mb-4 shadow-lg ring-8 ring-white ${isPending || isRetailer ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <Clock className="w-8 h-8" />
                </div>
                <h4 className={`font-bold text-lg ${isPending ? 'text-blue-600' : 'text-gray-900'}`}>Request Submitted</h4>
                <p className="text-sm text-gray-500 mt-2">Under verification (1-2 weeks). We are verifying your GST and location.</p>
              </div>

              {/* Step 3 */}
              <div className={`flex flex-col items-center text-center ${isRetailer ? '' : 'opacity-40 grayscale'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold mb-4 shadow-lg ring-8 ring-white ${isRetailer ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className={`font-bold text-lg ${isRetailer ? 'text-green-600' : 'text-gray-900'}`}>Verified Retailer</h4>
                <p className="text-sm text-gray-500 mt-2">Unlocked B2B pricing, cart access, and bulk ordering.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center opacity-40 grayscale">
                <div className="w-20 h-20 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold mb-4 shadow-lg ring-8 ring-white">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Loyal Partner</h4>
                <p className="text-sm text-gray-500 mt-2">&gt; 200kg ordered/month. Unlocks priority delivery.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <Card className="border-blue-200 bg-blue-50/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Clock className="w-64 h-64 text-blue-900" />
          </div>
          <CardContent className="p-10 text-center relative z-10 space-y-4">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Application Under Review</h2>
            <p className="text-gray-600 text-lg max-w-lg mx-auto">
              Thank you for submitting your business details. Our team is currently verifying your GST number and shop location. 
            </p>
            <div className="bg-white rounded-xl p-4 inline-block shadow-sm border border-blue-100 mt-4">
              <p className="text-blue-800 font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" /> Expected verification time: 1-2 weeks
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isRetailer && (
        <Card className="border-green-200 bg-green-50/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Store className="w-64 h-64 text-green-900" />
          </div>
          <CardContent className="p-10 text-center relative z-10 space-y-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">You are a Verified Retailer!</h2>
            <p className="text-gray-600 text-lg max-w-lg mx-auto">
              Your business has been verified. You now have full access to wholesale pricing, bulk ordering capabilities, and our entire catalog.
            </p>
          </CardContent>
        </Card>
      )}

      {!isRetailer && !isPending && (
        <Card className="border-orange-200 shadow-md relative overflow-hidden mt-8">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Store className="w-64 h-64" />
          </div>
          <CardHeader className="relative z-10 pb-4">
            <CardTitle className="text-2xl text-gray-900">Become a Verified Retailer</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Upgrade your account to unlock wholesale pricing, add products to cart, and earn loyalty points on every purchase.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit(onSubmitRetailer)} className="space-y-6 max-w-3xl">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business/Shop Name *</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" {...register("businessName")} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Maa Kirana Store" />
                  </div>
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address/Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea {...register("location")} rows={3} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none ${errors.location ? 'border-red-500' : 'border-gray-300'}`} placeholder="Shop 12, Main Market, City..." />
                  </div>
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" {...register("gstNumber")} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none uppercase ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="22AAAAA0000A1Z5" />
                    </div>
                    {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Product Category *</label>
                    <select {...register("category")} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                      <option value="">Select Category</option>
                      <option value="Grains & Pulses">Grains & Pulses</option>
                      <option value="FMCG">FMCG & Packaged Goods</option>
                      <option value="Spices">Spices & Condiments</option>
                      <option value="All">All Categories</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Front Photo *</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                  />
                  
                  {!photoPreview ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${!shopPhoto && isSubmitting ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-700">Click to upload shop photo</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative w-full max-w-sm h-56 rounded-xl overflow-hidden border border-gray-200 group">
                      <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button type="button" variant="secondary" onClick={() => { setShopPhoto(null); setPhotoPreview(null); }}>
                          Remove Photo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 rounded-xl font-bold text-lg shadow-lg">
                {isSubmitting ? "Uploading & Submitting..." : "Apply for Retailer Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
