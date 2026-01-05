import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.registration_status !== "verified") {
    redirect("/onboarding")
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r bg-background hidden md:flex flex-col p-6">
        <h1 className="text-xl font-bold text-primary mb-8">GrainEx</h1>
        <nav className="space-y-2 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-md font-medium"
          >
            <Package className="h-4 w-4" /> Inventory
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted rounded-md">
            <ShoppingCart className="h-4 w-4" /> Orders
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted rounded-md">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </nav>
        <div className="pt-4 border-t">
          <Link
            href="/auth/login"
            className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted rounded-md"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Wholesale Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {profile.business_name}</p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
            Verified Business
          </Badge>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Grains</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5 Tons</div>
              <p className="text-xs text-muted-foreground">+2% from last week</p>
            </CardContent>
          </Card>
          {/* Add more metric cards as needed */}
        </div>

        <div className="bg-background rounded-xl border shadow-sm p-6 text-center py-20">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Ready to Order?</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Your business is verified. You now have full access to our premium inventory and wholesale pricing.
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90">
            Browse Full Catalog
          </button>
        </div>
      </main>
    </div>
  )
}
