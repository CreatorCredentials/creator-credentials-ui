import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelloWorld } from './HelloWorld';

test('Hello World: Renders correctly', () => {
  render(<HelloWorld />);
  expect(screen.getByText('hello-world')).toBeInTheDocument();
});
