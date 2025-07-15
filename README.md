# Delphi - Plataforma de Estudios Prospectivos

Una plataforma moderna para la gestión y realización de estudios Delphi, tanto tradicionales como en tiempo real.

## 🚀 Instalación Rápida

### Prerrequisitos

- Node.js 18+ ([Instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o yarn
- Cuenta en Supabase (para base de datos)
- Cuenta en Resend (para envío de emails)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/delphi-platform.git
cd delphi-platform
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar base de datos Supabase**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Hacer login a Supabase
supabase login

# Vincular al proyecto
supabase link --project-ref xyeblzjuejqreiejnhgv

# Aplicar migraciones
supabase db push
```

5. **Configurar envío de emails**
- Crear cuenta en [Resend](https://resend.com)
- Obtener API key
- Configurar en Supabase: Settings → Edge Functions → Add secret `RESEND_API_KEY`

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

### Usuarios de Prueba

- **Admin**: `admin@delphi.com` / `admin123`
- Crear nuevos usuarios desde la interfaz de autenticación

## 📱 Funcionalidades

- ✅ Gestión de expertos
- ✅ Creación de estudios Delphi tradicionales y en tiempo real
- ✅ Sistema de invitaciones por email
- ✅ Análisis de consenso
- ✅ Interfaz multiidioma (ES/EN)
- ✅ Autenticación con Supabase
- ✅ Diseño responsivo

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3839f65e-a9ab-4c47-a8f2-af5f757c7c3c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
