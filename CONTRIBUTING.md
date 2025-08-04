# Contributing to Ramon Roca Pinilla's Portfolio

Thank you for your interest in contributing to this academic portfolio project! This guide will help you understand how to contribute effectively and maintain the high quality standards of the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Quality Assurance](#quality-assurance)
- [Documentation](#documentation)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## 🚀 Getting Started

Before contributing, please:

1. **Read the [Getting Started Guide](./GETTING_STARTED.md)** to set up your development environment
2. **Familiarize yourself with the codebase** by exploring the [documentation hub](./docs/README.md)
3. **Review existing issues** to understand ongoing work and discussions
4. **Check the [project roadmap](./docs/development/memory-log.md)** to understand long-term goals

## 🤝 Code of Conduct

This project is an academic portfolio representing professional research work. We expect all contributors to:

- Be respectful and professional in all interactions
- Focus on constructive feedback and improvements
- Respect the academic and professional nature of the content
- Maintain accuracy of biographical and research information
- Follow established coding standards and practices

## 🛠️ How to Contribute

### Types of Contributions Welcome

#### 🐛 Bug Reports

- Performance issues
- Accessibility problems
- Browser compatibility issues
- Build or deployment failures
- Documentation inaccuracies

#### ✨ Feature Requests

- New interactive visualizations
- Performance optimizations
- Accessibility improvements
- Design system enhancements
- Internationalization improvements

#### 📚 Documentation

- Code documentation improvements
- Setup guide enhancements
- Architecture documentation

#### 🔧 Technical Improvements

- Code quality improvements
- Performance optimizations
- Testing enhancements
- Build process improvements

### What We DON'T Accept

❌ **Biographical Content Changes**: The biographical information, research details, and publications are factual and should not be modified without explicit approval.

❌ **Design Changes Without Discussion**: Major visual changes should be discussed in issues first.

❌ **Breaking Changes**: Changes that break existing functionality or APIs.

## 🔄 Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/Portfolio.git
cd Portfolio

# Add upstream remote
git remote add upstream https://github.com/RRocaP/Portfolio.git
```

### 2. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 3. Development Cycle

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook (for component work)
npm run storybook

# Make your changes...

# Run quality checks frequently
npm run preflight
```

### 4. Stay Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your branch
git checkout main
git merge upstream/main
git push origin main

# Rebase your feature branch
git checkout feature/your-feature-name
git rebase main
```

## 💻 Coding Standards

### TypeScript

- **Strict Mode**: The project uses TypeScript strict mode
- **Type Definitions**: Always provide explicit types for function parameters and return values
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use const assertions or union types instead of enums

```typescript
// ✅ Good
interface ComponentProps {
  title: string;
  isVisible: boolean;
  onClose?: () => void;
}

// ✅ Good
const THEME_OPTIONS = ['light', 'dark'] as const;
type Theme = (typeof THEME_OPTIONS)[number];

// ❌ Avoid
enum Theme {
  Light = 'light',
  Dark = 'dark',
}
```

### React Components

- **Functional Components**: Use function declarations for components
- **Props Interface**: Always define props interface
- **Default Props**: Use default parameter values
- **Hooks**: Use hooks judiciously and follow React hooks rules

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Astro Components

- **Component Props**: Use TypeScript interfaces for props
- **Slot Usage**: Properly document and use slots
- **CSS Scoping**: Use scoped styles when appropriate

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<section class="hero">
  <h1>{title}</h1>
  {description && <p class="description">{description}</p>}
  <slot />
</section>

<style>
  .hero {
    padding: 2rem;
  }

  .description {
    color: var(--text-secondary);
  }
</style>
```

### CSS and Styling

- **Tailwind First**: Use Tailwind CSS classes for styling
- **Custom CSS**: Use CSS custom properties for themes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Ensure sufficient color contrast and keyboard navigation

```css
/* ✅ Good - Using CSS custom properties */
.component {
  background-color: var(--background-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
}

/* ✅ Good - Responsive with mobile-first */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-lg);
  }
}
```

### File Naming Conventions

- **Components**: PascalCase (`Navigation.astro`, `Button.tsx`)
- **Utilities**: camelCase (`animations.ts`, `proteinVisualization.ts`)
- **Pages**: lowercase with hyphens (`index.astro`, `about.astro`)
- **Types**: PascalCase with `.types.ts` suffix (`protein-visualization.types.ts`)

## ✅ Quality Assurance

### Before Committing

Always run the preflight checks:

```bash
# Run all quality checks
npm run preflight

# Or run individually
npm run test:content    # Content validation
npm run check:types     # TypeScript checking
npm run lint           # Code linting
npm run build          # Build verification
```

### Testing Requirements

- **Content Validation**: All content tests must pass
- **Type Safety**: No TypeScript errors allowed
- **Build Success**: Production build must succeed
- **Linting**: Code must pass ESLint rules

### Performance Standards

Maintain these performance targets:

- **CSS Bundle**: < 25kB gzipped
- **JavaScript Bundle**: < 35kB gzipped
- **Lighthouse Performance**: > 90
- **Largest Contentful Paint**: < 1.8s
- **Cumulative Layout Shift**: < 0.1

### Accessibility Requirements

- **WCAG 2.1 AA Compliance**: All new features must meet accessibility standards
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Reader Support**: Proper semantic HTML and ARIA labels
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text

## 📝 Documentation

### Code Documentation

- **Functions**: Document complex functions with JSDoc
- **Components**: Document props and usage in Storybook
- **Types**: Document complex types and interfaces

```typescript
/**
 * Generates protein visualization frames for animation
 * @param proteinData - The protein structure data
 * @param frameCount - Number of frames to generate
 * @returns Array of animation frames
 */
function generateProteinFrames(
  proteinData: ProteinStructure,
  frameCount: number
): AnimationFrame[] {
  // Implementation...
}
```

### Storybook Stories

All new components must include Storybook stories:

```typescript
// Button.stories.tsx
export default {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A reusable button component with variants and states.',
      },
    },
  },
};

export const Primary = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};

export const WithAccessibility = {
  args: {
    children: 'Accessible button',
    'aria-label': 'Detailed description for screen readers',
  },
};
```

## 📦 Commit Guidelines

### Commit Message Format

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

#### Examples

```bash
# ✅ Good commit messages
feat(components): add protein visualization component
fix(navigation): resolve mobile menu accessibility issue
docs(contributing): update development workflow guide
perf(build): optimize CSS bundle size by 15%
style(components): apply prettier formatting to Button component

# ❌ Bad commit messages
fix stuff
update code
changes
WIP
```

### Commit Best Practices

- **Atomic Commits**: Each commit should represent a single logical change
- **Clear Messages**: Write clear, descriptive commit messages
- **Imperative Mood**: Use imperative mood ("add" not "added")
- **Reference Issues**: Reference related issues when applicable

```bash
# Good commit referencing an issue
fix(accessibility): improve keyboard navigation in timeline component

Fixes issue where keyboard users couldn't navigate through timeline items.
Added proper focus management and arrow key navigation.

Closes #42
```

## 🔀 Pull Request Process

### Before Creating a PR

1. **Sync with upstream**: Ensure your branch is up to date
2. **Run preflight checks**: All quality checks must pass
3. **Test thoroughly**: Test your changes in different browsers
4. **Update documentation**: Update relevant documentation

### PR Requirements

#### Title and Description

- **Clear Title**: Descriptive title following conventional commit format
- **Detailed Description**: Explain what changed and why
- **Screenshots**: Include screenshots for visual changes
- **Testing Notes**: Describe how to test the changes

#### PR Template Checklist

When creating a PR, ensure you complete the provided checklist:

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Code is well-commented
- [ ] Documentation updated as needed
- [ ] No new warnings or errors
- [ ] Tests pass locally
- [ ] Screenshots attached for UI changes

### Review Process

1. **Automated Checks**: CI/CD pipeline must pass
2. **Content Validation**: Biographical content accuracy verified
3. **Performance Review**: Bundle size and performance impact assessed
4. **Code Review**: At least one maintainer review required
5. **Final Testing**: Manual testing in staging environment

### Addressing Review Feedback

- **Respond Promptly**: Address feedback in a timely manner
- **Ask Questions**: Clarify unclear feedback
- **Update Documentation**: Update docs if changes affect them
- **Test Again**: Re-test after making changes

## 🚀 Release Process

### Version Management

The project follows semantic versioning (SemVer):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

### Release Workflow

1. **Feature Complete**: All features for the release are merged
2. **Quality Assurance**: Full testing cycle completed
3. **Documentation Update**: All documentation is current
4. **Version Bump**: Update version in `package.json`
5. **Changelog Update**: Update `CHANGELOG.md`
6. **Release Creation**: Create GitHub release with notes

## 🆘 Getting Help

### Resources

- **[Getting Started Guide](./GETTING_STARTED.md)**: Setup and development basics
- **[Documentation Hub](./docs/README.md)**: Comprehensive project documentation
- **[Storybook](http://localhost:6006)**: Component library and design system
- **[Memory Log](./docs/development/memory-log.md)**: Development history and decisions

### Communication

- **GitHub Issues**: For bugs, feature requests, and questions
- **GitHub Discussions**: For broader community discussions
- **Pull Request Comments**: For code review and collaboration

### Common Questions

**Q: Can I modify the biographical content?**
A: No, biographical information and research details should not be modified without explicit approval.

**Q: How do I add a new language?**
A: Create a new JSON file in `src/i18n/` and add the corresponding page routes.

**Q: Can I change the design significantly?**
A: Major design changes should be discussed in an issue first to ensure alignment with project goals.

**Q: How do I test my changes on different devices?**
A: Use browser dev tools, run the development server, and test on actual devices when possible.

## 🎉 Recognition

We appreciate all contributions to this project! Contributors will be:

- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Credited in documentation for major documentation improvements

Thank you for helping make this academic portfolio project better! 🚀

---

**Remember**: This is an academic portfolio representing professional research work. All contributions should maintain the highest standards of quality, accuracy, and professionalism.
