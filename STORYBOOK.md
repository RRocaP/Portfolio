# Storybook Design System Documentation

This document describes the Storybook setup for the portfolio design system, providing a living style guide for all components, patterns, and design tokens.

## Overview

The Storybook instance showcases the portfolio's design system with:

- **Core Components**: Button, Card, Typography, Layout
- **Design Tokens**: Colors, typography scale, spacing
- **Accessibility Testing**: Built-in a11y addon for WCAG compliance
- **Interactive Testing**: Component playground with live editing
- **Documentation**: Auto-generated docs with TypeScript integration

## Quick Start

### Development

```bash
# Start Storybook development server
npm run storybook

# Visit http://localhost:6006
```

### Building

```bash
# Build static Storybook
npm run build-storybook

# Serve built Storybook locally
npm run storybook:serve
```

## Project Structure

```
src/stories/
├── design-system/
│   ├── Button.tsx              # Button component
│   ├── Button.stories.tsx      # Button stories
│   ├── Card.tsx               # Card component
│   ├── Card.stories.tsx       # Card stories
│   ├── Typography.tsx         # Typography component
│   ├── Typography.stories.tsx # Typography stories
│   ├── Layout.tsx            # Layout components
│   ├── Layout.stories.tsx    # Layout stories
│   ├── DesignTokens.stories.tsx # Design tokens showcase
│   └── Overview.stories.tsx   # System overview
├── assets/                    # Static assets for stories
└── ...

.storybook/
├── main.ts                   # Storybook configuration
├── preview.ts                # Global preview settings
└── vitest.setup.ts          # Testing setup
```

## Component Development

### Creating New Stories

1. **Create the component** in `src/stories/design-system/`
2. **Create stories file** with `.stories.tsx` extension
3. **Follow the naming convention**: `ComponentName.stories.tsx`

Example story structure:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Design System/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls here
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

### TypeScript Integration

- All components use TypeScript with comprehensive type definitions
- Props are automatically documented in Storybook
- Type safety ensures reliable component APIs

### Accessibility Testing

- Built-in a11y addon checks WCAG compliance
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation

## Design System Guidelines

### Colors

The portfolio uses a dark theme with carefully selected colors:

- **Primary Background**: `#000000`
- **Surface Colors**: `#111111`, `#181818`
- **Accent Yellow**: `#FFD300`
- **Text Colors**: `#F3F3F3`, `#B8B8B8`

### Typography

Typography scale with Inter font family:

- **Display**: XL (4.5rem) → SM (2.25rem)
- **Heading**: XL (2rem) → SM (1.25rem)
- **Body**: XL (1.25rem) → SM (0.875rem)

### Layout

- **12-column grid system** for complex layouts
- **Auto-grid** for equal-width responsive columns
- **Container system** with max-width constraints
- **Consistent spacing** using Tailwind's scale

## Deployment

### Automatic Deployment

Storybook is automatically deployed to GitHub Pages when:

- Code is pushed to the `main` branch
- Changes are made to components, stories, or styles
- Manual workflow trigger

### Manual Deployment

```bash
# Build and deploy manually
npm run build-storybook

# Upload the storybook-static/ directory to your hosting service
```

### GitHub Pages Setup

1. **Enable GitHub Pages** in repository settings
2. **Configure source** to GitHub Actions
3. **Push changes** to trigger deployment
4. **Access Storybook** at `https://[username].github.io/[repository]/`

## Available Scripts

| Script                    | Description              |
| ------------------------- | ------------------------ |
| `npm run storybook`       | Start development server |
| `npm run build-storybook` | Build static files       |
| `npm run storybook:serve` | Build and serve locally  |

## Configuration

### Storybook Configuration (`.storybook/main.ts`)

- **Framework**: React with Vite
- **Addons**: Docs, A11y, Onboarding, Vitest
- **PostCSS**: Tailwind CSS integration
- **TypeScript**: React docgen for prop extraction

### Preview Configuration (`.storybook/preview.ts`)

- **Global styles**: Imports portfolio CSS
- **Background options**: Dark, light, surface variants
- **A11y testing**: Enabled with violation reporting
- **Theme switcher**: Light/dark theme toggle

## Testing

### Visual Testing

- **Component isolation**: Test components in different states
- **Responsive testing**: Preview across viewport sizes
- **Accessibility audits**: Automated a11y checks
- **Interactive testing**: Component playground

### Vitest Integration

```bash
# Run component tests
npx vitest

# Test coverage
npx vitest --coverage
```

## Contributing

### Adding New Components

1. **Follow design system principles**
2. **Include comprehensive TypeScript types**
3. **Create multiple story variants**
4. **Add accessibility features**
5. **Test across different states**
6. **Document usage guidelines**

### Code Standards

- **TypeScript**: All components use TypeScript
- **Tailwind CSS**: Use design system tokens
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Include component tests
- **Documentation**: Clear prop descriptions

## Troubleshooting

### Common Issues

**Tailwind not working**:

- Check `postcss.config.cjs` configuration
- Verify CSS imports in `.storybook/preview.ts`

**TypeScript errors**:

- Ensure `.tsx` extension for JSX files
- Check type definitions are complete

**Build failures**:

- Verify all dependencies are installed
- Check for syntax errors in stories

### Performance

- **Code splitting**: Components load on-demand
- **Optimized assets**: Images and fonts compressed
- **Tree shaking**: Unused code eliminated
- **Caching**: Static assets cached effectively

## Links

- **Storybook Documentation**: [storybook.js.org](https://storybook.js.org)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Accessibility Guidelines**: [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- **Portfolio Repository**: Link to main repository

---

This Storybook instance serves as the single source of truth for the portfolio's design system, ensuring consistency and accessibility across all components.
