import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { PRODUCTS, getUniqueBrands, getUniqueSubcategories } from "@/lib/products"
import type { ProductCategory } from "@/lib/types"
import { ProductCard } from "@/components/catalog/product-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { FilterSidebar } from "@/components/catalog/filter-sidebar"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = (await params).slug as ProductCategory
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  if (profile?.registration_status !== "verified") redirect("/onboarding")

  const categoryProducts = PRODUCTS.filter((p) => p.category === slug)
  if (categoryProducts.length === 0 && !["grains", "pulses", "rice", "flour"].includes(slug)) {
    notFound()
  }

  const brands = getUniqueBrands(slug)
  const subcategories = getUniqueSubcategories(slug)

  return (
    <div className="flex min-h-screen bg-[#FDF8F6]">
      <Sidebar activeItem="inventory" />

      <main className="flex-1 flex flex-col">
        <DashboardHeader profile={profile} />

        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden md:block w-64 shrink-0 space-y-6">
              <FilterSidebar category={slug} brands={brands} subcategories={subcategories} />
            </aside>

            {/* Product Grid */}
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-[#2D1B14] capitalize">{slug}</h2>
                  <p className="text-[#8C786F]">Browse our premium {slug} collection</p>
                </div>
                <div className="text-sm font-medium text-[#8C786F]">
                  Showing <span className="text-[#2D1B14]">{categoryProducts.length}</span> products
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} userId={user.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
