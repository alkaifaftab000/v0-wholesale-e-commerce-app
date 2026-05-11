"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function BrandsDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadBrands() {
      const { data, error } = await supabase.from('brands').select('*')
      if (data) setBrands(data)
      setLoading(false)
    }
    loadBrands()
  }, [supabase])

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <div className="p-10 text-center">Loading Brands...</div>

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Brands Directory</h1>
          <p className="text-gray-500 text-lg">Explore our verified wholesale partners.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search brands..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>
      </div>

      {filteredBrands.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No brands found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBrands.map((brand, idx) => {
            const brandName = brand.name
            const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
            
            return (
              <Link 
                key={idx} 
                href={`/dashboard/brands/${brandSlug}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col items-center p-6"
              >
                <div className="relative w-full h-24 mb-4">
                  <Image 
                    src={brand.logo_url || "https://via.placeholder.com/150"} 
                    alt={brandName} 
                    fill 
                    className="object-contain mix-blend-multiply transition-transform group-hover:scale-105" 
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-center text-sm">{brandName}</h3>
                <span className="text-xs text-orange-600 font-medium mt-2 bg-orange-50 px-2 py-1 rounded-full">
                  View Catalog
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
