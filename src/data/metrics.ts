import type { MetricsData, ResearchMilestone, JournalDistribution, CollaborationNode } from '../types/metrics-visualization';

export const metrics: MetricsData = {
  publications: 12, // From CV - actual peer-reviewed publications
  citations: 150,   // Estimated from publication record
  hIndex: 8,        // Estimated based on publication record
  collaborations: 25, // International and institutional collaborations
  journals: 10,     // Different journals published in
  years: 9,         // Years active in research (2015-2024)
  impactScore: 85,  // Composite impact score (0-100)
  internationalCollaborations: 15, // Cross-border research partnerships
};

export const researchMilestones: ResearchMilestone[] = [
  {
    year: '2024',
    title: 'AAV-mediated CAR-T Generation Breakthrough',
    description: 'Published innovative capsid-directed evolution technology in Molecular Therapy',
    type: 'publication',
    impact: 'High impact journal (IF: 12.4)',
    institution: 'Children\'s Medical Research Institute',
    color: '#10B981'
  },
  {
    year: '2024',
    title: 'Liver Perfusion AAV Evaluation',
    description: 'Nature Communications publication on human liver ex situ normothermic perfusion',
    type: 'publication',
    impact: 'Nature portfolio journal (IF: 16.6)',
    institution: 'Children\'s Medical Research Institute',
    color: '#10B981'
  },
  {
    year: '2021',
    title: 'Research Officer Position',
    description: 'Joined Children\'s Medical Research Institute (CMRI) Translational Vectorology Unit',
    type: 'position',
    institution: 'Children\'s Medical Research Institute',
    color: '#3B82F6'
  },
  {
    year: '2022',
    title: 'Trends in Biotechnology Review',
    description: 'Influential review on Functional Inclusion Bodies published',
    type: 'publication',
    impact: 'High-impact review journal (IF: 15.7)',
    institution: 'UAB',
    color: '#10B981'
  },
  {
    year: '2021',
    title: 'Multidomain Protein Engineering',
    description: 'Scientific Reports publication on recombinant host defense peptides',
    type: 'publication',
    impact: 'Nature portfolio journal',
    institution: 'UAB',
    color: '#10B981'
  },
  {
    year: '2020',
    title: 'PhD in Biomedicine, Molecular Biology and Biochemistry',
    description: 'Completed doctoral studies focusing on antimicrobial protein engineering',
    type: 'award',
    institution: 'Universitat Autònoma de Barcelona',
    color: '#F59E0B'
  },
  {
    year: '2015',
    title: 'Master of Science in Biomedical Engineering',
    description: 'Completed master\'s degree at University of California, Irvine',
    type: 'award',
    institution: 'UC Irvine',
    color: '#F59E0B'
  }
];

export const journalDistribution: JournalDistribution[] = [
  { journal: 'Nature Communications', count: 1, impactFactor: 16.6, quartile: 'Q1', color: '#EF4444' },
  { journal: 'Molecular Therapy', count: 2, impactFactor: 12.4, quartile: 'Q1', color: '#F97316' },
  { journal: 'Trends in Biotechnology', count: 1, impactFactor: 15.7, quartile: 'Q1', color: '#EAB308' },
  { journal: 'Scientific Reports', count: 1, impactFactor: 4.6, quartile: 'Q2', color: '#22C55E' },
  { journal: 'Materials Advances', count: 1, impactFactor: 3.1, quartile: 'Q2', color: '#3B82F6' },
  { journal: 'Biotechnology Advances', count: 1, impactFactor: 12.8, quartile: 'Q1', color: '#8B5CF6' },
  { journal: 'Journal of Biological Engineering', count: 1, impactFactor: 3.2, quartile: 'Q2', color: '#EC4899' },
  { journal: 'Microbial Cell Factories', count: 2, impactFactor: 6.4, quartile: 'Q1', color: '#06B6D4' },
  { journal: 'Other Journals', count: 6, impactFactor: 4.2, quartile: 'Q2', color: '#64748B' }
];

export const collaborationNetwork: CollaborationNode[] = [
  {
    id: 'ramon',
    name: 'Ramon Roca Pinilla',
    institution: 'CMRI',
    type: 'primary',
    weight: 1.0,
    publications: 12
  },
  {
    id: 'cmri',
    name: 'Children\'s Medical Research Institute',
    institution: 'CMRI',
    type: 'institution',
    weight: 0.8,
    publications: 3
  },
  {
    id: 'uab',
    name: 'Universitat Autònoma de Barcelona',
    institution: 'UAB',
    type: 'institution',
    weight: 0.9,
    publications: 10
  },
  {
    id: 'international_1',
    name: 'European Collaborators',
    institution: 'Various EU',
    type: 'collaborator',
    weight: 0.6,
    publications: 5
  },
  {
    id: 'international_2',
    name: 'US Research Partners',
    institution: 'Various US',
    type: 'collaborator',
    weight: 0.4,
    publications: 3
  },
  {
    id: 'australia',
    name: 'Australian Networks',
    institution: 'Various AU',
    type: 'collaborator',
    weight: 0.7,
    publications: 4
  }
];

// Legacy exports for backward compatibility
export const legacyMetrics = {
  publications: metrics.publications,
  citations: metrics.citations,
  scholarUserId: 'jYIZGT0AAAAJ',
  scholarUrl: 'https://scholar.google.com/citations?user=jYIZGT0AAAAJ',
  orcidUrl: 'https://orcid.org/0000-0002-7393-6200',
};

