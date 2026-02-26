import type { MetricsData, ResearchMilestone, JournalDistribution, CollaborationNode } from '../types/metrics-visualization';
import { publicationAnalytics } from './publications.js';

// Google Scholar verified metrics (2026-02-25)
export const scholarMetrics = {
  citations: 291,
  hIndex: 9,
  i10Index: 8,
  publications: 16,
  firstAuthorPublications: 7,
  lastVerified: '2026-02-25',
  profileUrl: 'https://scholar.google.com/citations?user=jYIZGT0AAAAJ',
  interests: ['AI', 'Antimicrobial resistance', 'Antimicrobial peptides', 'Gene therapy', 'Capsid bioengineering'],
};

// Calculate real-time metrics from publication data
const calculateRealTimeMetrics = (): MetricsData => {
  const impactMetrics = publicationAnalytics.getImpactMetrics();
  const collaborationData = publicationAnalytics.getCollaborationAnalysis();
  const journalData = publicationAnalytics.getJournalDistribution();

  return {
    publications: publicationAnalytics.getFeatured().length + publicationAnalytics.getRecent().length, // Current total
    citations: impactMetrics.totalCitations,
    hIndex: impactMetrics.hIndex,
    collaborations: collaborationData.national + collaborationData.international + (collaborationData.institutional || 0),
    journals: Object.keys(journalData).length,
    years: new Date().getFullYear() - 2015, // Research years since 2015
    impactScore: Math.round(
      (impactMetrics.hIndex * 10) +
      (impactMetrics.avgCitationsPerPub * 2) +
      (impactMetrics.openAccessPercentage * 0.3) +
      (publicationAnalytics.getAvgImpactFactor() * 5)
    ), // Dynamic composite score
    internationalCollaborations: collaborationData.international,
  };
};

export const metrics: MetricsData = calculateRealTimeMetrics();

