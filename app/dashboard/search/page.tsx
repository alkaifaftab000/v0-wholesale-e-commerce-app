"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search as SearchIcon, Package, Tags } from "lucide-react"

const brandLogos = [
  "Aashirwad_logo.jpg", "Ashok_logo.jpg", "DC_logo.jpg", "Galaxy_logo.jpg",
  "Jannat_logo.jpg", "KRML_logo.jpg", "Laxmi_logo.jpg", "MangatRam_logo.jpg",
  "Manik_logo.jpg", "Munna_Bhaiya_logo.jpg", "Murliwala__logo.jpg", "Palki_logo.jpg",
  "Panshree_logo.jpg", "Rajdhani_logo.jpg", "Sarbatimoti_logo.jpg", "Scooter_logo.jpg",
  "Sher_Khan_logo.jpg", "Tata_Sampan_logo.jpg", "rishta_logo.jpg", "shiva_logo1.jpg",
  "sujatagold_logo.jpg", "tanatan_logo.jpg"
]

const categoriesList = [
  { name: "Raw Grains", image: "/landing-images/grains_grocery.jpg" },
  { name: "Pulses & Lentils", image: "/landing-images/Indian Pulses.jpg" },
  { name: "Rice Varieties", image: "/landing-images/Rice_catlogue.jpg" },
  { name: "Flours & Atta", image: "/landing-images/rice_flours_pulses_grains.jpg" },
  { name: "Spices & Condiments", image: "/landing-images/grain_variesties.jpg" },
  { name: "Oils & Ghee", image: "/landing-images/typesofgrains.jpg" },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")

  const filteredBrands = brandLogos.filter(logo => {
    const brandName = logo.replace('_logo.jpg', '').replace('_', ' ').toLowerCase()
    return brandName.includes(query.toLowerCase())
  })

  const filteredCategories = categoriesList.filter(category => 
    category.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Global Search</h1>
        <p className="text-gray-500 text-lg">Find brands, categories, and products across the ThokWale network.</p>
      </div>

      <div className="relative max-w-2xl mx-auto shadow-lg rounded-2xl">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-16 pr-6 py-5 border-2 border-orange-100 rounded-2xl text-lg focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-white"
          placeholder="Search for 'Aashirwad', 'Basmati Rice', 'Pulses'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="absolute right-3 top-3 bottom-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors">
          Search
        </button>
      </div>

      {query.length > 0 ? (
        <div className="mt-12 space-y-10">
          
          {/* Matching Brands */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tags className="text-orange-500" /> Matching Brands ({filteredBrands.length})
            </h2>
            {filteredBrands.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredBrands.map((logo, idx) => {
                  const brandName = logo.replace('_logo.jpg', '').replace('_', ' ')
                  const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <Link key={idx} href={`/dashboard/brands/${brandSlug}`} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md p-4 flex flex-col items-center group transition-all">
                      <div className="relative w-full h-16 mb-2">
                        <Image src={`/brands/${logo}`} alt={brandName} fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="font-medium text-sm text-center">{brandName}</span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 border border-gray-100 rounded-2xl text-gray-500">
                No brands found matching "{query}"
              </div>
            )}
          </div>

          {/* Matching Categories */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="text-orange-500" /> Matching Categories ({filteredCategories.length})
            </h2>
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredCategories.map((category, idx) => {
                  const catSlug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  return (
                    <Link key={idx} href={`/dashboard/categories/${catSlug}`} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden group transition-all">
                      <div className="relative w-full h-24">
                        <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-white font-bold text-lg">{category.name}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 border border-gray-100 rounded-2xl text-gray-500">
                No categories found matching "{query}"
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-16 text-center text-gray-400 flex flex-col items-center">
          <SearchIcon className="w-16 h-16 mb-4 opacity-20" />
          <p>Start typing to search our entire B2B catalog</p>
        </div>
      )}
    </div>
  )
}
