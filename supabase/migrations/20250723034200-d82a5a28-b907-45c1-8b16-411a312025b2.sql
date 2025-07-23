-- Add privacy field to studies table
ALTER TABLE public.studies 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Create index for better performance when filtering by public/private studies
CREATE INDEX idx_studies_is_public ON public.studies(is_public);

-- Update RLS policies to allow viewing public studies by anyone
CREATE POLICY "Anyone can view public studies" 
ON public.studies 
FOR SELECT 
USING (is_public = true);