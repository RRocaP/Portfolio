# E2E Testing Suite

This directory contains a comprehensive end-to-end testing suite for the portfolio using Playwright.

## 🎯 Test Coverage

### Critical User Journeys

- ✅ Homepage loading and hero section
- ✅ Navigation between sections (smooth scrolling)
- ✅ Mobile menu functionality
- ✅ Publications section interaction
- ✅ Contact information accessibility
- ✅ External link functionality

### Cross-Browser Testing

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)
- ✅ Tablet (iPad Pro)

### Specialized Testing

- ✅ **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- ✅ **Visual Regression**: Component screenshots, layout comparisons, dark mode
- ✅ **Performance**: Core Web Vitals, load times, bundle analysis
- ✅ **Responsive Design**: Mobile-first, breakpoint testing, orientation changes
- ✅ **Multilingual**: EN/ES/CA language switching, proper meta tags

## 📁 Project Structure

```
tests/
├── e2e/                    # Main E2E test files
│   ├── homepage.spec.ts    # Homepage functionality tests
│   ├── navigation.spec.ts  # Navigation and routing tests
│   ├── responsive.spec.ts  # Responsive design tests
│   ├── multilingual.spec.ts # Language switching tests
│   ├── accessibility.spec.ts # Accessibility compliance tests
│   ├── visual.spec.ts      # Visual regression tests
│   ├── performance.spec.ts # Performance and Core Web Vitals
│   └── setup.ts           # Global test setup
├── pages/                  # Page Object Models
│   ├── base.page.ts       # Base page with common functionality
│   └── home.page.ts       # Homepage-specific page object
├── fixtures/               # Test fixtures and data
│   └── test-fixtures.ts   # Custom test fixtures
├── utils/                  # Test utilities
│   └── test-helpers.ts    # Helper functions for tests
└── README.md              # This file
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install:playwright:deps
```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run mobile tests
npm run test:e2e:mobile

# Run specific test types
npm run test:accessibility
npm run test:visual
npm run test:performance
npm run test:responsive
npm run test:multilingual

# Debug mode
npm run test:e2e:debug
```

### Test Configuration

The main configuration is in `playwright.config.ts` at the project root:

- **Base URL**: `http://localhost:4321` (Astro preview server)
- **Timeout**: 60 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Only on failure
- **Video**: Retained on failure
- **Parallel execution**: Enabled

## 🧪 Test Categories

### 1. Homepage Tests (`homepage.spec.ts`)

- Page loading and meta tags
- Hero section validation
- Navigation functionality
- Section visibility
- Statistics animation
- Research cards interaction
- Publications filter
- Contact section
- External link security
- Keyboard navigation
- Error handling

### 2. Navigation Tests (`navigation.spec.ts`)

- Desktop navigation
- Mobile navigation
- Smooth scrolling
- Hash navigation
- Active state management
- Keyboard accessibility
- Touch navigation
- Performance optimization

### 3. Responsive Design (`responsive.spec.ts`)

- Mobile devices (iPhone SE, iPhone 12, Android)
- Tablet devices (iPad, iPad Pro)
- Desktop breakpoints (1024px, 1440px, 1920px)
- Orientation changes
- Content adaptation
- Typography scaling
- Image responsiveness
- Performance on mobile

### 4. Multilingual Support (`multilingual.spec.ts`)

- Language detection
- Spanish (ES) version
- Catalan (CA) version
- Language switching
- SEO metadata
- Accessibility across languages
- Content validation

### 5. Accessibility Testing (`accessibility.spec.ts`)

- WCAG 2.1 AA/AAA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA attributes
- Focus management
- Reduced motion support
- Touch target sizes

### 6. Visual Regression (`visual.spec.ts`)

- Component screenshots
- Full page layouts
- Mobile/tablet views
- Interactive states (hover, focus)
- Dark mode
- Print styles
- Error states

### 7. Performance Testing (`performance.spec.ts`)

- Core Web Vitals (LCP, CLS, FID)
- Page load times
- Resource optimization
- Bundle size analysis
- Animation performance
- Memory usage
- Network simulation

## 🏗️ Page Object Model

The test suite uses the Page Object Model pattern for maintainability:

### BasePage (`pages/base.page.ts`)

Common functionality for all pages:

- Navigation utilities
- Animation controls
- Responsiveness testing
- Screenshot capture
- Performance measurement
- Core Web Vitals

### HomePage (`pages/home.page.ts`)

Homepage-specific elements and actions:

- Hero section elements
- Navigation selectors
- Section locators
- Interactive elements
- Validation methods

## 🔧 Test Utilities

### TestHelpers (`utils/test-helpers.ts`)

Utility functions for:

- Network simulation
- Performance measurement
- Screenshot capture
- Responsive testing
- Accessibility checking
- Data generation

## 📊 CI/CD Integration

Tests run automatically on:

- **Push** to main/develop branches
- **Pull Requests** to main
- **Daily schedule** at 2 AM UTC

### GitHub Actions Workflow (`.github/workflows/e2e.yml`)

- Multi-browser testing
- Accessibility validation
- Visual regression detection
- Performance monitoring
- Mobile device testing
- Lighthouse integration
- Test result reporting

## 📈 Test Reporting

### Artifacts Generated

- HTML reports with screenshots
- JSON test results
- JUnit XML for CI integration
- Visual diff images
- Performance metrics
- Accessibility scan results

### Reports Include

- Test execution summaries
- Failed test screenshots
- Performance benchmarks
- Accessibility violations
- Visual regression diffs
- Network activity logs

## 🛠️ Debugging Tests

### Local Debugging

```bash
# Run with headed browser
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug -- tests/e2e/homepage.spec.ts

# Run with trace viewer
npx playwright test --trace on
```

### Troubleshooting

**Common Issues:**

1. **Flaky tests**: Usually timing-related, check for proper waits
2. **Visual regression failures**: Compare diff images, update baselines if intentional
3. **Accessibility failures**: Check axe-core violations in test output
4. **Performance failures**: Network conditions, server performance

**Best Practices:**

- Use `page.waitForLoadState('networkidle')` for dynamic content
- Disable animations for consistent visual tests
- Use proper selectors (data-testid preferred)
- Keep tests independent and isolated
- Clean up test data between runs

## 🔄 Updating Tests

### Adding New Tests

1. Create test file in appropriate category
2. Use existing page objects or create new ones
3. Follow naming conventions
4. Add to CI workflow if needed

### Updating Visual Baselines

```bash
# Update all visual baselines
npx playwright test --project=visual --update-snapshots

# Update specific test
npx playwright test visual.spec.ts --update-snapshots
```

### Maintaining Page Objects

- Keep selectors in page objects, not tests
- Add new methods for common interactions
- Update when UI changes
- Use descriptive method names

## 📝 Contributing

When contributing to the test suite:

1. **Follow patterns**: Use existing page objects and utilities
2. **Write descriptive tests**: Clear test names and steps
3. **Handle edge cases**: Error states, slow networks, mobile
4. **Update documentation**: Keep README current
5. **Test locally**: Run full suite before committing

## 🎯 Performance Benchmarks

Target metrics for passing tests:

- **LCP**: < 2.5s
- **CLS**: < 0.1
- **FID**: < 100ms
- **Load Time**: < 3s
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance Score**: > 85
- **SEO Score**: > 90

---

For questions or issues with the test suite, please check the existing test output and logs first, then create an issue with:

- Test command used
- Error message
- Screenshots if visual issue
- Browser/device information
