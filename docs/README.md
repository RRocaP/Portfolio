# Documentation Hub

Complete documentation for Ramon Roca Pinilla's academic portfolio project.

## 📋 Table of Contents

### 🚀 Getting Started

- **[Main README](../README.md)** - Project overview and quick start
- **[Getting Started Guide](../GETTING_STARTED.md)** - Complete setup instructions for new contributors
- **[Contributing Guidelines](../CONTRIBUTING.md)** - How to contribute to this academic portfolio project
- **[Legacy Setup Instructions](../SETUP_INSTRUCTIONS.md)** - Original GitHub Pages deployment setup
- **[Storybook Guide](../STORYBOOK.md)** - Design system documentation

### 🛠️ Development

- **[Development Workflow Guide](./development/workflow-guide.md)** - Daily development processes and best practices
- **[Code Standards](./development/code-standards.md)** - TypeScript, React, and style guidelines
- **[Preflight Guide](./development/preflight-guide.md)** - Quality assurance workflows
- **[Memory Log](./development/memory-log.md)** - Development history and decisions
- **[Changelog](../CHANGELOG.md)** - Version history and updates

### 📊 Performance & Audits

- **[Portfolio Audit](./audits/portfolio-audit.md)** - Complete audit report and optimization results
- **[Performance Reports](./performance/)** - Bundle analysis and metrics
  - `optimization-report.json` - CSS optimization results
  - `dist-sizes.json` - Bundle size analysis
  - `css-unused-baseline.json` - Unused CSS baseline

### 🎨 Design System

- **[Storybook Documentation](../STORYBOOK.md)** - Interactive component library
- **[Design Tokens](../src/stories/design-system/DesignTokens.stories.tsx)** - Colors, typography, spacing
- **[Component Library](../src/stories/design-system/)** - React components with stories

## 🏗️ Architecture Overview

This portfolio is built with modern web technologies focusing on performance, accessibility, and maintainability:

### Core Technologies

- **Framework**: Astro.js (Static Site Generation)
- **Components**: React with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Visualizations**: D3.js for interactive graphics
- **Documentation**: Storybook for component library
- **Testing**: Vitest with browser testing capabilities

### Key Features

- 🌍 **Multilingual Support**: English, Spanish, and Catalan
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 🚀 **Performance**: Optimized bundles and loading
- 📱 **Responsive**: Mobile-first design approach
- 🎨 **Design System**: Comprehensive component library
- 🔍 **SEO Optimized**: Meta tags and structured data

## 📁 Project Structure

```
Portfolio/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Astro pages (/, /en/, /es/, /ca/)
│   ├── layouts/            # Page layouts
│   ├── data/               # Content data (publications, etc.)
│   ├── i18n/               # Internationalization files
│   └── stories/            # Storybook stories
├── docs/                   # Documentation (this directory)
│   ├── audits/             # Audit reports
│   ├── performance/        # Performance reports
│   └── development/        # Development guides
├── public/                 # Static assets
└── scripts/                # Build and utility scripts
```

## 🔄 Development Workflow

### Daily Development

1. `npm run dev` - Start development server
2. `npm run storybook` - Work on components
3. `npm run preflight` - Quality checks before commit

### Before Deployment

1. `npm run test:content` - Validate content integrity
2. `npm run build` - Production build
3. `npm run preview` - Test production build

### Quality Assurance

- **Preflight Checks**: Automated type checking, linting, and build verification
- **Content Validation**: Ensures biographical content remains accurate
- **Performance Monitoring**: Bundle size and Core Web Vitals tracking
- **Accessibility Testing**: WCAG compliance verification

## 📈 Performance Targets

Based on audit results, the project maintains these performance standards:

- **CSS Bundle**: < 25kB gzipped ✅ (18.2kB achieved)
- **JavaScript**: < 35kB gzipped (ongoing optimization)
- **Largest Contentful Paint**: < 1.8s ✅ (1.2s achieved)
- **Cumulative Layout Shift**: < 0.1 ✅ (0.08 achieved)
- **Lighthouse Performance**: > 90 ✅ (95 achieved)

## 🧪 Testing Strategy

- **Unit Tests**: Component testing with Vitest
- **Integration Tests**: Browser testing with Playwright
- **Visual Testing**: Storybook visual regression tests
- **Accessibility Testing**: Automated a11y checks in Storybook
- **Content Validation**: Custom scripts to verify biographical accuracy

## 🚀 Deployment

- **Platform**: GitHub Pages
- **Trigger**: Push to main branch
- **Build**: Automated via GitHub Actions
- **Preview**: Branch deployments for pull requests

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Develop** using the established patterns
4. **Run** `npm run preflight` to ensure quality
5. **Submit** a pull request with clear description

### Contribution Process

1. **Read Documentation**: Start with [Getting Started Guide](../GETTING_STARTED.md)
2. **Follow Guidelines**: Review [Contributing Guidelines](../CONTRIBUTING.md)
3. **Maintain Standards**: Follow [Code Standards](./development/code-standards.md)
4. **Use Workflow**: Follow [Development Workflow](./development/workflow-guide.md)
5. **Quality Checks**: Run preflight checks before submitting

### Development Guidelines

- Follow TypeScript strict mode
- Maintain WCAG 2.1 AA accessibility standards
- Write Storybook stories for new components
- Update tests for new functionality
- Preserve biographical content accuracy
- Use GitHub issue and PR templates

## 📞 Support

For questions about the project architecture, development workflow, or deployment:

1. Check this documentation first
2. Review the [audit reports](./audits/portfolio-audit.md)
3. Consult the [memory log](./development/memory-log.md) for historical context
4. Create an issue for bugs or feature requests

---

Last updated: August 2025 | Portfolio Version: 0.0.1
