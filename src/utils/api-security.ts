// Centralized API security utilities
import { z } from 'zod';

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://www.google.com;",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Permitted-Cross-Domain-Policies': 'none',
} as const;

// Rate limiting storage and configuration
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  keyPrefix: string;
}

// Default rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 5,
    keyPrefix: 'contact_',
  },
  newsletter: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxAttempts: 3,
    keyPrefix: 'newsletter_',
  },
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 30,
    keyPrefix: 'search_',
  },
  analytics: {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 100,
    keyPrefix: 'analytics_',
  },
} as const;

// Global rate limit storage
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Extract client IP address from request headers
 */
export const getClientIP = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  return 'unknown';
};

/**
 * Check rate limits for a given IP and endpoint
 */
export const checkRateLimit = (
  ip: string, 
  config: RateLimitConfig
): { allowed: boolean; resetTime?: number; remaining?: number } => {
  const key = `${config.keyPrefix}${ip}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // New window or expired
    rateLimitStore.set(key, { 
      count: 1, 
      resetTime: now + config.windowMs 
    });
    return { 
      allowed: true, 
      resetTime: now + config.windowMs,
      remaining: config.maxAttempts - 1
    };
  }
  
  if (entry.count >= config.maxAttempts) {
    return { 
      allowed: false, 
      resetTime: entry.resetTime,
      remaining: 0
    };
  }
  
  entry.count++;
  return { 
    allowed: true, 
    resetTime: entry.resetTime,
    remaining: config.maxAttempts - entry.count
  };
};

/**
 * Clean up expired rate limit entries
 */
export const cleanupRateLimit = (): void => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Run cleanup every 10 minutes
if (typeof globalThis !== 'undefined') {
  setInterval(cleanupRateLimit, 10 * 60 * 1000);
}

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export const sanitizeString = (
  str: string | undefined, 
  maxLength: number = 500
): string | undefined => {
  if (!str) return undefined;
  
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>\"']/g, '') // Remove dangerous characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, maxLength);
};

/**
 * Validate email format with additional security checks
 */
export const validateEmail = (email: string): boolean => {
  // Basic regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Length check
  if (email.length > 255) return false;
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\+.*\+/, // Multiple plus signs
    /\.{2,}/, // Multiple consecutive dots
    /@.*@/, // Multiple @ symbols
    /[<>]/, // HTML brackets
    /javascript:/i, // JavaScript protocol
    /['"]/, // Quotes
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(email));
};

/**
 * Detect suspicious patterns in text content
 */
export const detectSuspiciousPatterns = (text: string): boolean => {
  const patterns = [
    // XSS patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    
    // Injection patterns
    /union\s+select/gi,
    /or\s+1\s*=\s*1/gi,
    /drop\s+table/gi,
    /insert\s+into/gi,
    
    // Suspicious URLs (not allowlisted domains)
    /http[s]?:\/\/(?!(?:localhost|127\.0\.0\.1|rrocap\.github\.io|github\.com|linkedin\.com|scholar\.google\.com|orcid\.org))/gi,
    
    // Command injection
    /(\||&|;|\$\(|`)/g,
    
    // Path traversal
    /\.\.[\/\\]/g,
  ];
  
  return patterns.some(pattern => pattern.test(text));
};

/**
 * Generate CORS headers based on environment
 */
export const getCORSHeaders = (): Record<string, string> => {
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://rrocap.github.io', 'https://www.rrocap.github.io']
    : ['*'];
    
  return {
    'Access-Control-Allow-Origin': allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Recaptcha-Token, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
};

/**
 * Create standardized error response
 */
export const createErrorResponse = (
  error: string,
  code: string,
  status: number = 400,
  details?: any
): Response => {
  const headers = new Headers({ ...SECURITY_HEADERS, ...getCORSHeaders() });
  headers.set('Content-Type', 'application/json');
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      error,
      code,
      ...(details && { details })
    }),
    { status, headers }
  );
};

/**
 * Create standardized success response
 */
export const createSuccessResponse = (
  data: any,
  status: number = 200
): Response => {
  const headers = new Headers({ ...SECURITY_HEADERS, ...getCORSHeaders() });
  headers.set('Content-Type', 'application/json');
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      ...data
    }),
    { status, headers }
  );
};

/**
 * Create CORS preflight response
 */
export const createOptionsResponse = (): Response => {
  const headers = new Headers({ ...SECURITY_HEADERS, ...getCORSHeaders() });
  return new Response(null, { status: 200, headers });
};

/**
 * Honeypot validation middleware
 */
export const validateHoneypot = (body: any): boolean => {
  // Check common honeypot field names
  const honeypotFields = ['website', 'url', 'phone2', 'fax', 'confirm_email'];
  
  return honeypotFields.every(field => {
    const value = body[field];
    return !value || (typeof value === 'string' && value.length === 0);
  });
};

/**
 * Parse and validate JSON request body
 */
export const parseJSONBody = async (request: Request): Promise<any> => {
  try {
    const body = await request.json();
    
    // Check for suspicious JSON patterns
    const jsonString = JSON.stringify(body);
    if (detectSuspiciousPatterns(jsonString)) {
      throw new Error('SUSPICIOUS_CONTENT');
    }
    
    return body;
  } catch (error) {
    if (error instanceof Error && error.message === 'SUSPICIOUS_CONTENT') {
      throw error;
    }
    throw new Error('INVALID_JSON');
  }
};

/**
 * Simple request logging
 */
export const logRequest = (
  ip: string, 
  method: string, 
  endpoint: string, 
  success: boolean,
  responseTime?: number
): void => {
  const timestamp = new Date().toISOString();
  const status = success ? 'SUCCESS' : 'FAILURE';
  const timing = responseTime ? ` (${responseTime}ms)` : '';
  
  console.log(`[${timestamp}] ${ip} ${method} ${endpoint} - ${status}${timing}`);
};

/**
 * Hash string for privacy (simple implementation)
 */
export const hashString = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString(36);
};

/**
 * Extract basic browser/OS info from user agent (privacy-safe)
 */
export const parseUserAgent = (userAgent: string): { browser: string; os: string } => {
  const browser = userAgent.includes('Chrome') ? 'Chrome' :
                 userAgent.includes('Firefox') ? 'Firefox' :
                 userAgent.includes('Safari') ? 'Safari' :
                 userAgent.includes('Edge') ? 'Edge' : 'Other';
                 
  const os = userAgent.includes('Windows') ? 'Windows' :
            userAgent.includes('Mac OS X') ? 'macOS' :
            userAgent.includes('Linux') ? 'Linux' :
            userAgent.includes('iOS') ? 'iOS' :
            userAgent.includes('Android') ? 'Android' : 'Other';
            
  return { browser, os };
};

/**
 * Validate reCAPTCHA token
 */
export const verifyRecaptcha = async (token: string, ip: string): Promise<boolean> => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured - allowing request in development');
    return process.env.NODE_ENV !== 'production';
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}&remoteip=${ip}`,
    });
    
    const data = await response.json();
    return data.success === true && data.score > 0.5; // Adjust score threshold as needed
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
};

export type { RateLimitConfig, RateLimitEntry };