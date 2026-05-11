"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, LogOut, ShieldCheck, Camera, Save, X, Mail } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Form Fields
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editDob, setEditDob] = useState("")
  const [editGender, setEditGender] = useState("")
  const [editBusinessType, setEditBusinessType] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setEditName(user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.username || user.email?.split('@')[0] || "")
        setEditPhone(user.user_metadata?.phone || "")
        setEditDob(user.user_metadata?.dob || "")
        setEditGender(user.user_metadata?.gender || "")
        setEditBusinessType(user.user_metadata?.business_type || "")
      }
      setLoading(false)
    }
    loadUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    toast.success("Signed out successfully")
  }

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty")
      return
    }
    setIsUpdating(true)
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          full_name: editName,
          phone: editPhone,
          dob: editDob,
          gender: editGender,
          business_type: editBusinessType
        }
      })
      if (error) throw error
      setUser(data.user)
      setIsEditingProfile(false)
      toast.success("Profile details updated successfully!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File must be less than 2MB")
        return
      }

      toast.info("Uploading new profile picture...")
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `avatar_${Date.now()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        // Reusing retailer_documents for now, ideally 'avatars' bucket
        const { error: uploadError } = await supabase.storage
          .from('retailer_documents')
          .upload(filePath, file)

        if (uploadError) throw new Error("Failed to upload image.")

        const { data: { publicUrl } } = supabase.storage
          .from('retailer_documents')
          .getPublicUrl(filePath)

        const { data, error } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })

        if (error) throw error
        setUser(data.user)
        toast.success("Profile picture updated!")
      } catch(err: any) {
        toast.error(err.message)
      }
    }
  }

  const handleRequestEmailChange = () => {
    // In a real app, we would use prompt() or a modal to get the new email
    const newEmail = prompt("Enter your new email address:");
    if (newEmail && newEmail !== user.email) {
      toast.info(`Sending confirmation links... Please check BOTH ${user.email} and ${newEmail} to confirm this change.`)
      // supabase.auth.updateUser({ email: newEmail })
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>
  if (!user) return null

  const role = user.user_metadata?.role || "basic"
  const isRetailer = role === "retailer"
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.username || user.email?.split('@')[0] || "User"
  const userAvatar = user.user_metadata?.avatar_url || null

  const handleDevUpgrade = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { role: 'retailer', business_name: 'Dev Test Store', gst_number: '22AAAAA0000A1Z5', location: 'Dev City', shop_photo_url: 'https://via.placeholder.com/150' }
      })
      if (error) throw error;
      
      const { error: profileError } = await supabase.from('user_profiles').upsert({
        id: user.id,
        business_name: 'Dev Test Store',
        gst_number: '22AAAAA0000A1Z5',
        role: "retailer",
        loyalty_points: 0
      })
      if (profileError) throw profileError;

      toast.success("Dev: Forced upgraded to Retailer");
      window.location.reload();
    } catch(e: any) {
      toast.error(e.message);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 relative">
      {process.env.NODE_ENV === 'development' && (
        <Button onClick={handleDevUpgrade} size="sm" variant="destructive" className="absolute top-4 right-4 z-50">
          Dev: Force Retailer
        </Button>
      )}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Account Details</h1>
        <p className="text-gray-500 text-lg">Manage your personal and business demographic information.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Quick Actions */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-gray-100 shadow-sm overflow-hidden text-center">
            <CardContent className="pt-10 pb-6 px-6 flex flex-col items-center relative">
              <div className="w-32 h-32 bg-white rounded-full p-1 border-4 border-gray-100 shadow-sm overflow-hidden mb-4 relative group">
                {userAvatar ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image src={userAvatar} alt="Profile" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-5xl font-bold uppercase">
                    {userName.charAt(0)}
                  </div>
                )}
                
                {/* Overlay for avatar change */}
                <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-full">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">CHANGE</span>
                </div>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{userName}</h2>
              <div className="flex items-center gap-2 mt-1 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              
              {isRetailer && (
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200">
                  <ShieldCheck className="w-4 h-4" /> Verified Retailer
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Button onClick={handleSignOut} variant="outline" className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Editor */}
        <div className="md:col-span-8 space-y-6">
          <Card className="border-gray-100 shadow-sm relative">
            <CardHeader className="border-b border-gray-100 pb-4 mb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>Update your demographics and contact details.</CardDescription>
              </div>
              {!isEditingProfile ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleUpdateProfile} disabled={isUpdating} className="bg-orange-600 hover:bg-orange-700">
                    {isUpdating ? "Saving..." : <><Save className="w-4 h-4 mr-1"/> Save</>}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Full Name</label>
                  {isEditingProfile ? (
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                  ) : (
                    <p className="text-gray-900 font-medium py-2">{userName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block flex items-center justify-between">
                    Email Address
                    <button onClick={handleRequestEmailChange} className="text-orange-600 lowercase text-[10px] hover:underline">Change</button>
                  </label>
                  <p className="text-gray-900 font-medium py-2 bg-gray-50 px-3 rounded-lg border border-gray-100">{user.email}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Phone Number</label>
                  {isEditingProfile ? (
                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                  ) : (
                    <p className="text-gray-900 font-medium py-2">{user.user_metadata?.phone || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Date of Birth</label>
                  {isEditingProfile ? (
                    <input type="date" value={editDob} onChange={(e) => setEditDob(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                  ) : (
                    <p className="text-gray-900 font-medium py-2">{user.user_metadata?.dob || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Gender</label>
                  {isEditingProfile ? (
                    <select value={editGender} onChange={(e) => setEditGender(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium py-2">{user.user_metadata?.gender || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Business Type</label>
                  {isEditingProfile ? (
                    <select value={editBusinessType} onChange={(e) => setEditBusinessType(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white">
                      <option value="">Select Type</option>
                      <option value="Retailer">Retailer (Kirana)</option>
                      <option value="Wholesaler">Wholesaler</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Supermarket">Supermarket</option>
                      <option value="HoReCa">HoReCa</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium py-2">{user.user_metadata?.business_type || "Not provided"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
