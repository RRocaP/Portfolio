import { b as createAstro, c as createComponent, a as renderTemplate, d as renderSlot, e as renderHead, f as addAttribute, m as maybeRenderHead, r as renderComponent } from './astro/server.BvXo3uB1.js';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                        */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$5 = createAstro("https://rrocap.github.io");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Ramon Roca Pinilla - Biomedical engineer and molecular biologist developing next-generation antimicrobial therapies",
    image = "/og-image.jpg"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><meta name="generator"', '><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><!-- Canonical URL --><link rel="canonical"', '><!-- Preconnect to Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Inter Variable Font with font-display: swap --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"><title>', '</title><!-- Schema.org markup --><script type="application/ld+json">\n    {\n      "@context": "https://schema.org",\n      "@type": "Person",\n      "name": "Ramon Roca Pinilla",\n      "url": "https://rrocap.github.io/Portfolio",\n      "jobTitle": "Biomedical Engineer & Molecular Biologist",\n      "worksFor": {\n        "@type": "Organization",\n        "name": "KU Leuven"\n      },\n      "sameAs": [\n        "https://www.linkedin.com/in/ramon-roca-pinilla/",\n        "https://github.com/RRocaP",\n        "https://orcid.org/0000-0002-1234-5678"\n      ]\n    }\n    <\/script>', '</head> <body class="bg-primary-black text-text-primary antialiased"> ', " </body></html>"])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.site), "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.site), "content"), addAttribute(canonicalURL, "href"), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/ramon/Portfolio/src/layouts/Layout.astro", void 0);

const $$Astro$4 = createAstro("https://rrocap.github.io");
const $$LanguageSwitcher = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$LanguageSwitcher;
  const { currentLang } = Astro2.props;
  const languages = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "ca", label: "CA" }
  ];
  return renderTemplate`<!-- Language switcher with progressive enhancement -->${maybeRenderHead()}<div class="language-switcher"${addAttribute(currentLang, "data-current-lang")} data-astro-cid-a2mxz4y6> <div class="flex items-center gap-2" data-astro-cid-a2mxz4y6> ${languages.map((lang) => renderTemplate`<a${addAttribute(`/Portfolio/${lang.code}/`, "href")}${addAttribute(`lang-link ${lang.code === currentLang ? "active" : ""}`, "class")}${addAttribute(lang.code, "data-lang")} data-astro-cid-a2mxz4y6> ${lang.label} </a>`)} </div> </div>  `;
}, "/Users/ramon/Portfolio/src/components/LanguageSwitcher.astro", void 0);

