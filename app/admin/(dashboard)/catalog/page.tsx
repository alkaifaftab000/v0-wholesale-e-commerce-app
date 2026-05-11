"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PackagePlus, Building, UploadCloud, ShoppingBag } from "lucide-react"

export default function AdminCatalogPage() {
  const [activeTab, setActiveTab] = useState<'category'|'brand'|'product'>('category')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  
  // Product specific states
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [price, setPrice] = useState("")
  const [minOrder, setMinOrder] = useState("")
  const [stock, setStock] = useState("")
  const [features, setFeatures] = useState("") // comma separated

  const supabase = createClient()

  useEffect(() => {
    async function fetchRelations() {
      const { data: c } = await supabase.from('categories').select('id, name')
      const { data: b } = await supabase.from('brands').select('id, name')
      if (c) setCategories(c)
      if (b) setBrands(b)
    }
    fetchRelations()
  }, [supabase])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !name) return toast.error("Please provide a name and an image.")

    setIsSubmitting(true)
    try {
      // 1. Upload File to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${activeTab}_${Date.now()}.${fileExt}`
      const filePath = `${activeTab}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('catalog_assets')
        .upload(filePath, file)

      if (uploadError) throw new Error("Failed to upload image to bucket. Is 'catalog_assets' created?")

      const { data: { publicUrl } } = supabase.storage
        .from('catalog_assets')
        .getPublicUrl(filePath)

      // 2. Insert Record into DB
      if (activeTab === 'category') {
        const { error } = await supabase.from('categories').insert({ name, description, icon: publicUrl })
        if (error) throw error
      } else if (activeTab === 'brand') {
        const { error } = await supabase.from('brands').insert({ name, description, logo_url: publicUrl })
        if (error) throw error
      } else {
        if (!selectedCategory || !selectedBrand || !price || !stock) throw new Error("Missing product details")
        const featureArray = features.split(',').map(f => f.trim()).filter(Boolean)
        const { error } = await supabase.from('products').insert({
          name,
          category_id: selectedCategory,
          brand_id: selectedBrand,
          price_per_kg: Number(price),
          min_order_bags: Number(minOrder) || 1,
          bag_weight_kg: 50,
          stock_kg: Number(stock),
          features: JSON.stringify(featureArray),
          image_url: publicUrl
        })
        if (error) throw error
      }

      toast.success(`${activeTab === 'category' ? 'Category' : activeTab === 'brand' ? 'Brand' : 'Product'} added successfully!`)
      setName("")
      setDescription("")
      setPrice("")
      setMinOrder("")
      setStock("")
      setFeatures("")
      setFile(null)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalog Manager</h1>
        <p className="text-gray-500">Upload new categories, brands, and products directly to the Supabase database.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 pb-px overflow-x-auto">
        <button 
          onClick={() => setActiveTab('category')}
          className={`flex items-center whitespace-nowrap gap-2 pb-4 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'category' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <PackagePlus className="w-5 h-5" /> New Category
        </button>
        <button 
          onClick={() => setActiveTab('brand')}
          className={`flex items-center whitespace-nowrap gap-2 pb-4 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'brand' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Building className="w-5 h-5" /> New Brand
        </button>
        <button 
          onClick={() => setActiveTab('product')}
          className={`flex items-center whitespace-nowrap gap-2 pb-4 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'product' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <ShoppingBag className="w-5 h-5" /> New Product
        </button>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-6">
          <CardTitle>Add a {activeTab === 'category' ? 'Category' : activeTab === 'brand' ? 'Brand' : 'Product'}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            
            <div className="space-y-2">
              <Label>{activeTab === 'category' ? 'Category Name' : activeTab === 'brand' ? 'Brand Name' : 'Product Name'}</Label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={activeTab === 'category' ? 'e.g., Organic Pulses' : activeTab === 'brand' ? 'e.g., Ashirvaad' : 'e.g., Premium Basmati Rice'}
                required
              />
            </div>

            {activeTab !== 'product' && (
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                />
              </div>
            )}

            {activeTab === 'product' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} required>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <select className="w-full border border-gray-200 rounded-lg p-2.5" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} required>
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price per Kg (₹)</Label>
                    <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 50" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Order (Bags)</Label>
                    <Input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="e.g. 1" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock (Kg)</Label>
                    <Input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="e.g. 1000" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Features (Comma separated)</Label>
                  <Input value={features} onChange={e => setFeatures(e.target.value)} placeholder="e.g. Premium Quality, Aged 2 Years, Sortex Cleaned" />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>{activeTab === 'category' ? 'Category Image' : activeTab === 'brand' ? 'Brand Logo' : 'Product Image'}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden" 
                  id="file-upload"
                  required
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                  <span className="text-gray-700 font-medium">Click to select image</span>
                  <span className="text-sm text-gray-500 mt-1">{file ? file.name : "PNG, JPG up to 5MB"}</span>
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-6 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : `Save ${activeTab === 'category' ? 'Category' : activeTab === 'brand' ? 'Brand' : 'Product'}`}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
