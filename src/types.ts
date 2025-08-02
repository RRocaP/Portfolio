export type Lang = 'en' | 'es' | 'ca';

export interface Strings {
  nav: {
    home: string;
    research: string;
    timeline: string;
    publications: string;
    contact: string;
  };
  hero: {
    name: string;
    title: string;
    tagline: string;
    cta_research: string;
    cta_contact: string;
  };
  research: {
    title: string;
    areas: {
      antimicrobial: {
        title: string;
        description: string;
        highlights: string[];
      };
      protein: {
        title: string;
        description: string;
        highlights: string[];
      };
      gene: {
        title: string;
        description: string;
        highlights: string[];
      };
    };
  };
  timeline: {
    title: string;
    institutions: {
      uab: string;
      ku_leuven: string;
    };
  };
  publications: {
    title: string;
    view_all: string;
  };
  contact: {
    title: string;
    description: string;
    email: string;
    linkedin: string;
    github: string;
    orcid: string;
  };
  footer: {
    copyright: string;
    built_with: string;
  };
}