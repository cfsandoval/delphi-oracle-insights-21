
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Header
    'header.title': 'DelphiPro',
    'header.subtitle': 'Metodología Delphi Avanzada',
    'header.dashboard': 'Dashboard',
    'header.studies': 'Estudios',
    'header.experts': 'Expertos',
    'header.library': 'Biblioteca',
    'header.newStudy': 'Nuevo Estudio',
    
    // Hero Section
    'hero.title': 'Plataforma Delphi',
    'hero.description': 'Implementa metodologías Delphi tradicionales y en tiempo real con cálculo automático de indicadores de consenso y herramientas avanzadas de interpretación para estudios territoriales y sectoriales',
    'hero.createStudy': 'Crear Estudio',
    'hero.documentation': 'Ver Documentación',
    
    // Study Types
    'study.traditional': 'Delphi Tradicional',
    'study.realtime': 'Delphi Tiempo Real',
    'study.traditional.description': 'Metodología clásica con rondas secuenciales, ideal para estudios de investigación profunda donde el tiempo permite reflexión detallada.',
    'study.realtime.description': 'Metodología adaptada para decisiones rápidas con feedback inmediato, perfecta para situaciones que requieren consenso urgente.',
    'study.start.traditional': 'Comenzar Estudio Tradicional',
    'study.start.realtime': 'Comenzar Estudio en Tiempo Real',
    
    // Library
    'library.title': 'Biblioteca del Método Delphi',
    'library.description': 'Recursos académicos y literatura especializada sobre la metodología Delphi',
    'library.search': 'Buscar literatura...',
    'library.filter.all': 'Todos',
    'library.filter.articles': 'Artículos',
    'library.filter.books': 'Libros',
    'library.filter.guides': 'Guías',
    
    // Study Status
    'status.draft': 'Borrador',
    'status.active': 'Activo',
    'status.completed': 'Completado',
    'status.paused': 'Pausado',
    
    // Study Details
    'study.experts': 'Expertos',
    'study.rounds': 'Rondas',
    'study.consensus': 'Consenso',
    'study.created': 'Creado',
    'study.configure': 'Configurar',
    'study.viewDetails': 'Ver Detalles',
    'study.pause': 'Pausar',
    'study.resume': 'Reanudar',
    'study.edit': 'Editar',
    'study.delete': 'Eliminar',
    'study.duplicate': 'Duplicar',
    
    // Empty State
    'study.empty.title': 'No se encontraron estudios',
    'study.empty.description': 'Intenta ajustar los filtros o crear un nuevo estudio',
    
    // Authentication
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.displayName': 'Nombre',
    'auth.emailPlaceholder': 'tu@email.com',
    'auth.passwordPlaceholder': 'Tu contraseña',
    'auth.displayNamePlaceholder': 'Tu nombre',
    'auth.welcomeBack': '¡Bienvenido de vuelta!',
    'auth.signInSuccess': 'Has iniciado sesión correctamente',
    'auth.checkEmail': 'Revisa tu correo',
    'auth.confirmationSent': 'Te hemos enviado un enlace de confirmación',
    'auth.subtitle': 'Accede a tu cuenta o crea una nueva',
    'auth.signOut': 'Cerrar Sesión',
    
    // Common
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.create': 'Crear',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.all': 'Todos',
    'common.loading': 'Cargando...',
    
    // Experts Module
    'experts.title': 'Gestión de Expertos',
    'experts.description': 'Administra tu panel de expertos para estudios Delphi',
    'experts.add': 'Agregar Experto',
    'experts.import': 'Importar desde CSV',
    'experts.export': 'Exportar',
    'experts.name': 'Nombre',
    'experts.email': 'Correo Electrónico',
    'experts.expertise': 'Área de Expertise',
    'experts.institution': 'Institución',
    'experts.experience': 'Años de Experiencia',
    'experts.education': 'Nivel Educativo',
    'experts.phone': 'Teléfono',
    'experts.notes': 'Notas',
    'experts.status': 'Estado',
    'experts.status.active': 'Activo',
    'experts.status.inactive': 'Inactivo',
    'experts.status.invited': 'Invitado',
    'experts.status.declined': 'Declinó',
    'experts.actions': 'Acciones',
    'experts.edit': 'Editar',
    'experts.delete': 'Eliminar',
    'experts.invite': 'Invitar',
    'experts.empty.title': 'No hay expertos registrados',
    'experts.empty.description': 'Comienza agregando expertos individualmente o importando desde CSV',
    'experts.form.title.add': 'Agregar Nuevo Experto',
    'experts.form.title.edit': 'Editar Experto',
    'experts.csv.instructions': 'Formato CSV: Nombre, Email, Área de Expertise, Institución, Años de Experiencia, Nivel Educativo, Teléfono, Notas',
    'experts.csv.example': 'Ejemplo: Dr. Juan Pérez, juan@universidad.edu, Economía, Universidad Nacional, 15, Doctorado, +1234567890, Especialista en macroeconomía',
    'experts.validation.required': 'Este campo es requerido',
    'experts.validation.email': 'Ingrese un email válido',
    'experts.validation.experience': 'Debe ser un número positivo',
  },
  en: {
    // Header
    'header.title': 'DelphiPro',
    'header.subtitle': 'Advanced Delphi Methodology',
    'header.dashboard': 'Dashboard',
    'header.studies': 'Studies',
    'header.experts': 'Experts',
    'header.library': 'Library',
    'header.newStudy': 'New Study',
    
    // Hero Section
    'hero.title': 'Delphi Platform',
    'hero.description': 'Implement traditional and real-time Delphi methodologies with automatic consensus indicator calculation and advanced interpretation tools for territorial and sectoral studies',
    'hero.createStudy': 'Create Study',
    'hero.documentation': 'View Documentation',
    
    // Study Types
    'study.traditional': 'Traditional Delphi',
    'study.realtime': 'Real-time Delphi',
    'study.traditional.description': 'Classic methodology with sequential rounds, ideal for deep research studies where time allows detailed reflection.',
    'study.realtime.description': 'Methodology adapted for quick decisions with immediate feedback, perfect for situations requiring urgent consensus.',
    'study.start.traditional': 'Start Traditional Study',
    'study.start.realtime': 'Start Real-time Study',
    
    // Library
    'library.title': 'Delphi Method Library',
    'library.description': 'Academic resources and specialized literature on the Delphi methodology',
    'library.search': 'Search literature...',
    'library.filter.all': 'All',
    'library.filter.articles': 'Articles',
    'library.filter.books': 'Books',
    'library.filter.guides': 'Guides',
    
    // Study Status
    'status.draft': 'Draft',
    'status.active': 'Active',
    'status.completed': 'Completed',
    'status.paused': 'Paused',
    
    // Study Details
    'study.experts': 'Experts',
    'study.rounds': 'Rounds',
    'study.consensus': 'Consensus',
    'study.created': 'Created',
    'study.configure': 'Configure',
    'study.viewDetails': 'View Details',
    'study.pause': 'Pause',
    'study.resume': 'Resume',
    'study.edit': 'Edit',
    'study.delete': 'Delete',
    'study.duplicate': 'Duplicate',
    
    // Empty State
    'study.empty.title': 'No studies found',
    'study.empty.description': 'Try adjusting the filters or create a new study',
    
    // Authentication
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.displayName': 'Display Name',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': 'Your password',
    'auth.displayNamePlaceholder': 'Your name',
    'auth.welcomeBack': 'Welcome back!',
    'auth.signInSuccess': 'You have signed in successfully',
    'auth.checkEmail': 'Check your email',
    'auth.confirmationSent': 'We sent you a confirmation link',
    'auth.subtitle': 'Access your account or create a new one',
    'auth.signOut': 'Sign Out',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.loading': 'Loading...',
    
    // Experts Module
    'experts.title': 'Expert Management',
    'experts.description': 'Manage your expert panel for Delphi studies',
    'experts.add': 'Add Expert',
    'experts.import': 'Import from CSV',
    'experts.export': 'Export',
    'experts.name': 'Name',
    'experts.email': 'Email',
    'experts.expertise': 'Expertise Area',
    'experts.institution': 'Institution',
    'experts.experience': 'Years of Experience',
    'experts.education': 'Education Level',
    'experts.phone': 'Phone',
    'experts.notes': 'Notes',
    'experts.status': 'Status',
    'experts.status.active': 'Active',
    'experts.status.inactive': 'Inactive',
    'experts.status.invited': 'Invited',
    'experts.status.declined': 'Declined',
    'experts.actions': 'Actions',
    'experts.edit': 'Edit',
    'experts.delete': 'Delete',
    'experts.invite': 'Invite',
    'experts.empty.title': 'No experts registered',
    'experts.empty.description': 'Start by adding experts individually or importing from CSV',
    'experts.form.title.add': 'Add New Expert',
    'experts.form.title.edit': 'Edit Expert',
    'experts.csv.instructions': 'CSV Format: Name, Email, Expertise Area, Institution, Years of Experience, Education Level, Phone, Notes',
    'experts.csv.example': 'Example: Dr. John Smith, john@university.edu, Economics, National University, 15, PhD, +1234567890, Specialist in macroeconomics',
    'experts.validation.required': 'This field is required',
    'experts.validation.email': 'Please enter a valid email',
    'experts.validation.experience': 'Must be a positive number',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es'); // Español como idioma predeterminado

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
