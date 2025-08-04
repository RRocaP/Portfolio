import type { Meta, StoryObj } from '@storybook/react';
import { Container, Grid } from './Layout';
import { Card } from './Card';

const meta: Meta<typeof Container> = {
  title: 'Design System/Layout',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Layout components for managing content width and grid structures based on the portfolio design system.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainerExample: Story = {
  args: {
    maxWidth: 'container',
    children: (
      <div className="bg-surface-1 border border-border rounded-lg p-8">
        <h2 className="text-heading-lg text-body-text mb-4">Container Content</h2>
        <p className="text-body-md text-text-muted">
          This content is contained within the design system's container component with max-width constraints.
        </p>
      </div>
    ),
  },
};

export const ProseContainer: Story = {
  args: {
    maxWidth: 'prose',
    children: (
      <div>
        <h2 className="text-heading-lg text-body-text mb-4">Prose Container</h2>
        <p className="text-body-md text-text-muted mb-4">
          This container is optimized for reading content with approximately 65 characters per line for optimal readability.
        </p>
        <p className="text-body-md text-text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      </div>
    ),
  },
};

export const AutoGrid: Story = {
  render: () => (
    <Container>
      <h2 className="text-heading-lg text-body-text mb-6">Auto Grid</h2>
      <Grid cols="auto" gap="lg">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i}>
            <h3 className="text-heading-sm text-body-text mb-2">Item {i + 1}</h3>
            <p className="text-body-md text-text-muted">Auto-fitting grid item with minimum width of 320px.</p>
          </Card>
        ))}
      </Grid>
    </Container>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <Container>
      <h2 className="text-heading-lg text-body-text mb-6">Responsive Grid (3 columns)</h2>
      <Grid cols="3" gap="md">
        {Array.from({ length: 9 }, (_, i) => (
          <Card key={i}>
            <h3 className="text-heading-sm text-body-text mb-2">Item {i + 1}</h3>
            <p className="text-body-md text-text-muted">Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop.</p>
          </Card>
        ))}
      </Grid>
    </Container>
  ),
};

export const TwelveColumnGrid: Story = {
  render: () => (
    <Container>
      <h2 className="text-heading-lg text-body-text mb-6">12-Column Grid System</h2>
      <Grid cols="12" gap="md">
        <div className="col-span-12 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-12 (Full width)</span>
        </div>
        <div className="col-span-6 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-6</span>
        </div>
        <div className="col-span-6 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-6</span>
        </div>
        <div className="col-span-4 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-4</span>
        </div>
        <div className="col-span-4 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-4</span>
        </div>
        <div className="col-span-4 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-4</span>
        </div>
        <div className="col-span-3 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-3</span>
        </div>
        <div className="col-span-3 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-3</span>
        </div>
        <div className="col-span-3 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-3</span>
        </div>
        <div className="col-span-3 bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">col-span-3</span>
        </div>
      </Grid>
    </Container>
  ),
};

export const AllContainerSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <Container maxWidth="full">
        <div className="bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">Full Width Container</span>
        </div>
      </Container>
      
      <Container maxWidth="container">
        <div className="bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">Standard Container (max-width: 1280px)</span>
        </div>
      </Container>
      
      <Container maxWidth="prose">
        <div className="bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">Prose Container (max-width: 65ch)</span>
        </div>
      </Container>
      
      <Container maxWidth="prose-narrow">
        <div className="bg-surface-1 border border-border rounded p-4">
          <span className="text-body-sm text-text-muted">Narrow Prose Container (max-width: 45ch)</span>
        </div>
      </Container>
    </div>
  ),
};