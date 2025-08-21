export interface MetricItem {
  value: number | string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
}

export interface PublicationData {
  id: string;
  title: string;
  year: string;
  journal: string;
  url: string;
  featured?: boolean;
  citations?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  impactFactor?: number;
  collaborators?: string[];
  keywords?: string[];
}

export interface CollaborationNode {
  id: string;
  name: string;
  institution: string;
  type: 'primary' | 'collaborator' | 'institution';
  weight: number;
  publications: number;
  x?: number;
  y?: number;
}

export interface CollaborationEdge {
  source: string;
  target: string;
  weight: number;
  publications: string[];
}

export interface ResearchMilestone {
  year: string;
  title: string;
  description: string;
  type: 'publication' | 'award' | 'position' | 'project';
  impact?: string;
  institution?: string;
  url?: string;
  color?: string;
}

export interface JournalDistribution {
  journal: string;
  count: number;
  impactFactor?: number;
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  color?: string;
}

export interface VisualizationConfig {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: string[];
  animations?: {
    duration: number;
    easing: string;
  };
  responsive?: boolean;
}

export interface MetricsData {
  publications: number;
  citations: number;
  hIndex: number;
  collaborations: number;
  journals: number;
  years: number;
  impactScore?: number;
  internationalCollaborations?: number;
}

export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ProgressBarData {
  label: string;
  value: number;
  max: number;
  color?: string;
  description?: string;
}