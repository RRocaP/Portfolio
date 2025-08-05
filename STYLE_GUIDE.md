# Component Style Guide

## Overview
This document outlines the coding standards, patterns, and best practices for components in the portfolio website.

## Component Architecture

### Astro Components (.astro)
Used for:
- Server-side rendered content
- Static layouts and structures
- SEO-optimized pages
- Components that don't require client-side interactivity

```astro
---
// Component script (runs on server)
export interface Props {
  title: string;
  optional?: boolean;
}

const { title, optional = false } = Astro.props;
---

<!-- Component template -->
<div class="component">
  <h2>{title}</h2>
  {optional && <p>Optional content</p>}
</div>

<style>
  .component {
    /* Component-specific styles */
  }
</style>
```

### React Components (.tsx)
Used for:
- Interactive components requiring state
- Complex user interactions
- Data visualizations with D3.js
- Components needing lifecycle methods

```tsx
import { useState, useEffect } from 'react';

interface ComponentProps {
  data: DataType[];
  onInteraction?: (item: DataType) => void;
}

export function InteractiveComponent({ data, onInteraction }: ComponentProps) {
  const [state, setState] = useState<ComponentState>({});

  useEffect(() => {
    // Component initialization
  }, []);

  return (
    <div className="interactive-component">
      {/* Component content */}
    </div>
  );
}
```

## Naming Conventions

### Files
- **Astro components**: PascalCase with `.astro` extension
- **React components**: PascalCase with `.tsx` extension
- **Utilities**: camelCase with `.ts` extension
- **Types**: camelCase with `.ts` extension

### CSS Classes
- Use BEM methodology: `block__element--modifier`
- Component prefix: `component-name__element`
- Utility classes: `u-utility-name`

### Props and Variables
- Use descriptive camelCase names
- Boolean props should be questions: `isVisible`, `hasError`
- Event handlers: `onAction`, `handleEvent`

## TypeScript Guidelines

### Interface Definitions
```typescript
// Always define interfaces for props
interface ComponentProps {
  // Required props first
  title: string;
  data: DataItem[];
  
  // Optional props with default values
  variant?: 'primary' | 'secondary';
  isDisabled?: boolean;
  
  // Event handlers
  onClick?: (event: MouseEvent) => void;
}

// Extend interfaces when appropriate
interface ExtendedProps extends ComponentProps {
  additionalProp: string;
}
```

### Type Guards
```typescript
// Use type guards for runtime validation
function isValidData(data: unknown): data is DataItem[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item
  );
}
```

## Styling Guidelines

### CSS Custom Properties
```css
:root {
  /* Use semantic naming */
  --color-primary: #da291c;
  --color-secondary: #ffd93d;
  
  /* Component-specific variables */
  --component-padding: var(--space-md);
  --component-border-radius: 8px;
}
```

### Responsive Design
```css
.component {
  /* Mobile-first approach */
  padding: var(--space-sm);
  
  /* Tablet and up */
  @media (min-width: 768px) {
    padding: var(--space-md);
  }
  
  /* Desktop and up */
  @media (min-width: 1024px) {
    padding: var(--space-lg);
  }
}
```

### Animation Guidelines
```css
.component {
  /* Use consistent easing */
  transition: all 0.2s ease-in-out;
  
  /* Prefer transform over position changes */
  &:hover {
    transform: translateY(-2px);
  }
  
  /* Respect user preferences */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
}
```

## Accessibility Standards

### Semantic HTML
```astro
<!-- Use appropriate semantic elements -->
<article class="publication-card">
  <header>
    <h3>{title}</h3>
    <time datetime={year}>{year}</time>
  </header>
  <main>
    <p>{description}</p>
  </main>
</article>
```

### ARIA Labels
```tsx
<button 
  aria-label={`View details for ${publication.title}`}
  aria-expanded={isExpanded}
  onClick={handleToggle}
>
  {isExpanded ? 'Hide' : 'Show'} Details
</button>
```

### Focus Management
```css
.interactive-element {
  /* Visible focus indicators */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  /* Remove default focus styles for mouse users */
  &:focus:not(:focus-visible) {
    outline: none;
  }
}
```

## Performance Best Practices

### Component Optimization
```tsx
// Use React.memo for expensive components
export const ExpensiveComponent = memo(({ data }: Props) => {
  // Heavy computation or rendering
}, (prevProps, nextProps) => {
  // Custom comparison function if needed
  return prevProps.data === nextProps.data;
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => expensiveProcessing(item));
}, [data]);
```

### Image Optimization
```astro
<!-- Use appropriate image formats and sizes -->
<img 
  src="/images/optimized-image.webp"
  alt="Descriptive alt text"
  width="400"
  height="300"
  loading="lazy"
  decoding="async"
/>
```

## Testing Guidelines

### Component Tests
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders with required props', () => {
    render(<Component title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    render(<Component title="Test" onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Accessibility Tests
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Component title="Test" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Error Handling

### React Error Boundaries
```tsx
class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Graceful Degradation
```tsx
function DataVisualization({ data }: Props) {
  if (!data || data.length === 0) {
    return <EmptyState message="No data available" />;
  }
  
  try {
    return <ComplexVisualization data={data} />;
  } catch (error) {
    console.error('Visualization error:', error);
    return <SimpleTable data={data} />;
  }
}
```

## File Organization

```
src/
├── components/
│   ├── ui/              # Basic UI components
│   ├── layout/          # Layout components
│   ├── visualization/   # Data visualization components
│   └── forms/           # Form components
├── layouts/             # Page layouts
├── pages/               # Route pages
├── utils/               # Utility functions
├── types/               # TypeScript definitions
├── styles/              # Global styles
└── test/                # Test utilities and setup
```

## Code Review Checklist

- [ ] Component follows naming conventions
- [ ] TypeScript interfaces are properly defined
- [ ] Accessibility requirements are met
- [ ] Performance best practices are followed
- [ ] Tests are written and passing
- [ ] Error handling is implemented
- [ ] Documentation is updated
- [ ] Responsive design is considered
- [ ] Browser compatibility is maintained