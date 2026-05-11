"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, ShieldCheck, Award, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useCart } from "./CartProvider"

export function TopBar({ 
  userEmail, 
  isRetailer,
  userName,
  userAvatar,
  loyaltyPoints = 0
}: { 
  userEmail: string, 
  isRetailer: boolean,
  userName?: string,
  userAvatar?: string,
  loyaltyPoints?: number
}) {
  const { totalItems } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="md:w-64 flex-shrink-0 flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded overflow-hidden">
              <Image src="/app_logo.png" alt="ThokWale Logo" fill className="object-cover" />
            </div>
            <div className="relative w-28 h-6 hidden sm:block">
              <Image src="/signature.png" alt="ThokWale" fill className="object-contain" />
            </div>
            {/* Fallback text if signature image fails */}
            <span className="sm:hidden text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              ThokWale
            </span>
          </Link>
          
          {isRetailer && (
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 bg-[#eafff0] text-[#00a843] text-xs font-bold rounded-full border border-[#00a843]/20 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Retailer
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!isRetailer && (
          <Button asChild size="sm" className="hidden sm:flex bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg transition-all">
            <Link href="/dashboard/journey">Become a Retailer</Link>
          </Button>
        )}
        
        <Link href="/dashboard/loyalty" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#fff4ec] hover:bg-orange-100 text-orange-600 rounded-full border border-orange-200 transition-colors shadow-sm cursor-pointer">
          <Award className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold">{loyaltyPoints.toLocaleString()}</span>
          <span className="text-xs text-orange-600/80 font-medium hidden md:inline">Pts</span>
        </Link>

        <button 
          onClick={() => toast.info("No new notifications at this time.")}
          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {isRetailer && (
          <Link href="/dashboard/cart" className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {totalItems}
              </span>
            )}
          </Link>
        )}
        
        <Link href="/dashboard/profile" className="cursor-pointer group">
          {userAvatar ? (
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-orange-200 group-hover:border-orange-500 transition-colors">
              <Image src={userAvatar} alt="Profile" fill className="object-cover" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold border border-orange-200 group-hover:border-orange-500 transition-colors">
              {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}
