# Getting Started

Welcome to Ramon Roca Pinilla's academic portfolio project! This guide will help you set up the development environment and get you up and running quickly.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js 18 or higher** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** - [Download from git-scm.com](https://git-scm.com/)

### Recommended Tools

- **Visual Studio Code** - [Download](https://code.visualstudio.com/) with the following extensions:
  - Astro (astro-build.astro-vscode)
  - TypeScript and JavaScript Language Features
  - ESLint (dbaeumer.vscode-eslint)
  - Prettier - Code formatter (esbenp.prettier-vscode)
  - Auto Rename Tag (formulahendry.auto-rename-tag)
- **GitHub Desktop** (optional) - [Download](https://desktop.github.com/)

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/RRocaP/Portfolio.git

# Or clone via SSH (if you have SSH keys set up)
git clone git@github.com:RRocaP/Portfolio.git

# Navigate to the project directory
cd Portfolio
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install

# Or if you prefer yarn
yarn install
```

### 3. Start Development Server

```bash
# Start the development server
npm run dev

# The site will be available at http://localhost:4321
```

That's it! You should now have the portfolio running locally.

## 🛠️ Development Environment Setup

### Verify Installation

Check that everything is working correctly:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Run type checking
npm run check:types

# Run linting
npm run lint
```

### Environment Variables

This project doesn't require any environment variables for local development. All configuration is handled through the `astro.config.mjs` file.

### VS Code Setup

If you're using VS Code, the project includes recommended settings. Install the suggested extensions when prompted, or manually install:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Install the Astro extension
4. Install the ESLint extension
5. Install the Prettier extension

### Configure Git Hooks (Recommended)

The project uses Husky for git hooks to ensure code quality:

```bash
# Install git hooks (automatically runs after npm install)
npm run prepare
```

This sets up pre-commit hooks that will:

- Run linting and fix auto-fixable issues
- Format code with Prettier
- Validate content integrity

## 📚 Project Structure

Understanding the project structure will help you navigate and contribute effectively:

```
Portfolio/
├── .github/                 # GitHub workflows and templates
│   ├── workflows/           # CI/CD pipelines
│   └── templates/           # Issue and PR templates
├── docs/                    # Documentation
│   ├── audits/             # Performance and quality audits
│   ├── development/        # Development guides
│   └── performance/        # Performance reports
├── public/                  # Static assets
│   ├── favicon.svg         # Site favicon
│   ├── profile.jpg         # Profile image
│   └── og-image.png        # Social media preview
├── scripts/                 # Build and utility scripts
│   ├── test-content.sh     # Content validation
│   └── generate-og-image.js # Open Graph image generation
├── src/                     # Source code
│   ├── components/         # React/Astro components
│   ├── data/               # Content data (publications, etc.)
│   ├── i18n/               # Internationalization files
│   ├── layouts/            # Page layouts
│   ├── pages/              # Astro pages
│   ├── stories/            # Storybook stories
│   ├── styles/             # Global CSS styles
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.mjs       # ESLint configuration
```

## 🎯 Available Commands

Here are the main commands you'll use during development:

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Start development server (alternative)
npm run start
```

### Build Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Quality Assurance Commands

```bash
# Run all preflight checks (recommended before committing)
npm run preflight

# Run preflight with verbose output
npm run preflight:verbose

# Run type checking
npm run check:types

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Validate content integrity
npm run test:content
```

### Storybook Commands

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook

# Serve built Storybook
npm run storybook:serve
```

### Formatting Commands

```bash
# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check
```

## 🎨 Working with Storybook

This project includes a comprehensive design system documented in Storybook:

1. Start Storybook:

   ```bash
   npm run storybook
   ```

2. Open http://localhost:6006 in your browser

3. Explore the components, their variants, and documentation

4. When creating new components, add corresponding stories in `src/stories/`

## 🌍 Internationalization

The portfolio supports three languages:

- **English** (`/en/`) - Primary language
- **Spanish** (`/es/`) - Secondary language
- **Catalan** (`/ca/`) - Regional language

Translation files are located in `src/i18n/`:

- `en.json` - English translations
- `es.json` - Spanish translations
- `ca.json` - Catalan translations

## 🧪 Testing

### Content Validation

The project includes content validation to ensure biographical accuracy:

```bash
# Run content validation
npm run test:content
```

This checks that critical biographical information remains accurate and hasn't been accidentally modified.

### Component Testing

Storybook includes built-in testing capabilities:

1. Visual regression testing
2. Accessibility testing (via a11y addon)
3. Interactive testing

## 📊 Performance Monitoring

The project includes performance monitoring tools:

```bash
# View current bundle sizes
cat docs/performance/dist-sizes.json

# View CSS optimization report
cat docs/performance/optimization-report.json
```

Performance targets:

- CSS Bundle: < 25kB gzipped
- Lighthouse Performance Score: > 90
- Largest Contentful Paint: < 1.8s
- Cumulative Layout Shift: < 0.1

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

If port 4321 is already in use:

```bash
# Kill process using the port
npx kill-port 4321

# Or use a different port
npm run dev -- --port 3000
```

#### Dependencies Issues

If you encounter dependency issues:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors

If the build fails:

```bash
# Clear Astro cache
rm -rf .astro

# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

#### Type Errors

If you encounter TypeScript errors:

```bash
# Run type checking with detailed output
npm run check:types

# Check specific files
npx tsc --noEmit src/specific-file.ts
```

### Getting Help

1. **Check Documentation**: Review the [docs/README.md](./docs/README.md) for comprehensive guides
2. **Review Issues**: Check existing [GitHub issues](https://github.com/RRocaP/Portfolio/issues)
3. **Performance Reports**: Consult [audit reports](./docs/audits/portfolio-audit.md) for performance insights
4. **Development History**: Check the [memory log](./docs/development/memory-log.md) for context

## ✅ Verification Checklist

Before you start contributing, ensure:

- [ ] Node.js 18+ is installed
- [ ] Dependencies are installed without errors
- [ ] Development server starts successfully (`npm run dev`)
- [ ] Storybook runs without issues (`npm run storybook`)
- [ ] All preflight checks pass (`npm run preflight`)
- [ ] Git hooks are installed and working

## 🎉 You're Ready!

Congratulations! You now have a fully functional development environment. Here are some next steps:

1. **Explore the Codebase**: Start by looking at `src/pages/index.astro`
2. **Review Components**: Check out the component library in `src/components/`
3. **Read the Docs**: Familiarize yourself with the [documentation hub](./docs/README.md)
4. **Check Storybook**: Explore the design system at http://localhost:6006
5. **Review Contribution Guidelines**: Read [CONTRIBUTING.md](./CONTRIBUTING.md) before making changes

Happy coding! 🚀
