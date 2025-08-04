import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Typography component implementing the portfolio design system type scale with display, heading, and body variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'display-xl', 'display-lg', 'display-md', 'display-sm',
        'heading-xl', 'heading-lg', 'heading-md', 'heading-sm',
        'body-xl', 'body-lg', 'body-md', 'body-sm'
      ],
    },
    as: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'muted', 'accent', 'on-accent'],
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DisplayXL: Story = {
  args: {
    variant: 'display-xl',
    as: 'h1',
    children: 'Display XL Text',
  },
};

export const HeadingLG: Story = {
  args: {
    variant: 'heading-lg',
    as: 'h2',
    children: 'Heading Large Text',
  },
};

export const BodyText: Story = {
  args: {
    variant: 'body-md',
    as: 'p',
    children: 'This is body text using the body-md variant. It demonstrates the default typography for regular content.',
  },
};

export const AccentText: Story = {
  args: {
    variant: 'heading-md',
    as: 'h3',
    color: 'accent',
    children: 'Accent Color Text',
  },
};

export const MutedText: Story = {
  args: {
    variant: 'body-lg',
    as: 'p',
    color: 'muted',
    children: 'This is muted text, typically used for secondary information.',
  },
};

export const CenteredText: Story = {
  args: {
    variant: 'heading-lg',
    as: 'h2',
    align: 'center',
    children: 'Centered Heading Text',
  },
};

export const TypeScale: Story = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Typography variant="body-sm" color="muted">Display Variants</Typography>
        <div className="space-y-2 mt-2">
          <Typography variant="display-xl" as="h1">Display XL</Typography>
          <Typography variant="display-lg" as="h1">Display Large</Typography>
          <Typography variant="display-md" as="h1">Display Medium</Typography>
          <Typography variant="display-sm" as="h1">Display Small</Typography>
        </div>
      </div>
      
      <div>
        <Typography variant="body-sm" color="muted">Heading Variants</Typography>
        <div className="space-y-2 mt-2">
          <Typography variant="heading-xl" as="h2">Heading XL</Typography>
          <Typography variant="heading-lg" as="h2">Heading Large</Typography>
          <Typography variant="heading-md" as="h3">Heading Medium</Typography>
          <Typography variant="heading-sm" as="h4">Heading Small</Typography>
        </div>
      </div>
      
      <div>
        <Typography variant="body-sm" color="muted">Body Variants</Typography>
        <div className="space-y-2 mt-2">
          <Typography variant="body-xl">Body XL - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
          <Typography variant="body-lg">Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
          <Typography variant="body-md">Body Medium - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
          <Typography variant="body-sm">Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
        </div>
      </div>
      
      <div>
        <Typography variant="body-sm" color="muted">Color Variants</Typography>
        <div className="space-y-2 mt-2">
          <Typography variant="body-lg" color="primary">Primary text color</Typography>
          <Typography variant="body-lg" color="muted">Muted text color</Typography>
          <Typography variant="body-lg" color="accent">Accent text color</Typography>
        </div>
      </div>
    </div>
  ),
};