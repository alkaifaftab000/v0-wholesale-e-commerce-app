"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function CategoriesDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase.from('categories').select('*')
      if (data) setCategories(data)
      setLoading(false)
    }
    loadCategories()
  }, [supabase])

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <div className="p-10 text-center">Loading Categories...</div>

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-500 text-lg">Browse agricultural products by category.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No categories found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredCategories.map((category, idx) => {
            const catSlug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            
            return (
              <Link 
                key={idx} 
                href={`/dashboard/categories/${catSlug}`}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
              >
                <Image 
                  src={category.icon || "/placeholder.jpg"} 
                  alt={category.name} 
                  fill 
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                  <span className="text-orange-300 text-sm font-medium">View Products →</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
