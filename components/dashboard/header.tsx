"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Search, ShoppingCart, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getCartItemCount } from "@/lib/cart-utils"

interface HeaderProps {
  profile: any
}

export function DashboardHeader({ profile }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (profile?.id) {
      setCartCount(getCartItemCount(profile.id))

      // Listen for cart updates
      const handleStorage = () => setCartCount(getCartItemCount(profile.id))
      window.addEventListener("storage", handleStorage)
      return () => window.removeEventListener("storage", handleStorage)
    }
  }, [profile?.id])

  return (
    <header className="h-20 border-b bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 md:px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for brands or products..."
          className="pl-10 border-none bg-[#FDF8F6] focus-visible:ring-1 focus-visible:ring-[#6F4E37]/20 rounded-xl h-10"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl text-[#8C786F] hover:bg-[#FDF8F6]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <Link href="/cart">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl text-[#8C786F] hover:bg-[#FDF8F6]"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#6F4E37] text-white text-[10px] border-2 border-white rounded-full">
                {cartCount}
              </Badge>
            )}
          </Button>
        </Link>

        <div className="h-10 w-[1px] bg-[#E5D5D0] mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#2D1B14]">{profile?.business_name}</p>
            <p className="text-[10px] font-medium text-green-600 uppercase tracking-tighter">Verified Partner</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#6F4E37] flex items-center justify-center text-white font-bold shadow-lg shadow-[#6F4E37]/20">
            {profile?.business_name?.charAt(0) || <User className="h-5 w-5" />}
          </div>
        </div>
      </div>
    </header>
  )
}
