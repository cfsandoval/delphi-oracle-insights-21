import DOMPurify from 'dompurify';

/**
 * Security utilities for input sanitization and validation
 */
export class SecurityUtils {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: [],
      FORBID_ATTR: ['style', 'class', 'id'],
      FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style', 'iframe']
    });
  }

  /**
   * Escape HTML entities in text
   */
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Validate and sanitize text input
   */
  static validateAndSanitizeText(text: string, maxLength: number = 1000): string {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    // Remove excessive whitespace and trim
    const cleaned = text.trim().replace(/\s+/g, ' ');
    
    // Truncate if too long
    if (cleaned.length > maxLength) {
      return cleaned.substring(0, maxLength);
    }
    
    return this.escapeHtml(cleaned);
  }

  /**
   * Validate phone number format
   */
  static isValidPhone(phone: string): boolean {
    // Simple international phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Rate limiting check (simple in-memory implementation)
   */
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static isRateLimited(identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const record = this.rateLimitMap.get(identifier);
    
    if (!record || record.resetTime < windowStart) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now });
      return false;
    }
    
    if (record.count >= maxRequests) {
      return true;
    }
    
    record.count++;
    return false;
  }

  /**
   * Clean up old rate limit entries
   */
  static cleanupRateLimit(): void {
    const now = Date.now();
    const oneHourAgo = now - 3600000; // 1 hour
    
    for (const [key, record] of this.rateLimitMap.entries()) {
      if (record.resetTime < oneHourAgo) {
        this.rateLimitMap.delete(key);
      }
    }
  }
}

// Clean up rate limit entries every hour
setInterval(() => SecurityUtils.cleanupRateLimit(), 3600000);