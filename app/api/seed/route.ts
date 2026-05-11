import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We MUST use the service role key to bypass RLS and insert data without being logged in as an admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const staticCategories = [
  { name: "Raw Grains", icon: "/landing-images/grains_grocery.jpg", description: "Fresh and raw agricultural grains." },
  { name: "Pulses & Lentils", icon: "/landing-images/Indian Pulses.jpg", description: "High protein pulses and lentils." },
  { name: "Rice Varieties", icon: "/landing-images/Rice_catlogue.jpg", description: "Premium basmati and regional rice." },
  { name: "Flours & Atta", icon: "/landing-images/rice_flours_pulses_grains.jpg", description: "Finely milled flours for daily use." },
  { name: "Spices & Condiments", icon: "/landing-images/grain_variesties.jpg", description: "Aromatic Indian spices." },
  { name: "Oils & Ghee", icon: "/landing-images/typesofgrains.jpg", description: "Pure cooking oils and desi ghee." },
];

const staticBrands = [
  { name: "Aashirvaad", logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/ITC_Limited_Logo.svg/1200px-ITC_Limited_Logo.svg.png", description: "Trusted quality." },
  { name: "India Gate", logo_url: "https://via.placeholder.com/150", description: "Premium basmati rice." },
  { name: "Fortune", logo_url: "https://via.placeholder.com/150", description: "Pure cooking oils." },
  { name: "Tata Sampann", logo_url: "https://via.placeholder.com/150", description: "Unpolished dals and pure spices." },
  { name: "Patanjali", logo_url: "https://via.placeholder.com/150", description: "Natural and ayurvedic products." },
];

export async function GET() {
  try {
    // 1. Clear existing data to prevent duplicates on multiple runs
    await supabaseAdmin.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('brands').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert Categories
    const { data: insertedCategories, error: catErr } = await supabaseAdmin
      .from('categories')
      .insert(staticCategories)
      .select();

    if (catErr) throw new Error("Categories Error: " + catErr.message);

    // 3. Insert Brands
    const { data: insertedBrands, error: brandErr } = await supabaseAdmin
      .from('brands')
      .insert(staticBrands)
      .select();

    if (brandErr) throw new Error("Brands Error: " + brandErr.message);

    // 4. Create Products using the new UUIDs
    const getCatId = (name: string) => insertedCategories.find(c => c.name === name)?.id;
    const getBrandId = (name: string) => insertedBrands.find(b => b.name === name)?.id;

    const staticProducts = [
      {
        name: "Premium Sharbati Wheat",
        category_id: getCatId("Raw Grains"),
        brand_id: getBrandId("Aashirvaad"),
        price_per_kg: 32,
        bag_weight_kg: 50,
        min_order_bags: 10,
        stock_kg: 5000,
        image_url: "/landing-images/grains_grocery.jpg",
        features: JSON.stringify(["100% Sortex Cleaned", "Moisture < 12%", "High Protein Content"])
      },
      {
        name: "Unpolished Toor Dal",
        category_id: getCatId("Pulses & Lentils"),
        brand_id: getBrandId("Tata Sampann"),
        price_per_kg: 145,
        bag_weight_kg: 30,
        min_order_bags: 5,
        stock_kg: 2000,
        image_url: "/landing-images/Indian Pulses.jpg",
        features: JSON.stringify(["Unpolished", "Direct from farmers", "High Yield"])
      },
      {
        name: "Basmati Rice 1121 XL",
        category_id: getCatId("Rice Varieties"),
        brand_id: getBrandId("India Gate"),
        price_per_kg: 85,
        bag_weight_kg: 25,
        min_order_bags: 20,
        stock_kg: 10000,
        image_url: "/landing-images/Rice_catlogue.jpg",
        features: JSON.stringify(["Aged 2 Years", "Extra Long Grain", "Aromatic"])
      },
      {
        name: "Chakki Fresh Atta",
        category_id: getCatId("Flours & Atta"),
        brand_id: getBrandId("Aashirvaad"),
        price_per_kg: 38,
        bag_weight_kg: 50,
        min_order_bags: 15,
        stock_kg: 8000,
        image_url: "/landing-images/rice_flours_pulses_grains.jpg",
        features: JSON.stringify(["0% Maida", "Stone Ground", "High Fiber"])
      },
      {
        name: "Refined Sunflower Oil",
        category_id: getCatId("Oils & Ghee"),
        brand_id: getBrandId("Fortune"),
        price_per_kg: 110,
        bag_weight_kg: 15,
        min_order_bags: 10,
        stock_kg: 4000,
        image_url: "/landing-images/typesofgrains.jpg",
        features: JSON.stringify(["Fortified with Vitamin A & D", "Light and Healthy", "Long Shelf Life"])
      }
    ];

    const { data: insertedProducts, error: prodErr } = await supabaseAdmin
      .from('products')
      .insert(staticProducts)
      .select();

    if (prodErr) throw new Error("Products Error: " + prodErr.message);

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully!",
      categories: insertedCategories.length,
      brands: insertedBrands.length,
      products: insertedProducts.length
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
