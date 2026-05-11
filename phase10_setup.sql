-- 1. Create Warehouses Table
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity_tonnes INTEGER NOT NULL,
    current_stock_tonnes INTEGER NOT NULL DEFAULT 0,
    active_brands_count INTEGER NOT NULL DEFAULT 0,
    manager_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Insert dummy warehouses
INSERT INTO public.warehouses (name, location, capacity_tonnes, current_stock_tonnes, active_brands_count, manager_name)
VALUES 
  ('Central Hub North', 'Delhi NCR', 250000, 185000, 420, 'Rajesh Kumar'),
  ('Western Distribution', 'Mumbai', 150000, 110000, 315, 'Sanjay Patel'),
  ('Southern Fulfillment', 'Bangalore', 100000, 85000, 240, 'Muthu Swamy')
ON CONFLICT DO NOTHING;

-- Enable RLS for warehouses
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read warehouses" ON public.warehouses;
CREATE POLICY "Anyone can read warehouses" ON public.warehouses FOR SELECT USING (true);

-- 2. Add warehouse_id to orders table for routing
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS warehouse_id UUID REFERENCES public.warehouses(id);

-- 3. Create Storage Buckets
-- Note: You need to run these inserts as a superuser or via the Supabase SQL Editor.
INSERT INTO storage.buckets (id, name, public) VALUES ('catalog_assets', 'catalog_assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('retailer_documents', 'retailer_documents', true) ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'catalog_assets' OR bucket_id = 'retailer_documents');

DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'catalog_assets' OR bucket_id = 'retailer_documents');

DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'catalog_assets' OR bucket_id = 'retailer_documents');