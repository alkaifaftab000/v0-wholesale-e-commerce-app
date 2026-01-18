import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { PRODUCTS, getUniqueBrands } from "@/lib/data/products"
import type { ProductCategory } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = (await params).slug as ProductCategory

  const categoryProducts = PRODUCTS.filter((p) => p.category === slug)
  if (categoryProducts.length === 0 && !["grains", "pulses", "rice", "flours"].includes(slug)) {
    notFound()
  }

  const brands = getUniqueBrands(slug)

  return (
    <div className="min-h-screen bg-[#FDF8F6]">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-[#2D1B14] capitalize">{slug} Brands</h2>
            <p className="text-[#8C786F] mt-1">Browse premium {slug} from trusted brands and companies</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => {
              const brandProducts = categoryProducts.filter((p) => p.brand === brand)
              // Find a product with this brand to get the logo
              const brandLogo = brandProducts.find((p) => p.brandImage)?.brandImage

              return (
                <Link key={brand} href={`/category/${slug}/brand/${encodeURIComponent(brand)}`}>
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="relative aspect-video">
                      <Image
                        src={brandLogo || "/placeholder.svg"}
                        alt={brand}
                        fill
                        className="object-contain p-4 bg-white"
                      />
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-bold text-lg text-[#2D1B14]">{brand}</h3>
                      <p className="text-sm text-[#8C786F]">
                        {brandProducts.length} {brandProducts.length === 1 ? "product" : "products"} available
                      </p>
                      <div className="flex items-center text-sm font-semibold text-[#6F4E37] group-hover:text-[#8C5C3C]">
                        View Products <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
