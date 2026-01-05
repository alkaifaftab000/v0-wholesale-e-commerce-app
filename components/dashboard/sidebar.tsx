"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, ShoppingCart, Settings, LogOut, LayoutDashboard, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeItem?: "dashboard" | "inventory" | "orders" | "settings"
}

export function Sidebar({ activeItem = "dashboard" }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "inventory", label: "Catalog", icon: Package, href: "/dashboard" },
    { id: "orders", label: "My Orders", icon: ShoppingCart, href: "#" },
    { id: "settings", label: "Account", icon: Settings, href: "#" },
  ]

  const categories = [
    { label: "Grains", href: "/dashboard/category/grains" },
    { label: "Pulses", href: "/dashboard/category/pulses" },
    { label: "Rice", href: "/dashboard/category/rice" },
    { label: "Flour", href: "/dashboard/category/flour" },
  ]

  return (
    <aside className="w-64 border-r bg-white hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-extrabold text-[#6F4E37] leading-tight">
          Shyam Wholesale
          <br />
          <span className="text-muted-foreground font-medium text-sm">Solutions</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.id
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
                  isActive
                    ? "bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/20"
                    : "text-[#8C786F] hover:bg-[#FDF8F6] hover:text-[#6F4E37]",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="space-y-2">
          <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-[#8C786F]/60">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                  pathname === cat.href
                    ? "text-[#6F4E37] font-bold bg-[#6F4E37]/5"
                    : "text-[#8C786F] hover:text-[#6F4E37]",
                )}
              >
                {cat.label}
                <ChevronRight
                  className={cn("h-3 w-3 opacity-0 transition-opacity", pathname === cat.href && "opacity-100")}
                />
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-[#FDF8F6]">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#8C786F] hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Link>
      </div>
    </aside>
  )
}
