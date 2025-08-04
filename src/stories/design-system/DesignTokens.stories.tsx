import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Design Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Design tokens including colors, typography scale, and spacing used throughout the portfolio.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-display-md text-body-text mb-8 font-sans">Color Palette</h1>
      
      <div className="grid gap-8">
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Primary Colors</h2>
          <div className="auto-grid">
            <div className="bg-primary-bg border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-primary-bg rounded mb-4 border border-border"></div>
              <h3 className="text-heading-sm text-body-text">Primary Background</h3>
              <p className="text-body-sm text-text-muted">#000000</p>
              <p className="text-body-sm text-text-muted">primary-bg</p>
            </div>
            
            <div className="bg-surface-1 border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-surface-1 rounded mb-4 border border-border"></div>
              <h3 className="text-heading-sm text-body-text">Surface 1</h3>
              <p className="text-body-sm text-text-muted">#111111</p>
              <p className="text-body-sm text-text-muted">surface-1</p>
            </div>
            
            <div className="bg-surface-2 border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-surface-2 rounded mb-4 border border-border"></div>
              <h3 className="text-heading-sm text-body-text">Surface 2</h3>
              <p className="text-body-sm text-text-muted">#181818</p>
              <p className="text-body-sm text-text-muted">surface-2</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Accent Colors</h2>
          <div className="auto-grid">
            <div className="bg-surface-1 border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-accent-yellow rounded mb-4"></div>
              <h3 className="text-heading-sm text-body-text">Accent Yellow</h3>
              <p className="text-body-sm text-text-muted">#FFD300</p>
              <p className="text-body-sm text-text-muted">accent-yellow</p>
            </div>
            
            <div className="bg-surface-1 border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-accent-red rounded mb-4"></div>
              <h3 className="text-heading-sm text-body-text">Accent Red</h3>
              <p className="text-body-sm text-text-muted">#D72638</p>
              <p className="text-body-sm text-text-muted">accent-red</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Text Colors</h2>
          <div className="auto-grid">
            <div className="bg-surface-1 border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-surface-1 rounded mb-4 border border-border flex items-center justify-center">
                <span className="text-body-text text-heading-sm">Aa</span>
              </div>
              <h3 className="text-heading-sm text-body-text">Body Text</h3>
              <p className="text-body-sm text-text-muted">#F3F3F3</p>
              <p className="text-body-sm text-text-muted">body-text</p>
            </div>
            
            <div className="bg-surface-1 border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-surface-1 rounded mb-4 border border-border flex items-center justify-center">
                <span className="text-text-muted text-heading-sm">Aa</span>
              </div>
              <h3 className="text-heading-sm text-body-text">Text Muted</h3>
              <p className="text-body-sm text-text-muted">#B8B8B8</p>
              <p className="text-body-sm text-text-muted">text-muted</p>
            </div>
            
            <div className="bg-accent-yellow border border-border rounded-lg p-6">
              <div className="w-full h-20 bg-accent-yellow rounded mb-4 border border-border flex items-center justify-center">
                <span className="text-on-accent-text text-heading-sm">Aa</span>
              </div>
              <h3 className="text-heading-sm text-on-accent-text">On Accent Text</h3>
              <p className="text-body-sm text-on-accent-text/80">#000000</p>
              <p className="text-body-sm text-on-accent-text/80">on-accent-text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-display-md text-body-text mb-8 font-sans">Typography Scale</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Display Sizes</h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <div className="text-display-xl text-body-text">Display XL</div>
              <p className="text-body-sm text-text-muted mt-1">4.5rem • Line height: 1.1 • Letter spacing: -0.02em</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-display-lg text-body-text">Display Large</div>
              <p className="text-body-sm text-text-muted mt-1">3.75rem • Line height: 1.1 • Letter spacing: -0.02em</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-display-md text-body-text">Display Medium</div>
              <p className="text-body-sm text-text-muted mt-1">3rem • Line height: 1.2 • Letter spacing: -0.01em</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-display-sm text-body-text">Display Small</div>
              <p className="text-body-sm text-text-muted mt-1">2.25rem • Line height: 1.2 • Letter spacing: -0.01em</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Heading Sizes</h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <div className="text-heading-xl text-body-text">Heading XL</div>
              <p className="text-body-sm text-text-muted mt-1">2rem • Line height: 1.3</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-heading-lg text-body-text">Heading Large</div>
              <p className="text-body-sm text-text-muted mt-1">1.75rem • Line height: 1.3</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-heading-md text-body-text">Heading Medium</div>
              <p className="text-body-sm text-text-muted mt-1">1.5rem • Line height: 1.4</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-heading-sm text-body-text">Heading Small</div>
              <p className="text-body-sm text-text-muted mt-1">1.25rem • Line height: 1.4</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Body Sizes</h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <div className="text-body-xl text-body-text">Body XL - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              <p className="text-body-sm text-text-muted mt-1">1.25rem • Line height: 1.6</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-body-lg text-body-text">Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              <p className="text-body-sm text-text-muted mt-1">1.125rem • Line height: 1.6</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-body-md text-body-text">Body Medium - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              <p className="text-body-sm text-text-muted mt-1">1rem • Line height: 1.6</p>
            </div>
            <div className="border-b border-border pb-4">
              <div className="text-body-sm text-body-text">Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              <p className="text-body-sm text-text-muted mt-1">0.875rem • Line height: 1.5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-display-md text-body-text mb-8 font-sans">Spacing Scale</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Tailwind Spacing</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 6, 8, 12, 16, 20, 24].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <div className="w-16 text-body-sm text-text-muted text-right">{size}</div>
                <div className={`bg-accent-yellow h-6 rounded`} style={{width: `${size * 0.25}rem`}}></div>
                <div className="text-body-sm text-text-muted">{size * 0.25}rem ({size * 4}px)</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Container Spacing</h2>
          <div className="bg-surface-1 border border-border rounded-lg p-4">
            <div className="text-body-md text-body-text mb-2">Container Padding</div>
            <div className="text-body-sm text-text-muted">Mobile: 1rem (16px) • Tablet: 1.5rem (24px) • Desktop: 2rem (32px)</div>
          </div>
        </div>
        
        <div>
          <h2 className="text-heading-lg text-body-text mb-4">Grid Gaps</h2>
          <div className="space-y-3">
            <div className="bg-surface-1 border border-border rounded-lg p-4">
              <div className="text-body-md text-body-text mb-2">Auto Grid</div>
              <div className="text-body-sm text-text-muted">Gap: 1.5rem (24px)</div>
            </div>
            <div className="bg-surface-1 border border-border rounded-lg p-4">
              <div className="text-body-md text-body-text mb-2">12-Column Grid</div>
              <div className="text-body-sm text-text-muted">Mobile: 1rem (16px) • Desktop: 1.5rem (24px)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};