import { createClient } from "@/lib/supabase/server"
import { Package, ShieldCheck, Truck, Star, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function BrandDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const isRetailer = data?.user?.user_metadata?.role === "retailer"

  const { id } = await params;

  // Formatting slug to Title Case for Display
  const brandName = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const { data: brand } = await supabase.from('brands').select('*').ilike('name', brandName).single()
  
  let products: any[] = []
  if (brand) {
    const { data: fetchedProducts } = await supabase.from('products').select('*, categories(name)').eq('brand_id', brand.id)
    if (fetchedProducts) products = fetchedProducts
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Brand Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-2xl bg-gray-50 border flex items-center justify-center p-4">
          <div className="text-4xl font-bold text-gray-300">LOGO</div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{brandName}</h1>
            <ShieldCheck className="text-blue-500 w-6 h-6" />
          </div>
          <p className="text-gray-500 text-lg mb-4">Official Wholesale Distributor Catalog</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <span className="flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Authentic
            </span>
            <span className="flex items-center gap-1 text-sm bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-medium">
              <Truck className="w-4 h-4" /> Dispatches in 24hrs
            </span>
          </div>
        </div>
      </div>

      {/* Product List */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Wholesale Catalog</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No products available from this brand yet.</p>
          </div>
        ) : products.map((product) => {
          const inStock = product.stock_kg > 0
          const pricePerBag = `₹${(product.price_per_kg * product.bag_weight_kg).toLocaleString()}`
          
          return (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-shadow">
            <div className="relative h-64 w-full bg-gray-100">
              <Image src={product.image_url || "/placeholder.jpg"} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              {!inStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-orange-600 tracking-wider uppercase">{product.categories?.name || "Uncategorized"}</span>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.8 (124)
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{product.name}</h3>
              
              <div className="mt-auto space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 text-sm">Wholesale Price</span>
                    <span className="text-2xl font-bold text-gray-900">{pricePerBag}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Per Bag Weight:</span>
                    <span className="font-semibold text-gray-900">{product.bag_weight_kg}kg</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1 pt-1 border-t border-gray-200">
                    <span className="text-gray-500">Min. Order Qty:</span>
                    <span className="font-semibold text-orange-600">{product.min_order_bags} Bags</span>
                  </div>
                </div>

                {isRetailer ? (
                  <Link href={`/dashboard/products/${product.id}`}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={!inStock}>
                      <Package className="w-4 h-4 mr-2" />
                      {inStock ? "View Details" : "Currently Unavailable"}
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-gray-50 text-gray-400 cursor-not-allowed border-dashed">
                      Locked for Basic Users
                    </Button>
                    <Link href="/dashboard/profile" className="flex items-center justify-center gap-1 text-xs text-orange-600 hover:underline font-medium">
                      <Info className="w-3 h-3" /> Upgrade to Retailer to Buy
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
