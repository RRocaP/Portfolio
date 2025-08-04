import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Portfolio Design System - A comprehensive style guide for Ramon Roca Pinilla\'s academic portfolio, featuring accessible components, design tokens, and usage guidelines.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduction: Story = {
  render: () => (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-display-lg text-body-text mb-6 font-sans">Portfolio Design System</h1>
      
      <p className="text-body-lg text-text-muted mb-8 max-w-prose">
        Welcome to the design system documentation for Ramon Roca Pinilla's portfolio. 
        This living style guide showcases the components, patterns, and design tokens 
        used throughout the portfolio website.
      </p>
      
      <div className="grid gap-8">
        <div className="bg-surface-1 border border-border rounded-lg p-6">
          <h2 className="text-heading-lg text-body-text mb-4">Design Philosophy</h2>
          <ul className="space-y-2 text-body-md text-text-muted">
            <li>• <strong className="text-body-text">Academic Professionalism</strong>: Clean, minimal design that emphasizes content and research</li>
            <li>• <strong className="text-body-text">Accessibility First</strong>: WCAG 2.1 AA compliant with comprehensive keyboard and screen reader support</li>
            <li>• <strong className="text-body-text">Dark Theme</strong>: Optimized for academic reading with high contrast and comfortable viewing</li>
            <li>• <strong className="text-body-text">Performance</strong>: Lightweight components with optimized loading and rendering</li>
            <li>• <strong className="text-body-text">Responsive</strong>: Mobile-first approach with thoughtful breakpoints</li>
          </ul>
        </div>
        
        <div className="bg-surface-1 border border-border rounded-lg p-6">
          <h2 className="text-heading-lg text-body-text mb-4">Architecture</h2>
          <p className="text-body-md text-text-muted mb-4">The design system is built using:</p>
          <ul className="space-y-2 text-body-md text-text-muted">
            <li>• <strong className="text-body-text">Astro</strong> - Static site generator with component islands</li>
            <li>• <strong className="text-body-text">React</strong> - Interactive components and visualizations</li>
            <li>• <strong className="text-body-text">Tailwind CSS</strong> - Utility-first CSS framework with custom design tokens</li>
            <li>• <strong className="text-body-text">TypeScript</strong> - Type safety and better developer experience</li>
          </ul>
        </div>
        
        <div className="bg-surface-1 border border-border rounded-lg p-6">
          <h2 className="text-heading-lg text-body-text mb-4">Component Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-heading-sm text-accent-yellow mb-2">Core Components</h3>
              <ul className="space-y-1 text-body-sm text-text-muted">
                <li>• Button</li>
                <li>• Card</li>
                <li>• Typography</li>
                <li>• Layout</li>
              </ul>
            </div>
            <div>
              <h3 className="text-heading-sm text-accent-yellow mb-2">Specialized Components</h3>
              <ul className="space-y-1 text-body-sm text-text-muted">
                <li>• Academic Profile Cards</li>
                <li>• Contact Cards</li>
                <li>• Navigation</li>
                <li>• Interactive Visualizations</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-1 border border-border rounded-lg p-6">
          <h2 className="text-heading-lg text-body-text mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-heading-sm text-body-text mb-2">Do's ✅</h3>
              <ul className="space-y-1 text-body-sm text-text-muted">
                <li>• Use the provided color tokens and typography scale</li>
                <li>• Maintain consistent spacing using the defined scale</li>
                <li>• Ensure all interactive elements are keyboard accessible</li>
                <li>• Test components with screen readers</li>
                <li>• Use semantic HTML elements</li>
              </ul>
            </div>
            <div>
              <h3 className="text-heading-sm text-body-text mb-2">Don'ts ❌</h3>
              <ul className="space-y-1 text-body-sm text-text-muted">
                <li>• Override design tokens without good reason</li>
                <li>• Use custom colors outside the defined palette</li>
                <li>• Ignore responsive behavior in component design</li>
                <li>• Skip accessibility testing</li>
                <li>• Use decorative elements as functional components</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};