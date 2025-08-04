import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../stories/design-system/Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant class by default', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('btn-primary');
  });

  it('applies secondary variant class when specified', () => {
    render(<Button variant="secondary">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('btn-secondary');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button.className).toContain('opacity-50');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('text-sm');

    rerender(<Button size="large">Large</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('text-lg');
  });

  it('supports aria-label for accessibility', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    const button = screen.getByRole('button', { name: 'Submit form' });
    expect(button).toBeInTheDocument();
  });
});