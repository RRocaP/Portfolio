# SEO Manager System

A comprehensive SEO management system for the Astro portfolio, providing automated SEO optimization, validation, and reporting.

## 🚀 Features

### Core SEO Management
- **Dynamic Meta Tag Generation** - Automatically generates optimized title, description, and meta tags
- **Multilingual Support** - Complete hreflang implementation for English, Spanish, and Catalan
- **Structured Data (JSON-LD)** - Person, Website, Article, and Breadcrumb schemas
- **Open Graph & Twitter Cards** - Social media optimization
- **Canonical URLs** - Proper canonicalization with multilingual support

### Content Analysis & Optimization
- **Content Analysis** - Reading time, word count, keyword extraction, readability scoring
- **SEO Hooks** - Automated SEO config generation from page content
- **Image Optimization** - Alt text validation and optimization suggestions
- **Performance Monitoring** - Core Web Vitals estimation and resource analysis

### Validation & Testing
- **SEO Validator** - Comprehensive rule-based validation system
- **Automated Auditing** - Full-site SEO audits with detailed reports
- **Performance Testing** - Resource counting and optimization suggestions
- **Structured Data Validation** - JSON-LD schema validation

## 📁 File Structure

```
src/utils/
├── seoManager.ts      # Core SEO management utilities
├── seoHooks.ts        # Content analysis and automation
├── seoValidator.ts    # Validation rules and testing
└── seo.tsx           # Legacy file (replaced by system above)

scripts/
└── seo-audit.mjs     # Comprehensive SEO auditing script

src/layouts/
└── Layout.astro      # Updated to use SEO Manager system
```

## 🛠️ Usage

### Basic Page Setup

```astro
---
// src/pages/research/my-article.astro
import Layout from '../../layouts/Layout.astro';

const seoConfig = {
  title: 'Antimicrobial Resistance Research | Ramon Roca Pinilla',
  description: 'Exploring novel approaches to combat antimicrobial resistance through AI-driven protein engineering and therapeutic development.',
  type: 'article',
  keywords: ['antimicrobial resistance', 'protein engineering', 'biomedical research'],
  publishedTime: '2024-01-15T10:00:00Z',
  section: 'Research',
  tags: ['research', 'antimicrobials', 'AI'],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Research', url: '/research/' },
    { name: 'Antimicrobial Resistance', url: '/research/antimicrobial-resistance/' }
  ]
};
---

<Layout {...seoConfig}>
  <article>
    <h1>Combating Antimicrobial Resistance</h1>
    <!-- Article content -->
  </article>
</Layout>
```

### Advanced Configuration

```astro
---
import { seoManager, generatePageSEO } from '../utils/seoManager';

const advancedConfig = {
  title: 'Custom Research Article',
  description: 'Detailed description of research findings...',
  type: 'article',
  image: 'https://rrocap.github.io/Portfolio/images/research-banner.jpg',
  imageAlt: 'Research laboratory with protein analysis equipment',
  keywords: ['protein folding', 'drug discovery', 'computational biology'],
  author: 'Ramon Roca Pinilla',
  publishedTime: '2024-01-15T10:00:00Z',
  modifiedTime: '2024-01-20T14:30:00Z',
  section: 'Advanced Research',
  priority: 0.9,
  changefreq: 'monthly',
  customSchema: {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": "Novel Protein Engineering Approaches",
    "author": {
      "@type": "Person",
      "name": "Ramon Roca Pinilla"
    }
  }
};

// Generate complete SEO head content
const seoHead = generatePageSEO(advancedConfig);
---

<Layout {...advancedConfig}>
  <!-- Page content -->
</Layout>
```

### Content Analysis Integration

```typescript
import { seoHooks, analyzePageContent } from '../utils/seoHooks';

// Analyze page content for SEO optimization
const content = `
  <h1>Research Article Title</h1>
  <p>Article content with relevant keywords...</p>
`;

const analysis = analyzePageContent(content);
console.log(`Reading time: ${analysis.readingTime} minutes`);
console.log(`SEO Score: ${analysis.seoScore}/100`);
console.log('Suggestions:', analysis.suggestions);

// Auto-generate SEO config from content
const autoSEO = seoHooks.generateSEOFromContent(content, '/research/article/', 'en');
```

## 🔍 SEO Auditing

### Command Line Usage

```bash
# Audit production site
npm run seo:audit

# Audit local development server
npm run seo:audit:local

# Full validation (part of preflight checks)
npm run seo:validate

# Custom URL audit
node scripts/seo-audit.mjs --url=https://example.com
```

### Audit Features

The SEO audit system checks:

- ✅ **Title Optimization** - Length, uniqueness, keyword usage
- ✅ **Meta Descriptions** - Length, compelling copy, keyword inclusion
- ✅ **Heading Structure** - H1 uniqueness, logical hierarchy
- ✅ **Image Optimization** - Alt text presence and quality
- ✅ **Canonical URLs** - Proper canonicalization
- ✅ **Hreflang Tags** - Multilingual implementation
- ✅ **Structured Data** - JSON-LD validation
- ✅ **Open Graph Tags** - Social media optimization
- ✅ **Performance Impact** - Resource counting and optimization

