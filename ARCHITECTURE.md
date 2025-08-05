# Portfolio Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance](#performance)
- [Security](#security)
- [Contributing](#contributing)

## Overview

This is a modern portfolio website built with Astro, React, and TypeScript, featuring:
- **Static Site Generation** for optimal performance
- **Multilingual Support** (English, Spanish, Catalan)
- **Interactive Visualizations** using D3.js and custom React components
- **Responsive Design** with modern CSS and animations
- **Comprehensive Testing** with Vitest
- **Automated Quality Checks** with ESLint and TypeScript

## Architecture

### Technology Stack
- **Framework**: Astro 5.x (Static Site Generator)
- **UI Library**: React 19.x
- **Language**: TypeScript (Strict Mode)
- **Styling**: CSS Custom Properties + CSS Modules
- **Data Visualization**: D3.js
- **Testing**: Vitest + Testing Library
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── *.astro         # Astro components
│   └── *.tsx           # React components
├── layouts/            # Page layouts
├── pages/              # Route pages
│   ├── en/            # English pages
│   ├── es/            # Spanish pages
│   └── ca/            # Catalan pages
├── data/              # Static data
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── styles/            # Global styles
└── test/              # Test files
```

### Component Architecture
- **Astro Components**: Server-side rendered static components
- **React Components**: Client-side interactive components (marked with client:* directives)
- **Layouts**: Shared page templates with SEO optimization
- **Data Layer**: Static imports for publications and content

## Development

### Prerequisites
- Node.js 20+
- npm 8+

### Setup
```bash
npm install
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint with auto-fix
npm run lint:check   # Check linting without fixes
npm run type-check   # Run TypeScript checks
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run audit        # Security audit
```

### Code Quality Standards
- **ESLint**: Comprehensive rules for code quality and consistency
- **TypeScript**: Strict mode with additional checks
- **Prettier**: Code formatting (if configured)
- **Conventional Commits**: Standardized commit messages

## Testing

### Testing Strategy
- **Unit Tests**: Individual component and utility testing
- **Integration Tests**: Data flow and component interaction
- **Coverage Targets**: 70% minimum across all metrics

### Test Structure
```bash
src/test/
├── setup.ts           # Test environment setup
├── data.test.ts       # Data validation tests
└── *.test.{ts,tsx}    # Component and utility tests
```

### Running Tests
```bash
npm run test           # Run all tests
npm run test:ui        # Interactive test runner
npm run test:coverage  # Generate coverage report
```

## Deployment

### GitHub Pages Deployment
Automated deployment via GitHub Actions:
1. **Quality Checks**: Linting, type checking, tests
2. **Security Audit**: Dependency vulnerability scanning
3. **Build**: Astro static site generation
4. **Deploy**: GitHub Pages deployment

### Environment Configuration
- **Production URL**: `https://rrocap.github.io/Portfolio/`
- **Base Path**: `/Portfolio`
- **Static Assets**: Optimized and cached

## Performance

### Performance Budgets
- **First Contentful Paint**: < 2.5s
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms

### Optimization Strategies
- **Static Site Generation**: Pre-rendered HTML
- **Image Optimization**: WebP format with fallbacks
- **Font Loading**: Preconnect and font-display: swap
- **CSS**: Critical CSS inlining
- **JavaScript**: Component-level hydration

### Monitoring
- Lighthouse CI for performance monitoring
- Core Web Vitals tracking
- Bundle size analysis

## Security

### Security Measures
- **Dependency Scanning**: Automated vulnerability detection
- **Content Security Policy**: Configured headers
- **HTTPS Only**: Secure connections enforced
- **Input Validation**: Type-safe data handling

### Automated Security
- **Renovate**: Automated dependency updates
- **npm audit**: Regular security audits
- **OpenSSF Scorecard**: Security best practices

## Contributing

### Development Workflow
1. **Fork & Clone**: Repository setup
2. **Feature Branch**: Create feature branch from main
3. **Development**: Implement changes with tests
4. **Quality Checks**: Run linting, tests, and type checks
5. **Pull Request**: Submit for review
6. **CI/CD**: Automated checks and deployment

### Code Standards
- Follow TypeScript strict mode guidelines
- Write comprehensive tests for new features
- Update documentation for architectural changes
- Follow component naming conventions
- Use semantic commit messages

### Performance Considerations
- Monitor bundle size impacts
- Optimize images and assets
- Follow accessibility guidelines
- Test across multiple devices and browsers

---

For specific implementation details, see the individual component documentation in `src/components/`.