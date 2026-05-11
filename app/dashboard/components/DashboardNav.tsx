"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Tags, Search, User, MapPin, Award, ShoppingCart, Star, Lock, PackageCheck } from "lucide-react"

export function DashboardNav({ isRetailer }: { isRetailer: boolean }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/brands", label: "Brands", icon: Tags },
    { href: "/dashboard/categories", label: "Categories", icon: Package },
    { href: "/dashboard/search", label: "Search", icon: Search },
    { href: "/dashboard/journey", label: "Journey", icon: MapPin },
    { href: "/dashboard/loyalty", label: "Loyalty", icon: Award },
    
    // Retailer only tabs
    { href: isRetailer ? "/dashboard/orders" : "/dashboard/journey", label: "Orders", icon: PackageCheck, gated: true },
    { href: isRetailer ? "/dashboard/addresses" : "/dashboard/journey", label: "Addresses", icon: MapPin, gated: true },
    { href: isRetailer ? "/dashboard/cart" : "/dashboard/journey", label: "Cart", icon: ShoppingCart, gated: true },
    { href: "/dashboard/retailer-benefits", label: "Benefits", icon: Star },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 bg-white border-r shadow-sm z-40 pt-16">
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard")
            const isLocked = item.gated && !isRetailer
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive && !isLocked
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : isLocked 
                      ? "text-gray-400 hover:bg-gray-50 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive && !isLocked ? "text-orange-600" : "text-gray-400"}`} />
                  {item.label}
                </div>
                {isLocked && <Lock className="w-4 h-4 text-gray-300" />}
              </Link>
            )
          })}
        </div>
        
        {/* Profile Link at Bottom */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === "/dashboard/profile"
                ? "bg-orange-50 text-orange-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <User className={`h-5 w-5 ${pathname === "/dashboard/profile" ? "text-orange-600" : "text-gray-400"}`} />
            Profile
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 px-2 pb-safe pt-2">
        <div className="flex items-center justify-around overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard")
            const isLocked = item.gated && !isRetailer
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive && !isLocked ? "text-orange-600" : isLocked ? "text-gray-300" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <div className="relative">
                  <item.icon className={`h-6 w-6 mb-1 ${isActive && !isLocked ? "fill-orange-100" : ""}`} />
                  {isLocked && <div className="absolute -top-1 -right-1 bg-white rounded-full"><Lock className="w-3 h-3 text-gray-400" /></div>}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