### Report Generation

Audits generate both JSON and HTML reports:

```
seo-reports/
├── seo-audit-2024-01-15.json   # Machine-readable data
└── seo-audit-2024-01-15.html   # Human-readable report
```

## 📊 Validation Rules

### Built-in Rules

1. **Title Length** (30-60 characters)
2. **Meta Description** (120-160 characters) 
3. **Heading Structure** (One H1, logical hierarchy)
4. **Image Alt Text** (All images must have descriptive alt text)
5. **Canonical URL** (Present and valid)
6. **Hreflang Tags** (Complete multilingual setup)
7. **Structured Data** (Valid JSON-LD)
8. **Open Graph** (Complete social media tags)
9. **Performance** (Reasonable resource count)

### Custom Validation Rules

```typescript
import { seoValidator } from '../utils/seoValidator';

// Add custom validation rule
seoValidator.addRule({
  name: 'custom-keyword-density',
  description: 'Check keyword density is within optimal range',
  category: 'content',
  severity: 'warning',
  test: async (html, config) => {
    const keywordDensity = calculateKeywordDensity(html, config?.keywords || []);
    return {
      passed: keywordDensity >= 0.5 && keywordDensity <= 3.0,
      message: `Keyword density: ${keywordDensity}%`,
      suggestion: keywordDensity < 0.5 ? 'Increase keyword usage' : keywordDensity > 3.0 ? 'Reduce keyword density' : undefined,
      score: keywordDensity >= 0.5 && keywordDensity <= 3.0 ? 100 : 70
    };
  }
});
```

## 🎯 SEO Best Practices Implemented

### Technical SEO
- Proper canonical URLs with language variants
- Complete hreflang implementation for multilingual sites
- Structured data markup (Person, Website, Article, Breadcrumbs)
- XML sitemap integration
- Robots.txt optimization

### Content SEO
- Dynamic meta tag generation
- Keyword extraction and optimization
- Content analysis and readability scoring
- Image optimization with alt text validation
- Internal linking structure validation

### Performance SEO
- Critical CSS inlining
- Resource optimization recommendations
- Core Web Vitals monitoring
- Render-blocking resource analysis

### Social SEO
- Complete Open Graph implementation
- Twitter Card optimization
- Rich snippet generation
- Social media image optimization

## 🔧 Configuration

### Environment Setup

The SEO Manager automatically detects:
- Base URL: `https://rrocap.github.io`
- Base path: `/Portfolio`
- Supported languages: `en`, `es`, `ca`
- Default images and metadata

### Customization

```typescript
// Override default settings
const customSEOManager = new SEOManager();
customSEOManager.baseUrl = 'https://custom-domain.com';
customSEOManager.defaultImage = '/custom-image.jpg';
```

## 📈 Integration with Development Workflow

### Preflight Checks
SEO validation is integrated into the preflight system:

```bash
npm run preflight  # Includes SEO validation
```

### Development Mode
- Real-time SEO scoring during development
- Content analysis feedback
- Structured data validation
- Performance impact monitoring

### CI/CD Integration
The audit script can be integrated into GitHub Actions:

```yaml
- name: SEO Audit
  run: |
    npm run build
    npm run seo:audit
    # Upload reports to artifacts
```

## 🚀 Advanced Features

### Automated Content Analysis
- Reading time estimation
- Keyword extraction using TF-IDF
- Readability scoring (Flesch scale)
- Content structure analysis

### Performance Integration
- Critical resource identification
- Core Web Vitals estimation
- Bundle size impact analysis
- Loading performance recommendations

### Multilingual Optimization
- Language-specific SEO rules
- Cultural adaptation suggestions
- Regional search optimization
- hreflang cluster validation

## 🔮 Future Enhancements

Planned features for the SEO Manager system:

1. **AI-Powered Content Analysis** - GPT integration for content optimization
2. **Competitor Analysis** - Automated competitive SEO insights
3. **Real-time Monitoring** - Live SEO performance tracking
4. **A/B Testing Integration** - SEO split testing capabilities
5. **Advanced Schema Support** - Additional JSON-LD schema types
6. **International SEO** - Advanced multi-region optimization

## 📝 Contributing

When adding new SEO features:

1. Add validation rules to `seoValidator.ts`
2. Update the audit script with new checks
3. Extend the SEO Manager with new utilities
4. Add tests for new functionality
5. Update this documentation

## 🐛 Troubleshooting

### Common Issues

**Q: SEO audit fails with network errors**
A: Ensure the development server is running (`npm run dev`) for local audits

**Q: Structured data validation errors** 
A: Use Google's Rich Results Test tool for detailed validation

**Q: Hreflang warnings**
A: Verify all language variants exist and are properly configured

**Q: Performance scores are low**
A: Review resource loading and implement suggested optimizations

### Debug Mode

Enable detailed logging:

```bash
DEBUG=seo:* npm run seo:audit
```

This comprehensive SEO Manager system provides enterprise-level SEO optimization for the Portfolio site, ensuring maximum search engine visibility and performance.