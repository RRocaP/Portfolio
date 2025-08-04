import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card component for grouping related content. Supports different variants and interactive states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'academic-profile', 'contact'],
    },
    clickable: {
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h3 className="text-heading-sm text-body-text mb-2">Card Title</h3>
        <p className="text-body-md text-text-muted">
          This is a default card with some content. It provides a clean container for grouping related information.
        </p>
      </>
    ),
  },
};

export const AcademicProfile: Story = {
  args: {
    variant: 'academic-profile',
    clickable: true,
    children: (
      <div className="academic-profile-card">
        <div className="profile-icon orcid-icon">
          <span>📊</span>
        </div>
        <div className="profile-info">
          <div className="profile-title">ORCID Profile</div>
          <div className="profile-description">0000-0002-7393-6200</div>
          <div className="profile-stats">16+ publications • 250+ citations</div>
        </div>
        <div className="profile-arrow">→</div>
      </div>
    ),
  },
};

export const Contact: Story = {
  args: {
    variant: 'contact',
    clickable: true,
    children: (
      <>
        <div className="text-3xl mb-4">📧</div>
        <h3 className="font-sans text-heading-sm text-accent-yellow mb-2">
          Email
        </h3>
        <p className="text-sm text-text-muted group-hover:text-body-text transition-colors">
          ramon.roca@example.com
        </p>
      </>
    ),
  },
};

export const InteractiveCard: Story = {
  args: {
    clickable: true,
    children: (
      <>
        <h3 className="text-heading-sm text-body-text mb-2">Interactive Card</h3>
        <p className="text-body-md text-text-muted mb-4">
          This card responds to hover and click events.
        </p>
        <div className="text-accent-yellow text-sm">Click me!</div>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-6 max-w-2xl">
      <Card variant="default">
        <h3 className="text-heading-sm text-body-text mb-2">Default Card</h3>
        <p className="text-body-md text-text-muted">Basic card styling with surface background.</p>
      </Card>
      
      <Card variant="contact" clickable>
        <div className="text-3xl mb-4">💼</div>
        <h3 className="font-sans text-heading-sm text-accent-yellow mb-2">LinkedIn</h3>
        <p className="text-sm text-text-muted">Professional network</p>
      </Card>
      
      <Card variant="academic-profile" clickable>
        <div className="academic-profile-card">
          <div className="profile-icon scholar-icon">
            <span>🎓</span>
          </div>
          <div className="profile-info">
            <div className="profile-title">Google Scholar</div>
            <div className="profile-description">Academic publications</div>
            <div className="profile-stats">H-index: 12 • i10-index: 15</div>
          </div>
          <div className="profile-arrow">→</div>
        </div>
      </Card>
    </div>
  ),
};