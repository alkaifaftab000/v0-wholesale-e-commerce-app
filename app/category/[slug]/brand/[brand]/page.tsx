import { notFound } from "next/navigation"
import Link from "next/link"
import { PRODUCTS } from "@/lib/data/products"
import type { ProductCategory } from "@/lib/types"
import { ProductCard } from "@/components/catalog/product-card"
import { GUEST_ID } from "@/lib/cart-utils"
import { ChevronLeft } from "lucide-react"

interface BrandPageProps {
  params: Promise<{ slug: string; brand: string }>
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug, brand } = await params
  const decodedBrand = decodeURIComponent(brand as string)
  const categorySlug = slug as ProductCategory

  const brandProducts = PRODUCTS.filter((p) => p.category === categorySlug && p.brand === decodedBrand)

  if (brandProducts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FDF8F6]">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center text-sm font-medium text-[#6F4E37] hover:text-[#8C5C3C] transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to {categorySlug}
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-[#2D1B14]">{decodedBrand}</h2>
            <p className="text-[#8C786F] mt-1 capitalize">
              {brandProducts.length} {categorySlug} products from {decodedBrand}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brandProducts.map((product) => (
              <ProductCard key={product.id} product={product} userId={GUEST_ID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
