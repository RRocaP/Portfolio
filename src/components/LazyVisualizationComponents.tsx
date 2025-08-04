import React, { lazy, Suspense } from 'react';

// Lazy load the heavy D3 visualization components
const ProteinEngineeringInteractive = lazy(() => import('./ProteinEngineeringInteractive.tsx'));
const GeneTherapyVisualization = lazy(() => import('./GeneTherapyVisualization.tsx'));
const ResearchImpactDashboard = lazy(() => import('./ResearchImpactDashboard.tsx'));
const AntimicrobialResistanceTimeline = lazy(() => import('./AntimicrobialResistanceTimeline.tsx'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-red"></div>
    <span className="ml-3 text-surface-400">Loading visualization...</span>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <p className="text-surface-400">Unable to load visualization</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper components with lazy loading and error boundaries
export const LazyProteinEngineering = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <ProteinEngineeringInteractive />
    </Suspense>
  </ErrorBoundary>
);

export const LazyGeneTherapy = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <GeneTherapyVisualization />
    </Suspense>
  </ErrorBoundary>
);

export const LazyResearchImpact = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <ResearchImpactDashboard />
    </Suspense>
  </ErrorBoundary>
);

export const LazyAntimicrobialTimeline = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <AntimicrobialResistanceTimeline />
    </Suspense>
  </ErrorBoundary>
);