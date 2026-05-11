import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Building2, Users, FileText, Package, Warehouse, LogOut, LayoutDashboard } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect("/admin/login")
  }

  // NOTE: For a real production app, verify the user role here:
  // if (data.user.user_metadata?.role !== 'admin') redirect("/")
  
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
    { label: "Verifications", href: "/admin/verifications", icon: FileText },
    { label: "Warehouses", href: "/admin/warehouses", icon: Warehouse },
    { label: "Catalog Manager", href: "/admin/catalog", icon: Package },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-gray-800">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">ThokWale Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
