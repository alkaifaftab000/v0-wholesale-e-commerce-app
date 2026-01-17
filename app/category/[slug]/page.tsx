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
  const brandLogos: Record<string, string> = {
    "Sujata Gold": "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    "Tata Sampan": "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    Galaxy: "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    Rishta: "https://images.unsplash.com/photo-1574080240211-0a8860c301fa?w=200&h=200&fit=crop",
    Aashirwad: "https://images.unsplash.com/photo-1574080240211-0a8860c301fa?w=200&h=200&fit=crop",
    Fortune: "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    Kohinoor: "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    Rajdhani: "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    Panshree: "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    Tanatan: "https://images.unsplash.com/photo-1574080240211-0a8860c301fa?w=200&h=200&fit=crop",
    Murliwala: "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    Ashok: "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    Manik: "https://images.unsplash.com/photo-1574080240211-0a8860c301fa?w=200&h=200&fit=crop",
    DC: "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    "Sher Khan": "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    "Laxmi Rice": "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    Scooter: "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    Jannat: "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    Palki: "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    "Mangat Ram": "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    KRML: "https://images.unsplash.com/photo-1574080240211-0a8860c301fa?w=200&h=200&fit=crop",
    Shiva: "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=200&h=200&fit=crop",
    "Munna Bhaiya": "https://images.unsplash.com/photo-1586985289688-cacf313cc330?w=200&h=200&fit=crop",
    "Sarbati Moti": "https://images.unsplash.com/photo-1574080240211-0a8860c301fa?w=200&h=200&fit=crop",
  }

  return (
    <div className="min-h-screen bg-[#FDF8F6]">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-[#2D1B14] capitalize">{slug} Suppliers</h2>
            <p className="text-[#8C786F] mt-1">Browse premium {slug} from trusted brands and companies</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => {
              const brandProducts = categoryProducts.filter((p) => p.brand === brand)
              return (
                <Link key={brand} href={`/category/${slug}/brand/${encodeURIComponent(brand)}`}>
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <Image
                      src={
                        brandLogos[brand] ||
                        "https://images.unsplash.com/photo-1585518419759-47a49bda6b57?w=400&h=300&fit=crop"
                      }
                      alt={brand}
                      width={400}
                      height={300}
                      className="aspect-video object-cover bg-gradient-to-br from-[#F5E6D3] to-[#E8D5C4]"
                    />
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