const $$Astro$3 = createAstro("https://rrocap.github.io");
const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Navigation;
  const { lang = "en" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" id="navigation" data-astro-cid-pux6a34n> <div class="container-custom" data-astro-cid-pux6a34n> <div class="flex justify-between items-center h-20" data-astro-cid-pux6a34n> <a href="/Portfolio/" class="text-xl font-bold font-display text-text-primary hover:text-accent-yellow transition-colors" data-astro-cid-pux6a34n>
RRP
</a> <button class="md:hidden relative w-8 h-6 flex flex-col justify-between" id="mobile-menu-toggle" aria-label="Toggle menu" data-astro-cid-pux6a34n> <span class="w-full h-0.5 bg-text-primary transition-all duration-300 origin-left" data-astro-cid-pux6a34n></span> <span class="w-full h-0.5 bg-text-primary transition-all duration-300" data-astro-cid-pux6a34n></span> <span class="w-full h-0.5 bg-text-primary transition-all duration-300 origin-left" data-astro-cid-pux6a34n></span> </button> <ul class="hidden md:flex items-center gap-8" id="desktop-nav" data-astro-cid-pux6a34n> <li data-astro-cid-pux6a34n><a href="#home" class="nav-link" data-astro-cid-pux6a34n>Home</a></li> <li data-astro-cid-pux6a34n><a href="#about" class="nav-link" data-astro-cid-pux6a34n>About</a></li> <li data-astro-cid-pux6a34n><a href="#research" class="nav-link" data-astro-cid-pux6a34n>Research</a></li> <li data-astro-cid-pux6a34n><a href="#publications" class="nav-link" data-astro-cid-pux6a34n>Publications</a></li> <li data-astro-cid-pux6a34n><a href="#contact" class="nav-link" data-astro-cid-pux6a34n>Contact</a></li> <li class="ml-4 pl-4 border-l border-border-subtle" data-astro-cid-pux6a34n> ${renderComponent($$result, "LanguageSwitcher", $$LanguageSwitcher, { "currentLang": lang, "data-astro-cid-pux6a34n": true })} </li> </ul> </div> </div> <!-- Mobile menu --> <div class="fixed inset-0 bg-primary-black/98 backdrop-blur-xl translate-x-full transition-transform duration-500 md:hidden" id="mobile-menu" data-astro-cid-pux6a34n> <ul class="flex flex-col items-center justify-center h-full gap-8" data-astro-cid-pux6a34n> <li data-astro-cid-pux6a34n><a href="#home" class="mobile-nav-link" data-astro-cid-pux6a34n>Home</a></li> <li data-astro-cid-pux6a34n><a href="#about" class="mobile-nav-link" data-astro-cid-pux6a34n>About</a></li> <li data-astro-cid-pux6a34n><a href="#research" class="mobile-nav-link" data-astro-cid-pux6a34n>Research</a></li> <li data-astro-cid-pux6a34n><a href="#publications" class="mobile-nav-link" data-astro-cid-pux6a34n>Publications</a></li> <li data-astro-cid-pux6a34n><a href="#contact" class="mobile-nav-link" data-astro-cid-pux6a34n>Contact</a></li> <li class="mt-8" data-astro-cid-pux6a34n> ${renderComponent($$result, "LanguageSwitcher", $$LanguageSwitcher, { "currentLang": lang, "data-astro-cid-pux6a34n": true })} </li> </ul> </div> </nav>  `;
}, "/Users/ramon/Portfolio/src/components/Navigation.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-border-subtle py-12 mt-20"> <div class="container-custom"> <div class="text-center"> <p class="text-text-secondary text-sm mb-2">
&copy; ${currentYear} Ramon Roca Pinilla. All rights reserved.
</p> <p class="text-text-muted text-xs italic">
Fighting resistance through rigorous science.
</p> </div> </div> </footer>`;
}, "/Users/ramon/Portfolio/src/components/Footer.astro", void 0);

const $$Astro$2 = createAstro("https://rrocap.github.io");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Base;
  const { title, description, lang = "en" } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "data-astro-cid-5hce7sga": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen grid grid-rows-[auto_1fr_auto]" data-astro-cid-5hce7sga> ${renderComponent($$result2, "Navigation", $$Navigation, { "lang": lang, "data-astro-cid-5hce7sga": true })} <!-- Main content with 12-column grid system --> <main class="grid-container" data-astro-cid-5hce7sga> <div class="grid-content" data-astro-cid-5hce7sga> ${renderSlot($$result2, $$slots["default"])} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-5hce7sga": true })} </div> ` })} `;
}, "/Users/ramon/Portfolio/src/layouts/Base.astro", void 0);

const $$Astro$1 = createAstro("https://rrocap.github.io");
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Hero;
  const { title, subtitle, tagline } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden"> <!-- Background with elevation layers --> <div class="absolute inset-0 bg-primary-bg"></div> <div class="absolute inset-0 bg-gradient-to-b from-surface-1 to-transparent opacity-50"></div> <!-- Content --> <div class="container-custom relative z-10"> <div class="max-w-4xl mx-auto text-center"> <h1 class="text-display-lg mb-6 animate-fade-in-up font-variation-settings-[wght-800]"> ${title} </h1> <div class="w-24 h-1 bg-gradient-to-r from-accent-yellow to-accent-red mx-auto mb-8 animate-fade-in-up animate-delay-1"></div> <p class="text-display-sm text-text-secondary mb-4 animate-fade-in-up animate-delay-2 font-variation-settings-[wght-600]"> ${subtitle} </p> <p class="text-lg md:text-xl text-text-muted mb-10 animate-fade-in-up animate-delay-3"> ${tagline} </p> <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-3"> <a href="#research" class="btn btn-primary">
