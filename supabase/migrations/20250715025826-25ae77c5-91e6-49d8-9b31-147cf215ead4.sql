-- Crear usuario admin directamente en auth.users
-- Nota: En producción, esto debería hacerse a través del panel de Supabase o API
-- Para desarrollo, creamos un usuario admin con credenciales conocidas

-- Insertar usuario admin en auth.users (esto normalmente se hace via Supabase Auth API)
-- Email: admin@delphi.com
-- Password: admin123 (se hashea automáticamente)

-- Primero, verificamos si el usuario admin ya existe y lo eliminamos si existe
DELETE FROM auth.users WHERE email = 'admin@delphi.com';

-- Crear el usuario admin con un ID específico para consistencia
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  role,
  aud,
  is_super_admin
) VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@delphi.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "Administrador"}',
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated',
  false
);

-- Crear perfil para el usuario admin
INSERT INTO public.profiles (
  user_id,
  email,
  display_name
) VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::uuid,
  'admin@delphi.com',
  'Administrador'
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name;