import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "./components/DashboardNav"
import { TopBar } from "./components/TopBar"
import { OnboardingModal } from "./components/OnboardingModal"
import { CartProvider } from "./components/CartProvider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const userEmail = data.user.email || ""
  const isRetailer = data.user.user_metadata?.role === "retailer"
  const userName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || ""
  const userAvatar = data.user.user_metadata?.avatar_url || ""

  // Fetch Loyalty Points
  let loyaltyPoints = 0
  const { data: profile } = await supabase.from('user_profiles').select('loyalty_points').eq('id', data.user.id).single()
  if (profile && profile.loyalty_points) {
    loyaltyPoints = profile.loyalty_points
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <TopBar userEmail={userEmail} isRetailer={isRetailer} userName={userName} userAvatar={userAvatar} loyaltyPoints={loyaltyPoints} />
        
        <DashboardNav isRetailer={isRetailer} />

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 pt-16 pb-20 md:pb-0 min-h-screen">
          <div className="h-full">
            {children}
          </div>
        </main>

        <OnboardingModal />
      </div>
    </CartProvider>
  )
}