export const researchMilestones: ResearchMilestone[] = [
  {
    year: '2025',
    title: 'Molecular Therapy Publications',
    description: 'First-author paper on capsid-directed evolution for CAR-T generation plus co-authored preclinical CTNNB1 gene therapy study',
    type: 'publication',
    impact: 'Cell Press journal (IF: 12.1)',
    institution: 'Children\'s Medical Research Institute',
    color: '#10B981'
  },
  {
    year: '2024',
    title: 'Nature Communications Publication',
    description: 'Co-authored research on human liver ex situ normothermic perfusion for AAV vector evaluation',
    type: 'publication',
    impact: 'Nature portfolio journal (IF: 14.7)',
    institution: 'Children\'s Medical Research Institute',
    color: '#10B981'
  },
  {
    year: '2023',
    title: 'Antibiofilm Surfaces Research',
    description: 'Second author on Materials Advances paper on antimicrobial protein immobilization',
    type: 'publication',
    impact: 'RSC journal (IF: 3.1)',
    institution: 'International collaboration',
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
    year: '2020',
    title: 'First Author Publication',
    description: 'Lead author on multidomain antimicrobial protein research in Microbial Cell Factories',
    type: 'publication',
    impact: 'BMC journal (IF: 6.4)',
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

// Generate dynamic journal distribution from publications data
const generateJournalDistribution = (): JournalDistribution[] => {
  const journalData = publicationAnalytics.getJournalDistribution();
  const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'];

  return Object.entries(journalData)
    .map(([journal, data], index) => ({
      journal,
      count: data.count,
      impactFactor: Math.round(data.avgImpactFactor * 10) / 10,
      quartile: data.quartiles.length > 0 ? data.quartiles[0] : 'Q2', // Use first quartile or default to Q2
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.count - a.count); // Sort by publication count
};

export const journalDistribution: JournalDistribution[] = generateJournalDistribution();

export const collaborationNetwork: CollaborationNode[] = [
  {
    id: 'ramon',
    name: 'Ramon Roca Pinilla',
    institution: 'CMRI',
    type: 'primary',
    weight: 1.0,
    publications: 16
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

// Enhanced metrics analytics and real-time calculations
export const metricsAnalytics = {
  // Get citation trend data
  getCitationTrends: () => {
    const timelineData = publicationAnalytics.getTimelineData();
    return timelineData.map(item => ({
      year: item.year,
      citations: item.citations,
      cumulativeCitations: timelineData
        .filter(d => parseInt(d.year) <= parseInt(item.year))
        .reduce((sum, d) => sum + d.citations, 0)
    }));
  },

  // Calculate productivity metrics
  getProductivityMetrics: () => {
    const timelineData = publicationAnalytics.getTimelineData();
    const totalYears = timelineData.length;
    const avgPubsPerYear = metrics.publications / totalYears;
    const avgCitationsPerYear = metrics.citations / totalYears;
    const peakYear = timelineData.reduce((max, current) =>
      current.count > max.count ? current : max
    );

    return {
      avgPubsPerYear: Math.round(avgPubsPerYear * 10) / 10,
      avgCitationsPerYear: Math.round(avgCitationsPerYear * 10) / 10,
      peakProductivityYear: peakYear.year,
      peakProductivityCount: peakYear.count,
      totalActiveYears: totalYears,
      productivityTrend: timelineData.slice(-3).reduce((sum, d) => sum + d.count, 0) / 3 // 3-year average
    };
  },

  // Get research impact evolution
  getImpactEvolution: () => {
    const timelineData = publicationAnalytics.getTimelineData();
    let cumulativeCitations = 0;
    let cumulativePublications = 0;

    return timelineData.map(item => {
      cumulativeCitations += item.citations;
      cumulativePublications += item.count;

      return {
        year: item.year,
        publications: item.count,
        citations: item.citations,
        cumulativePublications,
        cumulativeCitations,
        avgCitationsPerPub: cumulativePublications > 0 ? cumulativeCitations / cumulativePublications : 0,
        hIndexEstimate: Math.min(cumulativePublications, Math.sqrt(cumulativeCitations)) // Simplified h-index estimate
      };
    });
  },

  // Calculate collaboration strength
  getCollaborationStrength: () => {
    const collaborationData = publicationAnalytics.getCollaborationAnalysis();
    const total = collaborationData.national + collaborationData.international + (collaborationData.institutional || 0);

    return {
      collaborationRate: Math.round((total / metrics.publications) * 100),
      internationalRate: Math.round((collaborationData.international / total) * 100),
      nationalRate: Math.round((collaborationData.national / total) * 100),
      institutionalRate: Math.round(((collaborationData.institutional || 0) / total) * 100),
      diversity: Object.keys(publicationAnalytics.getJournalDistribution()).length,
      globalReach: collaborationData.international >= 5 ? 'High' : collaborationData.international >= 2 ? 'Medium' : 'Low'
    };
  },

  // Get journal quality analysis
  getJournalQualityAnalysis: () => {
    const journalData = publicationAnalytics.getJournalDistribution();
    const journals = Object.values(journalData);
    const totalPubs = journals.reduce((sum, j) => sum + j.count, 0);

    const q1Count = Object.values(journalData).filter(j => j.quartiles.includes('Q1')).reduce((sum, j) => sum + j.count, 0);
    const q2Count = Object.values(journalData).filter(j => j.quartiles.includes('Q2')).reduce((sum, j) => sum + j.count, 0);

    return {
      avgImpactFactor: publicationAnalytics.getAvgImpactFactor(),
      q1Percentage: Math.round((q1Count / totalPubs) * 100),
      q2Percentage: Math.round((q2Count / totalPubs) * 100),
      topTierJournals: Object.entries(journalData)
        .filter(([, data]) => data.avgImpactFactor > 10)
        .length,
      journalDiversity: Object.keys(journalData).length,
      openAccessRate: publicationAnalytics.getImpactMetrics().openAccessPercentage
    };
  }
};

// Real-time metric updates
export const updateMetrics = () => {
  return calculateRealTimeMetrics();
};

// Legacy exports for backward compatibility
export const legacyMetrics = {
  publications: metrics.publications,
  citations: metrics.citations,
  scholarUserId: 'jYIZGT0AAAAJ',
  scholarUrl: 'https://scholar.google.com/citations?user=jYIZGT0AAAAJ',
  orcidUrl: 'https://orcid.org/0000-0002-7393-6200',
};

