import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { z } from 'zod';
import { getApiEndpoint, isFeatureEnabled } from '../utils/featureFlags';

// Validation schemas
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ\u0100-\u017F\s-']+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  organization: z.string()
    .max(200, 'Organization must be less than 200 characters')
    .optional(),
    
  // Honeypot field - should remain empty
  website: z.string().max(0, 'Bot detected').optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  lang?: 'en' | 'es' | 'ca';
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FormState {
  status: 'idle' | 'validating' | 'submitting' | 'success' | 'error' | 'rate_limited';
  message: string;
  errors: Partial<Record<keyof ContactFormData, string>>;
  submitCount: number;
  lastSubmit: number;
}

const RATE_LIMIT = {
  maxSubmissions: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

const ContactForm: React.FC<ContactFormProps> = ({ 
  lang = 'en', 
  className = '',
  onSuccess,
  onError 
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization: '',
    website: '', // Honeypot
  });

  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    message: '',
    errors: {},
    submitCount: 0,
    lastSubmit: 0,
  });

  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [fieldFocus, setFieldFocus] = useState<string>('');
  
  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const errorMessageRef = useRef<HTMLDivElement>(null);

  // Internationalization
  const content = {
    en: {
      title: 'Get in Touch',
      subtitle: 'Let\'s discuss research collaboration, opportunities, or any questions you may have.',
      fields: {
        name: 'Full Name',
        email: 'Email Address',
        subject: 'Subject',
        message: 'Message',
        organization: 'Organization (optional)',
      },
      placeholders: {
        name: 'Dr. Jane Smith',
        email: 'jane.smith@university.edu',
        subject: 'Research collaboration opportunity',
        message: 'I\'m interested in discussing potential collaboration on antimicrobial resistance research...',
        organization: 'University of Excellence',
      },
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Thank you! Your message has been sent successfully. I\'ll respond within 24-48 hours.',
      errors: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minLength: 'Too short - please provide more details',
        maxLength: 'Too long - please be more concise',
        rateLimited: 'Too many submissions. Please wait an hour before trying again.',
        network: 'Network error. Please check your connection and try again.',
        server: 'Server error. Please try again later or email directly.',
        recaptcha: 'Please complete the reCAPTCHA verification.',
      },
      privacy: 'Your information will be used solely for responding to your inquiry and will not be shared with third parties.',
      alternative: 'Alternatively, you can email me directly at',
    },
    es: {
      title: 'Ponte en Contacto',
      subtitle: 'Hablemos sobre colaboración en investigación, oportunidades o cualquier pregunta que tengas.',
      fields: {
        name: 'Nombre Completo',
        email: 'Dirección de Email',
        subject: 'Asunto',
        message: 'Mensaje',
        organization: 'Organización (opcional)',
      },
      placeholders: {
        name: 'Dr. Jane Smith',
        email: 'jane.smith@universidad.edu',
        subject: 'Oportunidad de colaboración en investigación',
        message: 'Estoy interesado en discutir una posible colaboración en investigación sobre resistencia antimicrobiana...',
        organization: 'Universidad de Excelencia',
      },
      submit: 'Enviar Mensaje',
      submitting: 'Enviando...',
      success: '¡Gracias! Tu mensaje se ha enviado exitosamente. Responderé en 24-48 horas.',
      errors: {
        required: 'Este campo es obligatorio',
        email: 'Por favor ingresa una dirección de email válida',
        minLength: 'Demasiado corto - por favor proporciona más detalles',
        maxLength: 'Demasiado largo - por favor sé más conciso',
        rateLimited: 'Demasiados envíos. Por favor espera una hora antes de intentar de nuevo.',
        network: 'Error de red. Por favor verifica tu conexión e intenta de nuevo.',
        server: 'Error del servidor. Por favor intenta más tarde o envía un email directamente.',
        recaptcha: 'Por favor completa la verificación reCAPTCHA.',
      },
      privacy: 'Tu información será utilizada únicamente para responder a tu consulta y no será compartida con terceros.',
      alternative: 'Alternativamente, puedes enviarme un email directamente a',
    },
    ca: {
      title: 'Posa\'t en Contacte',
      subtitle: 'Parlem sobre col·laboració en recerca, oportunitats o qualsevol pregunta que tinguis.',
      fields: {
        name: 'Nom Complet',
        email: 'Adreça d\'Email',
        subject: 'Assumpte',
        message: 'Missatge',
        organization: 'Organització (opcional)',
      },
      placeholders: {
        name: 'Dr. Jane Smith',
        email: 'jane.smith@universitat.edu',
        subject: 'Oportunitat de col·laboració en recerca',
        message: 'Estic interessat en discutir una possible col·laboració en recerca sobre resistència antimicrobiana...',
        organization: 'Universitat d\'Excel·lència',
      },
      submit: 'Enviar Missatge',
      submitting: 'Enviant...',
      success: 'Gràcies! El teu missatge s\'ha enviat amb èxit. Respondré en 24-48 hores.',
      errors: {
        required: 'Aquest camp és obligatori',
        email: 'Si us plau, introdueix una adreça d\'email vàlida',
        minLength: 'Massa curt - si us plau proporciona més detalls',
        maxLength: 'Massa llarg - si us plau sigues més concís',
        rateLimited: 'Massa enviaments. Si us plau espera una hora abans d\'intentar-ho de nou.',
        network: 'Error de xarxa. Si us plau verifica la teva connexió i intenta de nou.',
        server: 'Error del servidor. Si us plau intenta més tard o envia un email directament.',
        recaptcha: 'Si us plau completa la verificació reCAPTCHA.',
      },
      privacy: 'La teva informació serà utilitzada únicament per respondre a la teva consulta i no serà compartida amb tercers.',
      alternative: 'Alternativament, pots enviar-me un email directament a',
    },
  };

  const currentContent = content[lang];

  // Check rate limiting
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    const recentSubmissions = submissions.filter(
      (timestamp: number) => now - timestamp < RATE_LIMIT.windowMs
    );
    
    if (recentSubmissions.length >= RATE_LIMIT.maxSubmissions) {
      return false;
    }
    
    // Clean old submissions
    localStorage.setItem('contact_submissions', JSON.stringify(recentSubmissions));
    return true;
  };

  // Record submission
  const recordSubmission = () => {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    submissions.push(now);
    localStorage.setItem('contact_submissions', JSON.stringify(submissions));
  };

  // Real-time validation
  const validateField = (name: keyof ContactFormData, value: string) => {
    try {
      const fieldSchema = contactSchema.shape[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: undefined }
        }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: error.errors[0]?.message || 'Invalid input' }
        }));
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Security: Sanitize input
    const sanitizedValue = value.replace(/<[^>]*>/g, '').trim();
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Real-time validation with debouncing
    if (formState.errors[name as keyof ContactFormData]) {
      setTimeout(() => validateField(name as keyof ContactFormData, sanitizedValue), 300);
    }
  };

  // Handle field focus
  const handleFieldFocus = (fieldName: string) => {
    setFieldFocus(fieldName);
    
    // Clear field error when focused
    if (formState.errors[fieldName as keyof ContactFormData]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [fieldName]: undefined }
      }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFieldFocus('');
    validateField(name as keyof ContactFormData, value);
  };

  // Load reCAPTCHA
  useEffect(() => {
    const loadRecaptcha = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      // @ts-ignore
      window.onRecaptchaLoad = () => {
        // @ts-ignore
        window.grecaptcha.render('recaptcha-container', {
          sitekey: process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key
          callback: setRecaptchaToken,
          'expired-callback': () => setRecaptchaToken(''),
        });
      };
    };

    // Only load in browser environment
    if (typeof window !== 'undefined') {
      loadRecaptcha();
    }

    return () => {
      // @ts-ignore
      delete window.onRecaptchaLoad;
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check honeypot
    if (formData.website && formData.website.length > 0) {
      // Bot detected - fail silently
      setFormState({
        status: 'success',
        message: currentContent.success,
        errors: {},
        submitCount: 0,
        lastSubmit: Date.now(),
      });
      return;
    }
    
    // Rate limiting check
    if (!checkRateLimit()) {
      setFormState(prev => ({
        ...prev,
        status: 'rate_limited',
        message: currentContent.errors.rateLimited,
      }));
      return;
    }

    setFormState(prev => ({ ...prev, status: 'validating', errors: {} }));

    try {
      // Validate all fields
      const validatedData = contactSchema.parse(formData);
      
      // Check reCAPTCHA
      if (!recaptchaToken) {
        throw new Error('recaptcha');
      }

      // Check if form submission is enabled
      if (!isFeatureEnabled('enableFormSubmission')) {
        console.warn('Form submission disabled in current environment');
        setFormState({
          status: 'success',
          message: currentContent.success + ' (Development mode: form not actually sent)',
          errors: {},
          submitCount: 0,
          lastSubmit: Date.now(),
        });
        return;
      }

      setFormState(prev => ({ ...prev, status: 'submitting' }));

      const endpoint = getApiEndpoint('contact');
      
      // Handle different endpoint types (local vs external service)
      let response: Response;
      
      if (endpoint.startsWith('/api/')) {
        // Local API - full JSON payload
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Recaptcha-Token': recaptchaToken,
          },
          body: JSON.stringify({
            ...validatedData,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: lang,
          }),
        });
      } else {
        // External service (like Formspree) - use FormData for compatibility
        const formData = new FormData();
        Object.entries(validatedData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('timestamp', new Date().toISOString());
        formData.append('language', lang);
        
        response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Success
      recordSubmission();
      setFormState({
        status: 'success',
        message: currentContent.success,
        errors: {},
        submitCount: 0,
        lastSubmit: Date.now(),
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        organization: '',
        website: '',
      });
      
      // Reset reCAPTCHA
      // @ts-ignore
      if (window.grecaptcha) {
        // @ts-ignore
        window.grecaptcha.reset();
        setRecaptchaToken('');
      }
      
      onSuccess?.();

    } catch (error) {
      let errorMessage = currentContent.errors.server;
      let errors: Partial<Record<keyof ContactFormData, string>> = {};

      if (error instanceof z.ZodError) {
        // Validation errors
        error.errors.forEach(err => {
          const field = err.path[0] as keyof ContactFormData;
          errors[field] = err.message;
        });
        errorMessage = 'Please correct the errors below.';
      } else if (error instanceof Error) {
        if (error.message === 'recaptcha') {
          errorMessage = currentContent.errors.recaptcha;
        } else if (error.message.includes('HTTP')) {
          errorMessage = currentContent.errors.server;
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = currentContent.errors.network;
        }
      }

      setFormState(prev => ({
        ...prev,
        status: 'error',
        message: errorMessage,
        errors,
      }));
      
      onError?.(errorMessage);
    }
  };

  // Animations
  useEffect(() => {
    if (formState.status === 'success' && successMessageRef.current) {
      gsap.fromTo(successMessageRef.current, 
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
    
    if (formState.status === 'error' && errorMessageRef.current) {
      gsap.fromTo(errorMessageRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [formState.status]);

  // Button loading animation
  useEffect(() => {
    if (submitButtonRef.current) {
      if (formState.status === 'submitting') {
        gsap.to(submitButtonRef.current, { scale: 0.95, duration: 0.1 });
      } else {
        gsap.to(submitButtonRef.current, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
      }
    }
  }, [formState.status]);

  const isSubmitting = formState.status === 'submitting' || formState.status === 'validating';
  const isDisabled = isSubmitting || formState.status === 'rate_limited';

  return (
    <section className={`py-16 bg-gradient-to-b from-gray-900 to-black ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
            {currentContent.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Success Message */}
        {formState.status === 'success' && (
          <div
            ref={successMessageRef}
            className="mb-8 p-6 bg-green-900/30 border border-green-500/30 rounded-xl"
            role="alert"
          >
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-300">{formState.message}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {formState.status === 'error' && (
          <div
            ref={errorMessageRef}
            className="mb-8 p-6 bg-red-900/30 border border-red-500/30 rounded-xl"
            role="alert"
          >
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300">{formState.message}</p>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  {currentContent.fields.name} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleFieldFocus('name')}
                  onBlur={handleFieldBlur}
                  placeholder={currentContent.placeholders.name}
                  className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formState.errors.name 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : fieldFocus === 'name' 
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-gray-600 focus:ring-red-500/50 hover:border-gray-500'
                  }`}
                  disabled={isDisabled}
                  required
                  autoComplete="name"
                />
                {formState.errors.name && (
                  <p className="text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formState.errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  {currentContent.fields.email} <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={handleFieldBlur}
                  placeholder={currentContent.placeholders.email}
                  className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formState.errors.email 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : fieldFocus === 'email' 
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-gray-600 focus:ring-red-500/50 hover:border-gray-500'
                  }`}
                  disabled={isDisabled}
                  required
                  autoComplete="email"
                />
                {formState.errors.email && (
                  <p className="text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formState.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Organization Field (Optional) */}
            <div className="mb-6 space-y-2">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-200">
                {currentContent.fields.organization}
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('organization')}
                onBlur={handleFieldBlur}
                placeholder={currentContent.placeholders.organization}
                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  fieldFocus === 'organization' 
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600 focus:ring-red-500/50 hover:border-gray-500'
                }`}
                disabled={isDisabled}
                autoComplete="organization"
              />
            </div>

            {/* Subject Field */}
            <div className="mb-6 space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-200">
                {currentContent.fields.subject} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('subject')}
                onBlur={handleFieldBlur}
                placeholder={currentContent.placeholders.subject}
                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  formState.errors.subject 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : fieldFocus === 'subject' 
                      ? 'border-red-500 focus:ring-red-500/50'
                      : 'border-gray-600 focus:ring-red-500/50 hover:border-gray-500'
                }`}
                disabled={isDisabled}
                required
              />
              {formState.errors.subject && (
                <p className="text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formState.errors.subject}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="mb-6 space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-200">
                {currentContent.fields.message} <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('message')}
                onBlur={handleFieldBlur}
                placeholder={currentContent.placeholders.message}
                rows={6}
                className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                  formState.errors.message 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : fieldFocus === 'message' 
                      ? 'border-red-500 focus:ring-red-500/50'
                      : 'border-gray-600 focus:ring-red-500/50 hover:border-gray-500'
                }`}
                disabled={isDisabled}
                required
              />
              <div className="flex justify-between items-center">
                {formState.errors.message ? (
                  <p className="text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formState.errors.message}
                  </p>
                ) : (
                  <div></div>
                )}
                <span className={`text-sm ${formData.message.length > 1800 ? 'text-red-400' : 'text-gray-400'}`}>
                  {formData.message.length}/2000
                </span>
              </div>
            </div>

            {/* Honeypot Field (Hidden) */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* reCAPTCHA */}
            <div className="mb-6">
              <div id="recaptcha-container" className="flex justify-center"></div>
            </div>

            {/* Submit Button */}
            <button
              ref={submitButtonRef}
              type="submit"
              disabled={isDisabled}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 ${
                isDisabled
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {currentContent.submitting}
                </span>
              ) : (
                currentContent.submit
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {currentContent.privacy}
            </p>
            <p className="text-sm text-gray-400">
              {currentContent.alternative}{' '}
              <a 
                href="mailto:ramon.roca@example.com" 
                className="text-red-400 hover:text-red-300 transition-colors underline"
              >
                ramon.roca@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;