# Development Workflow Guide

This guide outlines the complete development workflow for the Ramon Roca Pinilla academic portfolio project, from initial setup through deployment.

## 📋 Table of Contents

- [Overview](#overview)
- [Development Environment](#development-environment)
- [Daily Development Workflow](#daily-development-workflow)
- [Feature Development Workflow](#feature-development-workflow)
- [Quality Assurance Process](#quality-assurance-process)
- [Testing Workflow](#testing-workflow)
- [Build and Deployment](#build-and-deployment)
- [Collaboration Workflow](#collaboration-workflow)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Our development workflow prioritizes:

- **Code Quality**: Strict TypeScript, linting, and formatting
- **Performance**: Bundle optimization and Core Web Vitals
- **Accessibility**: WCAG 2.1 AA compliance
- **Academic Integrity**: Content validation and accuracy
- **Collaboration**: Clear processes and documentation

## 🛠️ Development Environment

### Required Tools

| Tool    | Version | Purpose             |
| ------- | ------- | ------------------- |
| Node.js | 18+     | Runtime environment |
| npm     | 9+      | Package management  |
| Git     | 2.30+   | Version control     |
| VS Code | Latest  | Recommended editor  |

### Environment Setup

```bash
# 1. Clone and setup
git clone https://github.com/RRocaP/Portfolio.git
cd Portfolio
npm install

# 2. Verify setup
npm run preflight

# 3. Start development
npm run dev
npm run storybook  # In separate terminal
```

### VS Code Configuration

Recommended extensions:

- Astro (astro-build.astro-vscode)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- TypeScript and JavaScript Language Features
- Auto Rename Tag (formulahendry.auto-rename-tag)

## 🔄 Daily Development Workflow

### Morning Setup

```bash
# 1. Update your branch
git checkout main
git pull upstream main

# 2. Install any new dependencies
npm install

# 3. Verify everything works
npm run preflight

# 4. Start development servers
npm run dev        # Portfolio (http://localhost:4321)
npm run storybook  # Design system (http://localhost:6006)
```

### Development Cycle

```bash
# 1. Create/switch to feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# Edit files...

# 3. Test frequently
npm run dev  # Manual testing in browser

# 4. Quality checks (recommended every 30-60 minutes)
npm run check:types  # TypeScript errors
npm run lint        # Code style issues

# 5. Before lunch/end of day
npm run preflight   # Full quality check
```

### Git Workflow

```bash
# 1. Stage changes
git add .

# 2. Commit with conventional format
git commit -m "feat(component): add protein visualization controls"

# 3. Push to your fork
git push origin feature/your-feature-name

# 4. Create PR when ready
# Go to GitHub and create pull request
```

## 🚀 Feature Development Workflow

### 1. Planning Phase

Before starting a new feature:

- [ ] Create or assign GitHub issue
- [ ] Review existing code and documentation
- [ ] Check design system in Storybook
- [ ] Plan component structure
- [ ] Consider accessibility requirements

### 2. Development Phase

#### Component Development

```bash
# 1. Create component structure
mkdir src/components/NewComponent
touch src/components/NewComponent/NewComponent.tsx
touch src/components/NewComponent/NewComponent.stories.tsx
touch src/components/NewComponent/index.ts

# 2. Develop component
# Write component code following standards

# 3. Create Storybook story
# Document component variants and usage

# 4. Test in development environment
npm run dev
npm run storybook
```

#### Component Template

```typescript
// NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'highlighted';
  children?: React.ReactNode;
}

/**
 * NewComponent - Brief description of the component
 *
 * @param props - Component properties
 * @returns JSX element
 */
function NewComponent({
  title,
  description,
  variant = 'default',
  children
}: NewComponentProps) {
  return (
    <div className={`new-component new-component--${variant}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}

export default NewComponent;
export type { NewComponentProps };
```

#### Storybook Story Template

```typescript
// NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import NewComponent from './NewComponent';

const meta: Meta<typeof NewComponent> = {
  title: 'Components/NewComponent',
  component: NewComponent,
  parameters: {
    docs: {
      description: {
        component: 'Description of the component and its purpose.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'highlighted']
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Example Title',
    description: 'Example description'
  }
};

export const Highlighted: Story = {
  args: {
    title: 'Highlighted Example',
    description: 'This variant is highlighted',
    variant: 'highlighted'
  }
};

export const WithChildren: Story = {
  args: {
    title: 'With Children',
    children: <p>This is child content</p>
  }
};
```

### 3. Quality Assurance Phase

```bash
# 1. Run all quality checks
npm run preflight

# 2. Individual checks if needed
npm run test:content    # Content validation
npm run check:types     # TypeScript
npm run lint           # ESLint
npm run format:check   # Prettier
npm run build         # Build verification

# 3. Visual testing in Storybook
npm run storybook
# Test all component variants
# Check accessibility with a11y addon
```

### 4. Testing Phase

#### Browser Testing Checklist

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Accessibility Testing

```bash
# 1. Keyboard navigation
# Tab through interface
# Test all interactive elements

# 2. Screen reader testing
# Test with VoiceOver (macOS) or NVDA (Windows)

# 3. Color contrast
# Use browser dev tools accessibility panel

# 4. Automated testing in Storybook
# Check a11y addon results
```

#### Performance Testing

```bash
# 1. Build and analyze
npm run build

# 2. Check bundle sizes
cat docs/performance/dist-sizes.json

# 3. Lighthouse audit
# Use Chrome DevTools Lighthouse panel

# 4. Core Web Vitals
# Test in development and preview modes
```

## ✅ Quality Assurance Process

### Preflight Checks

The `npm run preflight` command runs:

1. **Content Validation** (`npm run test:content`)
   - Verifies biographical accuracy
   - Checks for required content sections
   - Validates publication data

2. **Type Checking** (`npm run check:types`)
   - Astro file type checking
   - TypeScript compilation
   - Interface validation

3. **Code Linting** (`npm run lint`)
   - ESLint rule compliance
   - Code style consistency
   - Import/export validation

4. **Build Verification** (`npm run build`)
   - Production build success
   - Asset optimization
   - Bundle size verification

### Quality Gates

All changes must pass:

- [ ] ✅ Content validation (no biographical changes)
- [ ] ✅ TypeScript compilation (strict mode)
- [ ] ✅ ESLint rules (no errors, warnings okay)
- [ ] ✅ Build success (production-ready)
- [ ] ✅ Performance targets maintained
- [ ] ✅ Accessibility compliance (WCAG 2.1 AA)

### Performance Targets

| Metric     | Target         | Current   |
| ---------- | -------------- | --------- |
| CSS Bundle | < 25kB gzipped | 18.2kB ✅ |
| JS Bundle  | < 35kB gzipped | 32.1kB ✅ |
| LCP        | < 1.8s         | 1.2s ✅   |
| CLS        | < 0.1          | 0.08 ✅   |
| Lighthouse | > 90           | 95 ✅     |

## 🧪 Testing Workflow

### Manual Testing

#### Development Testing

```bash
# 1. Start development server
npm run dev

# 2. Test in browser
# - Navigate through all pages
# - Test responsive design
# - Check interactive elements
# - Verify accessibility features

# 3. Test component variations
npm run storybook
# - Check all component stories
# - Test different states/props
# - Verify accessibility in a11y addon
```

#### Cross-browser Testing

```bash
# 1. Build for production
npm run build

# 2. Preview production build
npm run preview

# 3. Test in multiple browsers
# Use tools like BrowserStack or manual testing
```

### Automated Testing

#### Content Validation

```bash
# Test biographical content accuracy
npm run test:content

# What it checks:
# - Name, title, affiliation
# - Research areas and expertise
# - Publication count and details
# - Contact information
```

#### Component Testing (Future)

```bash
# When implemented:
npm run test
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 🚢 Build and Deployment

### Build Process

```bash
# 1. Clean build
rm -rf dist .astro

# 2. Production build
npm run build

# 3. Preview locally
npm run preview

# 4. Verify build contents
ls -la dist/
```

### Deployment Workflow

#### Automatic Deployment (Main Branch)

1. **Push to main** triggers GitHub Actions
2. **CI Pipeline** runs:
   - Content validation
   - Type checking
   - Linting
   - Build verification
   - Performance checks
3. **Deployment** to GitHub Pages
4. **Verification** of live site

#### Manual Deployment Verification

```bash
# 1. Check GitHub Actions status
# Visit: https://github.com/RRocaP/Portfolio/actions

# 2. Verify deployment
curl -I https://RRocaP.github.io/Portfolio/

# 3. Test live site functionality
# Check all major features work in production
```

### Pre-deployment Checklist

- [ ] All tests pass locally
- [ ] Preflight checks pass
- [ ] Performance targets met
- [ ] Accessibility verified
- [ ] Content accuracy confirmed
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed

## 🤝 Collaboration Workflow

### Issue Management

#### Creating Issues

```markdown
# Bug Report Template

**Bug Description**: Clear description of the issue
**Steps to Reproduce**: 1. Go to..., 2. Click..., 3. See error
**Expected Behavior**: What should happen
**Browser/Device**: Chrome 118 on Windows 11
**Screenshots**: [Attach if applicable]
```

#### Feature Requests

```markdown
# Feature Request Template

**Problem Statement**: What problem does this solve?
**Proposed Solution**: How should it work?
**Acceptance Criteria**: What makes it complete?
**Priority**: High/Medium/Low
```

### Pull Request Process

#### Before Creating PR

1. **Sync with upstream**:

   ```bash
   git checkout main
   git pull upstream main
   git checkout feature-branch
   git rebase main
   ```

2. **Final quality check**:

   ```bash
   npm run preflight
   ```

3. **Test in multiple browsers**

#### PR Requirements

- [ ] Descriptive title and description
- [ ] All quality checks pass
- [ ] Screenshots for UI changes
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] Performance impact assessed

#### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer
3. **Manual testing** of changes
4. **Performance verification**
5. **Merge** when approved

### Communication

- **GitHub Issues**: Bug reports, feature requests
- **Pull Request Comments**: Code review discussions
- **GitHub Discussions**: Broader project discussions

## 🔧 Troubleshooting

### Common Development Issues

#### Port Already in Use

```bash
# Kill process on port 4321
npx kill-port 4321

# Or use different port
npm run dev -- --port 3000
```

#### Build Failures

```bash
# Clear caches
rm -rf .astro dist node_modules
npm install
npm run build
```

#### Type Errors

```bash
# Check specific file
npx tsc --noEmit src/components/YourComponent.tsx

# Generate type declarations
npm run build
```

#### Git Issues

```bash
# Reset to clean state
git reset --hard HEAD
git clean -fd

# Force sync with upstream
git fetch upstream
git reset --hard upstream/main
```

### Performance Issues

#### Bundle Size Analysis

```bash
# Build and check sizes
npm run build
cat docs/performance/dist-sizes.json

# Analyze specific bundles
npx vite-bundle-analyzer dist
```

#### CSS Issues

```bash
# Check CSS optimization
cat docs/performance/optimization-report.json

# Regenerate optimized CSS
npm run build
```

### Quality Check Failures

#### Content Validation Fails

```bash
# Check what failed
npm run test:content

# Common issues:
# - Modified biographical content
# - Changed publication data
# - Missing required sections
```

#### Type Check Failures

```bash
# Detailed type checking
npm run check:types

# Common fixes:
# - Add missing type annotations
# - Fix import/export types
# - Update interface definitions
```

#### Lint Failures

```bash
# Auto-fix what's possible
npm run lint:fix

# Check remaining issues
npm run lint

# Common issues:
# - Unused variables/imports
# - Formatting inconsistencies
# - Missing accessibility attributes
```

## 📚 Additional Resources

### Documentation

- [Getting Started Guide](../../GETTING_STARTED.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [Code Standards](./code-standards.md)
- [Preflight Guide](./preflight-guide.md)

### External Resources

- [Astro Documentation](https://docs.astro.build/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Storybook Documentation](https://storybook.js.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Project-Specific Resources

- [Memory Log](./memory-log.md) - Development history and decisions
- [Portfolio Audit](../audits/portfolio-audit.md) - Performance analysis
- [Performance Reports](../performance/) - Bundle analysis and metrics

---

This workflow ensures consistent, high-quality development while maintaining the academic and professional standards of the portfolio project.
