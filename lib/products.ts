import { PRODUCTS as PRODUCTS_DATA, CATEGORIES } from "@/lib/data/products"
import type { ProductCategory } from "@/lib/types"

export const PRODUCTS = PRODUCTS_DATA

export { CATEGORIES }

export const getUniqueBrands = (category: ProductCategory): string[] => {
  return Array.from(new Set(PRODUCTS_DATA.filter((p) => p.category === category).map((p) => p.brand))).sort()
}

export const getUniqueSubcategories = (category: ProductCategory): string[] => {
  return Array.from(new Set(PRODUCTS_DATA.filter((p) => p.category === category).map((p) => p.subcategory))).sort()
}
