// Client-side API implementations for static deployment
// These functions provide API-like functionality that works with static sites

import { z } from 'zod';

// Contact form data schema
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  organization: z.string().max(200).optional(),
  language: z.enum(['en', 'es', 'ca']).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Newsletter subscription schema
const newsletterSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).optional(),
  interests: z.array(z.string()).optional(),
  language: z.enum(['en', 'es', 'ca']).default('en'),
});

type NewsletterData = z.infer<typeof newsletterSchema>;

/**
 * Submit contact form using Formspree (or similar service)
 */
export const submitContactForm = async (data: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate data
    const validatedData = contactSchema.parse(data);
    
    // Option 1: Formspree
    const formspreeEndpoint = process.env.PUBLIC_FORMSPREE_ID || 'xpzgoqor'; // Example ID
    
    const response = await fetch(`https://formspree.io/f/${formspreeEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        organization: validatedData.organization,
        language: validatedData.language,
        _replyto: validatedData.email,
        _subject: `Portfolio Contact: ${validatedData.subject}`,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Please check that all fields are filled correctly.' 
      };
    }
    
    return { 
      success: false, 
      error: 'Failed to send message. Please try again or email directly.' 
    };
  }
};

/**
 * Submit contact form using EmailJS
 */
export const submitContactFormEmailJS = async (data: ContactFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const validatedData = contactSchema.parse(data);
    
    // EmailJS configuration (set these in your environment or directly)
    const serviceID = process.env.PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
    const templateID = process.env.PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
    const publicKey = process.env.PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';
    
    const emailParams = {
      from_name: validatedData.name,
      from_email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      organization: validatedData.organization || '',
      language: validatedData.language || 'en',
      to_email: 'ramon.rocap@gmail.com',
    };
    
    // @ts-ignore - EmailJS is loaded via CDN
    const response = await emailjs.send(serviceID, templateID, emailParams, publicKey);
    
    if (response.status !== 200) {
      throw new Error(`EmailJS error: ${response.text}`);
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('EmailJS submission error:', error);
    
    return { 
      success: false, 
      error: 'Failed to send message. Please try again or email directly.' 
    };
  }
};

/**
 * Newsletter subscription using Mailchimp (client-side)
 */
export const subscribeToNewsletter = async (data: NewsletterData): Promise<{ success: boolean; error?: string }> => {
  try {
    const validatedData = newsletterSchema.parse(data);
    
    // Mailchimp embedded form submission
    const mailchimpURL = process.env.PUBLIC_MAILCHIMP_URL;
    
    if (!mailchimpURL) {
      throw new Error('Newsletter subscription not configured');
    }
    
    const formData = new FormData();
    formData.append('EMAIL', validatedData.email);
    formData.append('FNAME', validatedData.name || '');
    formData.append('LANGUAGE', validatedData.language);
    formData.append('INTERESTS', validatedData.interests?.join(',') || '');
    
    const response = await fetch(mailchimpURL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Mailchimp doesn't support CORS for embedded forms
    });
    
    // Since we're using no-cors mode, we can't read the response
    // We'll assume success and let the user know to check their email
    return { 
      success: true 
    };
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return { 
      success: false, 
      error: 'Failed to subscribe. Please try again later.' 
    };
  }
};

/**
 * Simple client-side search functionality
 */
export const searchContent = async (query: string, limit = 20): Promise<{
  success: boolean;
  results?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    url: string;
    score: number;
  }>;
  error?: string;
}> => {
  try {
    if (!query || query.trim().length < 2) {
      return { success: false, error: 'Search query too short' };
    }
    
    // Import publications data
    const { publications } = await import('../data/publications.js');
    
    const queryLower = query.toLowerCase();
    const searchTerms = queryLower.split(/\s+/).filter(term => term.length > 2);
    
    // Simple text matching with scoring
    const results = publications
      .map(pub => {
        let score = 0;
        const searchText = `${pub.title} ${pub.journal} ${pub.year} ${pub.abstract || ''}`.toLowerCase();
        
        // Score based on term matches
        searchTerms.forEach(term => {
          const matches = (searchText.match(new RegExp(term, 'g')) || []).length;
          score += matches;
          
          // Bonus for title matches
          if (pub.title.toLowerCase().includes(term)) {
            score += 2;
          }
        });
        
        return {
          id: `pub-${pub.title.replace(/\s+/g, '-').toLowerCase()}`,
          type: 'publication',
          title: pub.title,
          description: pub.abstract || `Published in ${pub.journal} (${pub.year})`,
          url: pub.url || '#',
          score,
          year: pub.year,
          journal: pub.journal,
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return { success: true, results };
    
  } catch (error) {
    console.error('Search error:', error);
    return { success: false, error: 'Search failed' };
  }
};

/**
 * Client-side analytics tracking (using Google Analytics or Plausible)
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  try {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      // @ts-ignore
      gtag('event', eventName, {
        event_category: properties?.category || 'engagement',
        event_label: properties?.label,
        value: properties?.value,
        custom_parameter_1: properties?.custom1,
        custom_parameter_2: properties?.custom2,
      });
    }
    
    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
      // @ts-ignore
      plausible(eventName, {
        props: properties || {}
      });
    }
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, properties);
    }
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Rate limiting for client-side requests
 */
class ClientRateLimit {
  private storage: Map<string, { count: number; resetTime: number }> = new Map();
  
  check(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.storage.get(key);
    
    if (!entry || now > entry.resetTime) {
      this.storage.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (entry.count >= maxAttempts) {
      return false;
    }
    
    entry.count++;
    return true;
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Global rate limiter instance
export const clientRateLimit = new ClientRateLimit();

// Cleanup old entries every 10 minutes
setInterval(() => clientRateLimit.cleanup(), 10 * 60 * 1000);

/**
 * Honeypot validation helper
 */
export const validateHoneypot = (honeypotValue: string): boolean => {
  return !honeypotValue || honeypotValue.length === 0;
};

/**
 * Simple reCAPTCHA v3 integration
 */
export const executeRecaptcha = async (action: string): Promise<string | null> => {
  try {
    const siteKey = process.env.PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.warn('reCAPTCHA not configured');
      return null;
    }
    
    // @ts-ignore - grecaptcha is loaded via script tag
    if (typeof grecaptcha !== 'undefined') {
      // @ts-ignore
      const token = await grecaptcha.execute(siteKey, { action });
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('reCAPTCHA error:', error);
    return null;
  }
};

export type { ContactFormData, NewsletterData };