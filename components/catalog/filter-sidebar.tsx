"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
  category: string
  brands: string[]
  subcategories: string[]
}

export function FilterSidebar({ category, brands, subcategories }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([2000, 25000])

  return (
    <Card className="border-none shadow-sm sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </span>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Type */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-[#2D1B14] uppercase tracking-wider">Product Type</Label>
          <div className="space-y-2">
            {subcategories.map((sub) => (
              <div key={sub} className="flex items-center space-x-2">
                <Checkbox id={`sub-${sub}`} />
                <label
                  htmlFor={`sub-${sub}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                >
                  {sub}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-[#E5D5D0]" />

        {/* Brands */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-[#2D1B14] uppercase tracking-wider">Brands</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={`brand-${brand}`} />
                <label
                  htmlFor={`brand-${brand}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-[#E5D5D0]" />

        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-bold text-[#2D1B14] uppercase tracking-wider">Price Range</Label>
            <span className="text-[10px] font-medium text-muted-foreground italic">Per Quintal</span>
          </div>
          <Slider
            defaultValue={[2000, 25000]}
            max={25000}
            step={500}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-4"
          />
          <div className="flex justify-between text-xs font-bold text-[#6F4E37]">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full bg-[#6F4E37] hover:bg-[#5D402E]">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}
