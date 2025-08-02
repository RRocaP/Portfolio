# Changelog

## [3.0.0] - 2024-08-02

### Breaking Changes
- Complete bold dark-red design system (#2B0000 primary, #400000 surface, #FFD300 accent)
- Proper i18n with locale strings (en/es/ca) replacing hardcoded text
- Component architecture refactor with TypeScript interfaces
- 12-column CSS Grid system (max-width 1280px)
- Font migration to @fontsource-variable (Inter + Playfair Display)

### Features
- WCAG 2.1-AA contrast compliance
- Skip links and focus management
- Enhanced antibiotic timeline with Roma colormap and white text
- Single deploy.yml workflow with concurrency
- Bundle optimization <25kB CSS, <35kB JS
- Responsive typography with justified text
