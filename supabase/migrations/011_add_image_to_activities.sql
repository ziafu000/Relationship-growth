-- Add image_url to activities table
ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for activity images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('activity_images', 'activity_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for activity_images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'activity_images');

CREATE POLICY "Authenticated users can upload activity images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'activity_images');

CREATE POLICY "Users can update their own activity images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'activity_images' AND (auth.uid() = owner));

CREATE POLICY "Users can delete their own activity images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'activity_images' AND (auth.uid() = owner));