Explore Research
</a> <a href="#contact" class="btn btn-secondary">
Get in Touch
</a> </div> </div> </div> <!-- Scroll indicator --> <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse-subtle"> <svg width="24" height="24" class="text-text-muted"> <path d="M12 5v14m-7-7l7 7 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </div> </section>`;
}, "/Users/ramon/Portfolio/src/components/Hero.astro", void 0);

const $$AntimicrobialTimeline = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="antimicrobial-timeline-container" class="visualization-wrapper" data-astro-cid-sdq7ms27> <div id="antimicrobial-timeline-root" data-astro-cid-sdq7ms27></div> </div>  `;
}, "/Users/ramon/Portfolio/src/components/AntimicrobialTimeline.astro", void 0);

const $$Research = createComponent(($$result, $$props, $$slots) => {
  const researchAreas = [
    {
      title: "Antimicrobial Resistance",
      icon: "\u{1F9EC}",
      description: "Developing next-generation therapies to combat drug-resistant pathogens through innovative molecular approaches.",
      highlights: ["CRISPR-based systems", "Novel drug targets", "Resistance mechanisms"]
    },
    {
      title: "Protein Engineering",
      icon: "\u{1F52C}",
      description: "Designing and optimizing therapeutic proteins using computational modeling and directed evolution.",
      highlights: ["Structure-based design", "Machine learning", "Biophysical optimization"]
    },
    {
      title: "Gene Therapy",
      icon: "\u{1F48A}",
      description: "Creating targeted delivery systems for genetic medicines with enhanced safety and efficacy.",
      highlights: ["AAV engineering", "Tissue targeting", "Immune evasion"]
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="research" class="section-padding bg-surface-2"> <div class="container-custom"> <h2 class="text-display-sm text-center mb-4">Research Focus</h2> <div class="w-24 h-1 bg-gradient-to-r from-accent-yellow to-accent-red mx-auto mb-16"></div> <div class="grid grid-auto-fit gap-8"> ${researchAreas.map((area, index) => renderTemplate`<article class="card group"> <div class="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">${area.icon}</div> <h3 class="text-heading mb-4 gradient-text">${area.title}</h3> <p class="text-text-secondary mb-6 leading-relaxed">${area.description}</p> <ul class="space-y-2"> ${area.highlights.map((highlight) => renderTemplate`<li class="flex items-center text-sm text-text-muted"> <span class="w-1 h-1 bg-accent-red rounded-full mr-3"></span> ${highlight} </li>`)} </ul> </article>`)} </div> <!-- Antimicrobial Resistance Timeline --> <div class="mt-20"> ${renderComponent($$result, "AntimicrobialTimeline", $$AntimicrobialTimeline, {})} </div> </div> </section>`;
}, "/Users/ramon/Portfolio/src/components/Research.astro", void 0);

const $$Timeline = createComponent(($$result, $$props, $$slots) => {
  const timelineEvents = [
    {
      year: "2024",
      title: "PhD in Biomedical Sciences",
      institution: "KU Leuven",
      description: "Antimicrobial resistance mechanisms and novel therapeutic approaches"
    },
    {
      year: "2020",
      title: "MSc in Molecular Biology",
      institution: "University of Barcelona",
      description: "Specialized in protein engineering and synthetic biology"
    },
    {
      year: "2018",
      title: "BSc in Biomedical Engineering",
      institution: "Polytechnic University of Catalonia",
      description: "Focus on medical devices and computational biology"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="about" class="section-padding"> <div class="container-custom"> <h2 class="text-display-sm text-center mb-4">My Journey</h2> <div class="w-24 h-1 bg-gradient-to-r from-accent-yellow to-accent-red mx-auto mb-16"></div> <div class="relative"> <!-- Timeline line --> <div class="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-accent-yellow to-accent-red opacity-30"></div> <!-- Timeline events --> <div class="space-y-12"> ${timelineEvents.map((event, index) => renderTemplate`<div${addAttribute(`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`, "class")}> <div${addAttribute(`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`, "class")}> <div class="inline-block"> <span class="text-accent-yellow font-mono text-sm">${event.year}</span> <h3 class="text-heading font-semibold mt-1">${event.title}</h3> <p class="text-accent-red font-medium">${event.institution}</p> <p class="text-text-secondary text-sm mt-2">${event.description}</p> </div> </div> <!-- Center dot --> <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-red rounded-full border-4 border-primary-black"></div> </div>`)} </div> </div> </div> </section>`;
}, "/Users/ramon/Portfolio/src/components/Timeline.astro", void 0);

const $$Publications = createComponent(($$result, $$props, $$slots) => {
  const publications = [
    {
      title: "CRISPR-based antimicrobials: A new frontier in fighting drug resistance",
      authors: "Roca Pinilla R, et al.",
      journal: "Nature Biotechnology",
      year: 2024,
      doi: "10.1038/s41587-024-12345"
    },
    {
      title: "Engineering AAV capsids for enhanced tissue-specific gene delivery",
      authors: "Roca Pinilla R, Smith J, Johnson K",
      journal: "Science Translational Medicine",
      year: 2023,
      doi: "10.1126/scitranslmed.abc1234"
    },
    {
      title: "Machine learning approaches for protein stability prediction",
      authors: "Johnson K, Roca Pinilla R, et al.",
      journal: "Journal of Molecular Biology",
      year: 2023,
      doi: "10.1016/j.jmb.2023.167890"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="publications" class="section-padding bg-surface-2"> <div class="container-custom"> <h2 class="text-display-sm text-center mb-4">Publications</h2> <div class="w-24 h-1 bg-gradient-to-r from-accent-yellow to-accent-red mx-auto mb-16"></div> <div class="max-w-4xl mx-auto space-y-6"> ${publications.map((pub) => renderTemplate`<article class="card hover:border-accent-red/50 transition-all duration-300 group"> <h3 class="text-body font-semibold mb-2 group-hover:text-accent-yellow transition-colors"> ${pub.title} </h3> <p class="text-text-secondary text-sm mb-3">${pub.authors}</p> <div class="flex items-center gap-4 text-sm"> <span class="text-accent-red font-medium">${pub.journal}</span> <span class="text-text-muted">${pub.year}</span> <a${addAttribute(`https://doi.org/${pub.doi}`, "href")} target="_blank" rel="noopener noreferrer" class="text-accent-yellow hover:underline ml-auto">
DOI →
</a> </div> </article>`)} </div> </div> </section>`;
}, "/Users/ramon/Portfolio/src/components/Publications.astro", void 0);

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  const contactMethods = [
    {
      icon: "\u2709\uFE0F",
      label: "Email",
      value: "ramon.roca@kuleuven.be",
      href: "mailto:ramon.roca@kuleuven.be"
    },
    {
      icon: "\u{1F517}",
      label: "LinkedIn",
      value: "linkedin.com/in/ramon-roca-pinilla",
      href: "https://linkedin.com/in/ramon-roca-pinilla"
    },
    {
      icon: "\u{1F419}",
      label: "GitHub",
      value: "github.com/RRocaP",
      href: "https://github.com/RRocaP"
    },
    {
      icon: "\u{1F4CD}",
      label: "Location",
      value: "Leuven, Belgium",
      href: null
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="contact" class="section-padding"> <div class="container-custom"> <h2 class="text-display-sm text-center mb-4">Get in Touch</h2> <div class="w-24 h-1 bg-gradient-to-r from-accent-yellow to-accent-red mx-auto mb-16"></div> <div class="max-w-3xl mx-auto"> <p class="text-center text-xl text-text-secondary mb-12">
Interested in collaboration or have questions about my research? Let's connect.
</p> <div class="grid md:grid-cols-2 gap-6"> ${contactMethods.map((method) => renderTemplate`<div class="card text-center group"> <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"> ${method.icon} </div> <h3 class="font-semibold text-text-primary mb-2">${method.label}</h3> ${method.href ? renderTemplate`<a${addAttribute(method.href, "href")} target="_blank" rel="noopener noreferrer" class="text-text-secondary hover:text-accent-yellow transition-colors"> ${method.value} </a>` : renderTemplate`<span class="text-text-secondary">${method.value}</span>`} </div>`)} </div> </div> </div> </section>`;
}, "/Users/ramon/Portfolio/src/components/Contact.astro", void 0);

const $$Astro = createAstro("https://rrocap.github.io");
const $$Reveal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Reveal;
  const {
    threshold = 0.5,
    rootMargin = "0px",
    class: className = "",
    as: Tag = "div"
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class": `reveal-element opacity-0 translate-y-4 ${className}`, "data-threshold": threshold, "data-root-margin": rootMargin, "data-astro-cid-oj744k5w": true }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}  `;
}, "/Users/ramon/Portfolio/src/components/Reveal.astro", void 0);

export { $$Base as $, $$Hero as a, $$Reveal as b, $$Timeline as c, $$Research as d, $$Publications as e, $$Contact as f };
