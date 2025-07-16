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

4. **Configurar base de datos**

### Opción A: Supabase (Recomendado)
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

### Opción B: PostgreSQL Local
```bash
# Instalar PostgreSQL
# Ubuntu/Debian: sudo apt install postgresql postgresql-contrib
# macOS: brew install postgresql

# Crear base de datos
createdb delphi_db

# Configurar variables de entorno
DB_HOST=localhost
DB_PORT=5432
DB_NAME=delphi_db
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

### Opción C: MySQL
```bash
# Instalar MySQL
# Ubuntu/Debian: sudo apt install mysql-server
# macOS: brew install mysql

# Crear base de datos
mysql -u root -p
CREATE DATABASE delphi_db;
CREATE USER 'delphi_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON delphi_db.* TO 'delphi_user'@'localhost';
FLUSH PRIVILEGES;

# Configurar variables de entorno
DB_HOST=localhost
DB_PORT=3306
DB_NAME=delphi_db
DB_USER=delphi_user
DB_PASSWORD=password
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

### Crear Usuario Administrador

Para crear un usuario administrador:
1. Registrarse a través de la interfaz web
2. Usar Supabase Dashboard para asignar roles si es necesario
3. **Nunca usar credenciales hardcodeadas en producción**

## 📱 Funcionalidades

- ✅ Gestión de expertos con validación robusta
- ✅ Creación de estudios Delphi tradicionales y en tiempo real
- ✅ Sistema de invitaciones por email seguro
- ✅ Análisis de consenso avanzado
- ✅ Interfaz multiidioma (ES/EN)
- ✅ Autenticación segura con Supabase
- ✅ Diseño responsivo
- ✅ **Seguridad avanzada** con protección contra XSS, CSRF y rate limiting

## Uso de la Plataforma

Para una guía paso a paso sobre gestión de expertos, creación de estudios e invitaciones, consulta [docs/USO.md](./docs/USO.md).


## 🔒 Seguridad

Esta plataforma implementa múltiples capas de seguridad:

- **Validación de entrada**: Sanitización de todos los datos de usuario
- **Rate limiting**: Protección contra spam y ataques de fuerza bruta  
- **Políticas CSP**: Prevención de ataques XSS
- **Headers de seguridad**: Protección contra clickjacking y sniffing
- **RLS en base de datos**: Acceso restringido a datos por usuario
- **Autenticación robusta**: Gestión segura de sesiones

Ver [SECURITY.md](./SECURITY.md) para detalles completos.

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
