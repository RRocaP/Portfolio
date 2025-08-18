# E2E Test Suite

This directory contains the comprehensive end-to-end test suite for the portfolio website built with Playwright and TypeScript.

## Features Tested

### Core Functionality
- ✅ **Navigation Auto-hide** - Tests navigation hiding on scroll down and showing on scroll up
- ✅ **Search Functionality** - Tests search modal, filtering, and results
- ✅ **Contact Form** - Tests form validation and submission
- ✅ **Theme Switch** - Tests light/dark theme toggle and persistence
- ✅ **Language Switch** - Tests multilingual support (EN/ES/CA)
- ✅ **Mobile Menu** - Tests responsive navigation on mobile devices

### Interactive Components
- ✅ **Skills Radar** - Tests interactive radar chart functionality
- ✅ **Timeline** - Tests timeline rendering and scroll animations
- ✅ **Testimonials** - Tests testimonial slider and auto-play

### Quality Assurance
- ✅ **Accessibility** - Tests WCAG compliance using axe-core
- ✅ **Performance Budgets** - Enforces JS (<150KB) and CSS (<50KB) budgets
- ✅ **Cross-browser** - Tests on Chromium, Firefox, and WebKit
- ✅ **Mobile Compatibility** - Tests on mobile viewports
- ✅ **Error Handling** - Tests graceful error scenarios

## Test Structure

```
tests/
├── e2e.spec.ts           # Main test suite
├── global-setup.ts       # Global test setup
├── global-teardown.ts    # Global test cleanup
└── README.md            # This file
```

## Running Tests

### Local Development

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm run test:e2e

# Run tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug specific tests
npm run test:e2e:debug
```

### Specific Test Categories

```bash
# Accessibility tests only
npm run test:accessibility

# Performance budget tests only  
npm run test:performance

# Mobile-specific tests
npm run test:mobile

# Cross-browser tests
npm run test:browsers
```

### CI/CD Integration

The test suite is fully integrated with GitHub Actions:

- **Multi-browser testing** - Tests run on Chrome, Firefox, and Safari
- **Mobile testing** - Dedicated mobile test runs
- **Accessibility validation** - Separate a11y test job
- **Performance monitoring** - Budget enforcement
- **Lighthouse integration** - Performance scoring
- **Test artifacts** - Screenshots, videos, and reports

## Configuration

### Playwright Config (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome/Safari
- **Parallelization**: Full parallel execution
- **Retries**: 2 retries on CI, 0 locally
- **Timeouts**: 30s global, 10s actions, 30s navigation
- **Reporters**: HTML, JSON, JUnit
- **Screenshots**: On failure only
- **Video**: Retain on failure

### Performance Budgets

- **JavaScript**: 150KB maximum
- **CSS**: 50KB maximum
- **Load Time**: <3 seconds
- **LCP**: <2.5 seconds
- **CLS**: <0.1

### Lighthouse Integration (`lighthouserc.js`)

- **Performance**: >90 score
- **Accessibility**: >95 score  
- **SEO**: >95 score
- **Best Practices**: >90 score
- **PWA**: >80 score

## Test Implementation Details

### Resilient Selectors

Tests use multiple fallback selectors to handle different implementations:

```typescript
// Example: Navigation selector with fallbacks
const nav = page.locator('nav, [data-testid="navigation"], .navigation');

// Example: Search with multiple selector strategies
const searchTrigger = page.locator(`
  [data-testid="search-trigger"], 
  button:has-text("Search"), 
  .search-trigger, 
  [aria-label*="search" i]
`);
```

### Animation Handling

Proper waiting for animations and transitions:

```typescript
async function waitForAnimations(page: Page) {
  await page.waitForTimeout(300);
  await page.waitForFunction(() => {
    const animations = document.getAnimations();
    return animations.length === 0 || 
           animations.every(a => a.playState === 'finished');
  });
}
```

### Performance Measurement

Real resource size measurement:

```typescript
const { jsSize, cssSize } = await getResourceSizes(page);
expect(jsSize).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.JS_BUDGET);
```

## Accessibility Testing

Comprehensive a11y testing with axe-core:

- **Automatic scanning** - Full page accessibility audit
- **WCAG compliance** - AA level compliance checking  
- **Keyboard navigation** - Tab order and focus management
- **ARIA validation** - Proper labeling and roles
- **Color contrast** - AA contrast ratio validation
- **Screen reader** - Semantic markup validation

## Mobile Testing

Dedicated mobile test scenarios:

- **Responsive layouts** - No horizontal scroll
- **Touch interactions** - Mobile-specific gestures
- **Viewport handling** - Multiple screen sizes
- **Performance** - Mobile-optimized loading

## Error Scenarios

Graceful error handling tests:

- **404 pages** - Custom error page rendering
- **JavaScript errors** - Error-free execution
- **Network failures** - Offline capability
- **Slow connections** - 3G simulation

## Continuous Integration

### GitHub Actions Workflow

The CI pipeline includes:

1. **Matrix Testing** - Parallel browser execution
2. **Dependency Caching** - Fast CI runs
3. **Artifact Collection** - Test reports and screenshots
4. **Lighthouse Audits** - Performance monitoring
5. **Report Aggregation** - Combined test summaries

### Test Reports

Generated artifacts:

- **HTML Report** - Interactive test results
- **Screenshots** - Failure screenshots
- **Videos** - Failure recordings  
- **JSON Results** - Programmatic access
- **JUnit XML** - CI integration
- **Lighthouse Reports** - Performance metrics

## Best Practices

### Test Organization

- **Describe blocks** - Logical grouping by feature
- **Descriptive names** - Clear test intentions
- **Setup/teardown** - Proper test isolation
- **Helper functions** - Reusable utilities

### Reliability

- **Wait strategies** - Proper async handling
- **Retry logic** - Flaky test mitigation  
- **Error handling** - Graceful failures
- **Selector strategies** - Multiple fallbacks

### Performance

- **Parallel execution** - Fast test runs
- **Resource optimization** - Minimal overhead
- **Selective testing** - Targeted test runs
- **CI optimization** - Efficient pipelines

## Troubleshooting

### Common Issues

1. **Flaky tests** - Check wait conditions and timeouts
2. **Selector failures** - Add more fallback selectors  
3. **Timeout errors** - Increase timeout values
4. **CI failures** - Check browser installation

### Debug Commands

```bash
# Run specific test file
npx playwright test tests/e2e.spec.ts

# Run specific test by name
npx playwright test --grep "should hide navigation"

# Generate test code
npx playwright codegen http://localhost:4321

# Show test trace
npx playwright show-trace trace.zip
```

### Environment Variables

- `CI=true` - Enables CI-specific settings
- `BASE_URL` - Override base URL for tests
- `HEADLESS=false` - Run tests in headed mode

## Contributing

When adding new tests:

1. Follow existing patterns and naming conventions
2. Add proper accessibility checks for new features  
3. Include mobile test scenarios
4. Update this documentation
5. Test locally before submitting PR

## Support

For test-related issues:
- Check existing test patterns in `e2e.spec.ts`
- Review Playwright documentation
- Check CI logs for specific failures
- Add debug logging for complex scenarios