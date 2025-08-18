/**
 * Form Validation Utility with Accessibility Support
 * Implements real-time validation with ARIA live regions
 */

export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

export interface ValidationConfig {
  rules: Record<string, ValidationRule[]>;
  debounceTime?: number;
  liveRegion?: boolean;
  focusOnError?: boolean;
}

export interface FormField {
  name: string;
  value: string;
  errors: string[];
  touched: boolean;
  valid: boolean;
}

/**
 * Debounce utility for input validation
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value: string) => value.trim().length > 0,
    message
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters`
  }),
  
  pattern: (pattern: RegExp, message = 'Invalid format'): ValidationRule => ({
    test: (value: string) => pattern.test(value),
    message
  }),
  
  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    test: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),
  
  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    test: (value: string) => /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
    message
  })
};

/**
 * Form Validator Class
 */
export class FormValidator {
  private fields: Map<string, FormField> = new Map();
  private config: ValidationConfig;
  private liveRegion: HTMLElement | null = null;
  private validateDebounced: (fieldName: string, value: string) => void;

  constructor(config: ValidationConfig) {
    this.config = {
      debounceTime: 300,
      liveRegion: true,
      focusOnError: true,
      ...config
    };
    
    this.validateDebounced = debounce(
      this.validateField.bind(this),
      this.config.debounceTime || 300
    );
    
    if (this.config.liveRegion) {
      this.createLiveRegion();
    }
  }

  /**
   * Create ARIA live region for screen reader announcements
   */
  private createLiveRegion(): void {
    if (typeof document === 'undefined') return;
    
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only'; // Screen reader only
    this.liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Announce message to screen readers
   */
  private announce(message: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  /**
   * Initialize form field
   */
  initField(name: string, initialValue: string = ''): void {
    this.fields.set(name, {
      name,
      value: initialValue,
      errors: [],
      touched: false,
      valid: true
    });
  }

  /**
   * Validate a single field
   */
  validateField(fieldName: string, value: string): FormField {
    const rules = this.config.rules[fieldName] || [];
    const errors: string[] = [];
    
    for (const rule of rules) {
      if (!rule.test(value)) {
        errors.push(rule.message);
      }
    }
    
    const field: FormField = {
      name: fieldName,
      value,
      errors,
      touched: true,
      valid: errors.length === 0
    };
    
    this.fields.set(fieldName, field);
    
    // Announce first error to screen readers
    if (errors.length > 0 && this.config.liveRegion) {
      this.announce(`${fieldName}: ${errors[0]}`);
    }
    
    return field;
  }

  /**
   * Handle input change with debounced validation
   */
  handleChange(fieldName: string, value: string): void {
    // Update value immediately
    const field = this.fields.get(fieldName) || this.initField(fieldName, value);
    this.fields.set(fieldName, { ...field, value });
    
    // Validate with debounce
    this.validateDebounced(fieldName, value);
  }

  /**
   * Handle field blur (mark as touched)
   */
  handleBlur(fieldName: string): void {
    const field = this.fields.get(fieldName);
    if (field) {
      this.fields.set(fieldName, { ...field, touched: true });
      this.validateField(fieldName, field.value);
    }
  }

  /**
   * Validate entire form
   */
  validateForm(): boolean {
    let isValid = true;
    const firstError: { field: string; element: HTMLElement | null } | null = null;
    
    for (const [fieldName, field] of this.fields) {
      const validated = this.validateField(fieldName, field.value);
      if (!validated.valid) {
        isValid = false;
        
        // Focus first error field
        if (this.config.focusOnError && !firstError) {
          const element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
          if (element) {
            element.focus();
            this.announce(`Please fix the error in ${fieldName}: ${validated.errors[0]}`);
          }
        }
      }
    }
    
    return isValid;
  }

  /**
   * Get field state
   */
  getField(fieldName: string): FormField | undefined {
    return this.fields.get(fieldName);
  }

  /**
   * Get all fields
   */
  getFields(): FormField[] {
    return Array.from(this.fields.values());
  }

  /**
   * Reset form
   */
  reset(): void {
    this.fields.clear();
  }

  /**
   * Apply validation to HTML form
   */
  attachToForm(formElement: HTMLFormElement): void {
    // Add novalidate to use custom validation
    formElement.setAttribute('novalidate', 'true');
    
    // Handle all inputs
    const inputs = formElement.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const field = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const fieldName = field.name;
      
      if (!fieldName) return;
      
      // Initialize field
      this.initField(fieldName, field.value);
      
      // Add event listeners
      field.addEventListener('input', () => {
        this.handleChange(fieldName, field.value);
        this.updateFieldUI(field);
      });
      
      field.addEventListener('blur', () => {
        this.handleBlur(fieldName);
        this.updateFieldUI(field);
      });
    });
    
    // Handle form submission
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (this.validateForm()) {
        // Form is valid, dispatch custom event
        const event = new CustomEvent('validSubmit', {
          detail: { fields: this.getFields() }
        });
        formElement.dispatchEvent(event);
      }
    });
  }

  /**
   * Update field UI based on validation state
   */
  private updateFieldUI(field: HTMLElement): void {
    const fieldName = (field as HTMLInputElement).name;
    const fieldState = this.getField(fieldName);
    
    if (!fieldState) return;
    
    // Update ARIA attributes
    if (fieldState.errors.length > 0 && fieldState.touched) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `${fieldName}-error`);
      
      // Update or create error message element
      let errorElement = document.getElementById(`${fieldName}-error`);
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${fieldName}-error`;
        errorElement.className = 'field-error';
        errorElement.setAttribute('role', 'alert');
        field.parentElement?.appendChild(errorElement);
      }
      errorElement.textContent = fieldState.errors[0];
      
      // Add error styling
      field.classList.add('error');
      field.classList.remove('valid');
    } else if (fieldState.touched && fieldState.valid) {
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('aria-describedby');
      
      // Remove error message
      const errorElement = document.getElementById(`${fieldName}-error`);
      if (errorElement) {
        errorElement.remove();
      }
      
      // Add valid styling
      field.classList.remove('error');
      field.classList.add('valid');
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.liveRegion) {
      this.liveRegion.remove();
    }
    this.fields.clear();
  }
}

/**
 * Create form validator instance
 */
export function createFormValidator(config: ValidationConfig): FormValidator {
  return new FormValidator(config);
}

/**
 * React hook for form validation
 */
export function useFormValidation(config: ValidationConfig) {
  const validatorRef = { current: new FormValidator(config) };
  
  return {
    validator: validatorRef.current,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      validatorRef.current.handleChange(e.target.name, e.target.value);
    },
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      validatorRef.current.handleBlur(e.target.name);
    },
    validateForm: () => validatorRef.current.validateForm(),
    getField: (name: string) => validatorRef.current.getField(name),
    reset: () => validatorRef.current.reset()
  };
}