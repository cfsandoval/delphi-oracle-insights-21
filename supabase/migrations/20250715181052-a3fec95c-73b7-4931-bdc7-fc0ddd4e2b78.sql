-- Add category column to studies table
ALTER TABLE public.studies 
ADD COLUMN category TEXT DEFAULT 'general';

-- Create index for better performance
CREATE INDEX idx_studies_category ON public.studies(category);

-- Insert admin role for the admin user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'admin@delphi.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert manager role for better access
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'manager'::app_role
FROM auth.users 
WHERE email = 'admin@delphi.com'
ON CONFLICT (user_id, role) DO NOTHING;