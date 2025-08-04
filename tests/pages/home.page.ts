import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  // Hero Section
  readonly hero: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroTagline: Locator;
  readonly heroCTALearnMore: Locator;
  readonly heroCTAContact: Locator;
  readonly heroScrollIndicator: Locator;

  // Navigation
  readonly navigation: Locator;
  readonly navHome: Locator;
  readonly navResearch: Locator;
  readonly navTimeline: Locator;
  readonly navPublications: Locator;
  readonly navContact: Locator;
  readonly mobileMenuToggle: Locator;
  readonly languageSwitcher: Locator;

  // Sections
  readonly aboutSection: Locator;
  readonly journeySection: Locator;
  readonly researchSection: Locator;
  readonly publicationsSection: Locator;
  readonly contactSection: Locator;

  // Stats Cards
  readonly statsCards: Locator;
  readonly publicationsCount: Locator;
  readonly patentsCount: Locator;
  readonly yearsResearchCount: Locator;

  // Research Cards
  readonly researchCards: Locator;
  readonly antimicrobialCard: Locator;
  readonly geneTherapyCard: Locator;
  readonly screeningCard: Locator;

  // Publications
  readonly publicationsFilter: Locator;
  readonly publicationCards: Locator;
  readonly filterAll: Locator;
  readonly filterPeptides: Locator;
  readonly filterGeneTherapy: Locator;
  readonly filterAIML: Locator;

  // Contact
  readonly contactCards: Locator;
  readonly emailLink: Locator;
  readonly linkedinLink: Locator;
  readonly githubLink: Locator;
  readonly appleMusicLink: Locator;

  // Timeline
  readonly timelineItems: Locator;
  readonly interactiveTimeline: Locator;

  // Footer
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);

    // Hero Section
    this.hero = this.page.locator('section.hero');
    this.heroTitle = this.page.locator('.hero-title');
    this.heroSubtitle = this.page.locator('.hero-subtitle');
    this.heroTagline = this.page.locator('.hero-tagline');
    this.heroCTALearnMore = this.page.locator('a[href="#about"]');
    this.heroCTAContact = this.page.locator('a[href="#contact"]');
    this.heroScrollIndicator = this.page.locator('.hero-scroll-indicator');

    // Navigation
    this.navigation = this.page.locator('nav');
    this.navHome = this.page.locator('a[href="#home"]');
    this.navResearch = this.page.locator('a[href="#research"]');
    this.navTimeline = this.page.locator('a[href="#journey"]');
    this.navPublications = this.page.locator('a[href="#publications"]');
    this.navContact = this.page.locator('a[href="#contact"]');
    this.mobileMenuToggle = this.page.locator('.mobile-menu-toggle');
    this.languageSwitcher = this.page.locator('.language-switcher');

    // Sections
    this.aboutSection = this.page.locator('#about');
    this.journeySection = this.page.locator('#journey');
    this.researchSection = this.page.locator('#research');
    this.publicationsSection = this.page.locator('#publications');
    this.contactSection = this.page.locator('#contact');

    // Stats Cards
    this.statsCards = this.page.locator('.stat-card');
    this.publicationsCount = this.page.locator('[data-count="16"]');
    this.patentsCount = this.page.locator('[data-count="3"]');
    this.yearsResearchCount = this.page.locator('[data-count="10"]');

    // Research Cards
    this.researchCards = this.page.locator('.research-card');
    this.antimicrobialCard = this.researchCards.filter({ hasText: 'AI-Designed Antimicrobials' });
    this.geneTherapyCard = this.researchCards.filter({ hasText: 'Gene Therapy Optimization' });
    this.screeningCard = this.researchCards.filter({ hasText: 'High-Throughput Screening' });

    // Publications
    this.publicationsFilter = this.page.locator('.publications-filter');
    this.publicationCards = this.page.locator('.publication-card');
    this.filterAll = this.page.locator('[data-filter="all"]');
    this.filterPeptides = this.page.locator('[data-filter="peptides"]');
    this.filterGeneTherapy = this.page.locator('[data-filter="gene-therapy"]');
    this.filterAIML = this.page.locator('[data-filter="ai-ml"]');

    // Contact
    this.contactCards = this.page.locator('.contact-card');
    this.emailLink = this.page.locator('a[href="mailto:ramon.rocap@gmail.com"]');
    this.linkedinLink = this.page.locator('a[href*="linkedin.com"]');
    this.githubLink = this.page.locator('a[href*="github.com"]');
    this.appleMusicLink = this.page.locator('a[href*="music.apple.com"]');

    // Timeline
    this.timelineItems = this.page.locator('.timeline-item');
    this.interactiveTimeline = this.page.locator('.timeline-section');

    // Footer
    this.footer = this.page.locator('footer');
  }

  async goto() {
    await super.goto('/');
    await this.waitForLoadState();
  }

  async gotoLanguage(lang: 'en' | 'es' | 'ca') {
    await super.goto(`/${lang}/`);
    await this.waitForLoadState();
  }

  async scrollToSection(sectionId: string) {
    await this.page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
    await this.waitForAnimation();
  }

  async clickNavItem(item: 'home' | 'research' | 'timeline' | 'publications' | 'contact') {
    const navMap = {
      home: this.navHome,
      research: this.navResearch,
      timeline: this.navTimeline,
      publications: this.navPublications,
      contact: this.navContact
    };

    await navMap[item].click();
    await this.waitForAnimation();
  }

  async filterPublications(filter: 'all' | 'peptides' | 'gene-therapy' | 'ai-ml') {
    const filterMap = {
      all: this.filterAll,
      peptides: this.filterPeptides,
      'gene-therapy': this.filterGeneTherapy,
      'ai-ml': this.filterAIML
    };

    await filterMap[filter].click();
    await this.waitForAnimation();
  }

  async validateHeroSection() {
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroTitle).toContainText('Ramon Roca Pinilla');
    
    await expect(this.heroSubtitle).toBeVisible();
    await expect(this.heroSubtitle).toContainText('Biomedical Engineer');
    
    await expect(this.heroTagline).toBeVisible();
    await expect(this.heroCTALearnMore).toBeVisible();
    await expect(this.heroCTAContact).toBeVisible();
  }

  async validateNavigation() {
    await expect(this.navigation).toBeVisible();
    await expect(this.navHome).toBeVisible();
    await expect(this.navResearch).toBeVisible();
    await expect(this.navTimeline).toBeVisible();
    await expect(this.navPublications).toBeVisible();
    await expect(this.navContact).toBeVisible();
  }

  async validateSectionsVisible() {
    const sections = [
      this.aboutSection,
      this.journeySection,
      this.researchSection,
      this.publicationsSection,
      this.contactSection
    ];

    for (const section of sections) {
      await this.scrollToElement(await section.getAttribute('id') || '');
      await expect(section).toBeVisible();
    }
  }

  async validateStatsAnimation() {
    await this.scrollToSection('about');
    
    // Wait for stats to be visible and animated
    await expect(this.publicationsCount).toBeVisible();
    await expect(this.patentsCount).toBeVisible();
    await expect(this.yearsResearchCount).toBeVisible();
    
    // Check that counters have animated (should contain numbers)
    await expect(this.publicationsCount).toContainText('16');
    await expect(this.patentsCount).toContainText('3');
    await expect(this.yearsResearchCount).toContainText('10');
  }

  async validateResearchCards() {
    await this.scrollToSection('research');
    
    await expect(this.antimicrobialCard).toBeVisible();
    await expect(this.geneTherapyCard).toBeVisible();
    await expect(this.screeningCard).toBeVisible();
    
    // Check for card interactions
    await this.antimicrobialCard.hover();
    await this.geneTherapyCard.hover();
    await this.screeningCard.hover();
  }

  async validatePublicationsFilter() {
    await this.scrollToSection('publications');
    
    // Test filter functionality
    await this.filterPeptides.click();
    await this.waitForAnimation();
    
    // Check if peptides publications are visible
    const peptidesCards = this.publicationCards.filter({ hasText: 'peptide' });
    if (await peptidesCards.count() > 0) {
      await expect(peptidesCards.first()).toBeVisible();
    }
    
    // Reset filter
    await this.filterAll.click();
    await this.waitForAnimation();
  }

  async validateContactSection() {
    await this.scrollToSection('contact');
    
    await expect(this.emailLink).toBeVisible();
    await expect(this.linkedinLink).toBeVisible();
    await expect(this.githubLink).toBeVisible();
    await expect(this.appleMusicLink).toBeVisible();
  }

  async validateExternalLinks() {
    const externalLinks = await this.checkExternalLinks('a[href^="http"]');
    
    // Validate that external links have proper security attributes
    for (const link of externalLinks) {
      expect(link.opensInNewTab).toBeTruthy();
      expect(link.hasNoopener || link.hasNoreferrer).toBeTruthy();
    }
    
    return externalLinks;
  }

  async validateSmoothScrolling() {
    // Test smooth scrolling between sections
    const sections = ['about', 'research', 'publications', 'contact'];
    
    for (const section of sections) {
      await this.clickNavItem(section as any);
      await this.page.waitForTimeout(1000); // Wait for scroll animation
      
      const sectionElement = this.page.locator(`#${section}`);
      await expect(sectionElement).toBeInViewport();
    }
  }

  async validateInteractiveElements() {
    // Test interactive timeline
    await this.scrollToSection('research');
    
    if (await this.interactiveTimeline.isVisible()) {
      await expect(this.interactiveTimeline).toBeVisible();
    }
    
    // Test hover effects on cards
    const cards = await this.researchCards.all();
    for (const card of cards) {
      await card.hover();
      await this.page.waitForTimeout(100);
    }
  }

  async testMobileMenu() {
    // This test should be run with mobile viewport
    if (await this.mobileMenuToggle.isVisible()) {
      await this.mobileMenuToggle.click();
      await this.waitForAnimation();
      
      // Check if mobile menu items are visible
      await expect(this.navHome).toBeVisible();
      await expect(this.navResearch).toBeVisible();
      
      // Close menu
      await this.mobileMenuToggle.click();
      await this.waitForAnimation();
    }
  }
}