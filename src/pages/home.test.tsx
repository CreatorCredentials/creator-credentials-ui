import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './index';

test('App: Renders correctly', () => {
  render(<Home />);
  expect(screen.getByText('Hello world!')).toBeInTheDocument();
});
