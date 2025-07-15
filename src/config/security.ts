/**
 * Security configuration for the application
 */
export const SecurityConfig = {
  // Content Security Policy
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for Vite dev
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"],
      'font-src': ["'self'", "https:"],
      'connect-src': [
        "'self'",
        "https://*.supabase.co",
        "https://*.lovableproject.com"
      ],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"]
    }
  },

  // Rate limiting configuration
  rateLimit: {
    emailSending: {
      maxRequests: 3,
      windowMs: 300000, // 5 minutes
    },
    formSubmission: {
      maxRequests: 10,
      windowMs: 60000, // 1 minute
    }
  },

  // Input validation limits
  inputLimits: {
    name: 100,
    email: 254,
    subject: 200,
    message: 500,
    title: 200,
    description: 1000,
    notes: 1000
  },

  // Allowed file types for uploads (if implemented)
  allowedFileTypes: [
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],

  // Maximum file size (5MB)
  maxFileSize: 5 * 1024 * 1024,

  // Security headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
} as const;