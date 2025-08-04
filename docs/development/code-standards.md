# Code Standards and Style Guide

This document outlines the coding standards, style guidelines, and best practices for the Ramon Roca Pinilla academic portfolio project.

## 📋 Table of Contents

- [Overview](#overview)
- [TypeScript Standards](#typescript-standards)
- [React Component Standards](#react-component-standards)
- [Astro Component Standards](#astro-component-standards)
- [CSS and Styling Standards](#css-and-styling-standards)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Code Formatting](#code-formatting)
- [Linting Configuration](#linting-configuration)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Standards](#accessibility-standards)
- [Testing Standards](#testing-standards)

## 🎯 Overview

This project maintains high code quality standards to ensure maintainability, performance, and professional presentation. All code must:

- Follow TypeScript strict mode
- Pass ESLint and Prettier checks
- Maintain WCAG 2.1 AA accessibility compliance
- Follow established naming conventions
- Include appropriate documentation

## 📘 TypeScript Standards

### Configuration

The project uses strict TypeScript configuration (`tsconfig.json`):

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions

#### Always Provide Explicit Types

```typescript
// ✅ Good - Explicit types
interface UserData {
  name: string;
  email: string;
  isActive: boolean;
}

function processUser(userData: UserData): string {
  return `${userData.name} (${userData.email})`;
}

// ❌ Bad - Implicit any
function processUser(userData) {
  return `${userData.name} (${userData.email})`;
}
```

#### Use Interfaces for Object Shapes

```typescript
// ✅ Good - Interface for component props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// ✅ Good - Interface for data structures
interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url?: string;
}
```

#### Use Union Types Instead of Enums

```typescript
// ✅ Good - Const assertion with union type
const THEME_OPTIONS = ['light', 'dark', 'system'] as const;
type Theme = (typeof THEME_OPTIONS)[number];

// ✅ Good - String literal union
type ButtonVariant = 'primary' | 'secondary' | 'danger';

// ❌ Avoid - Enums
enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}
```

#### Generic Type Constraints

```typescript
// ✅ Good - Proper generic constraints
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

function fetchData<T extends Record<string, unknown>>(
  endpoint: string
): Promise<ApiResponse<T>> {
  // Implementation
}
```

## ⚛️ React Component Standards

### Function Component Declaration

```typescript
// ✅ Good - Function declaration with explicit props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
```

### Hooks Usage

```typescript
// ✅ Good - Proper hooks usage
function ProteinVisualization({ proteinId }: { proteinId: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [proteinData, setProteinData] = useState<ProteinStructure | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProtein() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProteinStructure(proteinId);
        if (!cancelled) {
          setProteinData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load protein'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProtein();

    return () => {
      cancelled = true;
    };
  }, [proteinId]);

  // Component render logic...
}
```

### Event Handlers

```typescript
// ✅ Good - Explicit event handler types
interface FormProps {
  onSubmit: (data: FormData) => void;
}

function ContactForm({ onSubmit }: FormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle input change
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInputChange} />
    </form>
  );
}
```

## 🚀 Astro Component Standards

### Component Structure

```astro
---
// Props interface
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'hero' | 'compact';
}

// Destructure props with defaults
const { title, description, variant = 'default' } = Astro.props;

// Any server-side logic
const isHero = variant === 'hero';
---

<!-- Component template -->
<section class={`section section-${variant}`} class:list={{ hero: isHero }}>
  <h2>{title}</h2>
  {description && <p class="description">{description}</p>}
  <slot />
</section>

<style>
  /* Scoped styles */
  .section {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .section-hero {
    padding: var(--spacing-xl);
    background: var(--gradient-primary);
  }

  .description {
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
  }

  /* Responsive styles */
  @media (min-width: 768px) {
    .section {
      padding: var(--spacing-lg);
    }
  }
</style>
```

### Slot Usage

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<article class="card">
  <header class="card-header">
    <h3>{title}</h3>
    <slot name="header-actions" />
  </header>

  <div class="card-content">
    <slot />
  </div>

  <footer class="card-footer">
    <slot name="footer" />
  </footer>
</article>
```

## 🎨 CSS and Styling Standards

### CSS Custom Properties

```css
/* ✅ Good - Use CSS custom properties for theming */
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;

  /* Text colors */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* Borders */
  --border-radius: 0.375rem;
  --border-width: 1px;
  --border-color: #e2e8f0;
}
```

### Tailwind CSS Usage

```tsx
// ✅ Good - Semantic class combinations
function Button({ variant, size, children }: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
}
```

### Responsive Design

```css
/* ✅ Good - Mobile-first responsive design */
.hero {
  padding: var(--spacing-md);
  text-align: center;
}

/* Tablet and up */
@media (min-width: 768px) {
  .hero {
    padding: var(--spacing-lg);
    text-align: left;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .hero {
    padding: var(--spacing-xl);
  }
}
```

## 📁 File Organization

### Directory Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── feature/        # Feature-specific components
├── pages/              # Astro pages
├── layouts/            # Page layouts
├── data/               # Static data and content
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── i18n/               # Internationalization files
```

### Component Files

```
components/
├── Button/
│   ├── Button.tsx        # Main component
│   ├── Button.stories.tsx # Storybook stories
│   ├── Button.test.tsx   # Tests (if applicable)
│   └── index.ts          # Export barrel
```

## 🏷️ Naming Conventions

### Files and Directories

```
# Components: PascalCase
Navigation.astro
Button.tsx
ProteinVisualization.tsx

# Pages: lowercase with hyphens
index.astro
about.astro
research-projects.astro

# Utilities: camelCase
animations.ts
proteinVisualization.ts
generateOgImage.js

# Types: PascalCase with .types.ts suffix
protein-visualization.types.ts
api-response.types.ts

# Styles: lowercase with hyphens
global.css
component-styles.css
```

### Variables and Functions

```typescript
// ✅ Good - camelCase for variables and functions
const proteinData = await fetchProteinStructure();
const isLoading = false;
const handleSubmit = () => {};

// ✅ Good - PascalCase for components and classes
const ProteinVisualization = () => {};
class ApiClient {}

// ✅ Good - UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ Good - PascalCase for types and interfaces
interface UserData {}
type ApiResponse<T> = {};
```

## 🔧 Code Formatting

### Prettier Configuration

The project uses Prettier with this configuration (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### ESLint Configuration

Key ESLint rules (`eslint.config.mjs`):

```javascript
export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off', // Allowed for debugging
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
```

## ⚡ Performance Guidelines

### Bundle Size Management

```typescript
// ✅ Good - Dynamic imports for code splitting
const ProteinVisualization = lazy(() => import('./ProteinVisualization'));

// ✅ Good - Tree-shaking friendly imports
import { debounce } from 'lodash-es';

// ❌ Bad - Importing entire library
import _ from 'lodash';
```

### Image Optimization

```astro
---
// ✅ Good - Optimized images
import { Image } from 'astro:assets';
import profileImage from '../assets/profile.jpg';
---

<Image
  src={profileImage}
  alt="Ramon Roca Pinilla"
  width={400}
  height={400}
  loading="lazy"
  decoding="async"
/>
```

### CSS Performance

```css
/* ✅ Good - Efficient CSS */
.component {
  /* Use transform and opacity for animations */
  transform: translateX(0);
  opacity: 1;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.component.hidden {
  transform: translateX(-100%);
  opacity: 0;
}

/* ❌ Bad - Avoid animating layout properties */
.component {
  left: 0;
  transition: left 0.3s ease;
}
```

## ♿ Accessibility Standards

### Semantic HTML

```tsx
// ✅ Good - Semantic structure
function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        <li>
          <a href="/" aria-current="page">
            Home
          </a>
        </li>
        <li>
          <a href="/research">Research</a>
        </li>
        <li>
          <a href="/publications">Publications</a>
        </li>
      </ul>
    </nav>
  );
}
```

### ARIA Labels and Descriptions

```tsx
// ✅ Good - Proper ARIA usage
function SearchForm() {
  return (
    <form role="search" aria-label="Search publications">
      <label htmlFor="search-input" className="sr-only">
        Search publications
      </label>
      <input
        id="search-input"
        type="search"
        placeholder="Search publications..."
        aria-describedby="search-help"
      />
      <p id="search-help" className="sr-only">
        Search through research publications by title, author, or keyword
      </p>
      <button type="submit" aria-label="Submit search">
        <SearchIcon aria-hidden="true" />
      </button>
    </form>
  );
}
```

### Focus Management

```typescript
// ✅ Good - Proper focus management
function Modal({ isOpen, onClose }: ModalProps) {
  const previousFocusRef = useRef<HTMLElement>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      {/* Modal content */}
    </div>
  );
}
```

## 🧪 Testing Standards

### Component Testing

```typescript
// Example component test structure
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Testing

```typescript
// Example accessibility test
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## 📝 Documentation Standards

### JSDoc Comments

````typescript
/**
 * Generates protein visualization frames for animation
 *
 * @param proteinData - The protein structure data in PDB format
 * @param frameCount - Number of animation frames to generate (default: 30)
 * @param rotationAxis - Axis of rotation for the animation ('x' | 'y' | 'z')
 * @returns Promise that resolves to an array of animation frames
 *
 * @example
 * ```typescript
 * const frames = await generateProteinFrames(proteinData, 60, 'y');
 * console.log(`Generated ${frames.length} frames`);
 * ```
 */
async function generateProteinFrames(
  proteinData: ProteinStructure,
  frameCount: number = 30,
  rotationAxis: 'x' | 'y' | 'z' = 'y'
): Promise<AnimationFrame[]> {
  // Implementation
}
````

### Component Documentation

````typescript
/**
 * A reusable button component with multiple variants and sizes.
 * Follows WCAG 2.1 AA accessibility guidelines.
 *
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Submit Form
 * </Button>
 * ```
 */
interface ButtonProps {
  /** The button content */
  children: React.ReactNode;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
````

## 🔄 Quality Assurance Workflow

Before committing code:

1. **Run Preflight Checks**:

   ```bash
   npm run preflight
   ```

2. **Individual Checks**:

   ```bash
   npm run test:content  # Content validation
   npm run check:types   # TypeScript checking
   npm run lint         # ESLint
   npm run format:check # Prettier
   npm run build        # Build verification
   ```

3. **Storybook Testing**:
   ```bash
   npm run storybook
   # Verify components render correctly
   # Test accessibility with a11y addon
   ```

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Astro Documentation](https://docs.astro.build/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

These standards ensure consistent, maintainable, and high-quality code across the academic portfolio project. All contributors are expected to follow these guidelines to maintain the professional standards of the project.
