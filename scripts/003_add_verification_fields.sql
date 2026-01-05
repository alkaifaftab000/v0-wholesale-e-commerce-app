-- Add GST and FSSAI fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS fssai_number TEXT,
ADD COLUMN IF NOT EXISTS document_urls TEXT[];

-- Update business_type check to include more options if needed
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_business_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_business_type_check 
CHECK (business_type IN ('retailer', 'wholesaler', 'manufacturer', 'restaurant', 'caterer', 'hotel'));
