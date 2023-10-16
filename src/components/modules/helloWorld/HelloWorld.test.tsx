import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect } from 'vitest';
import { HelloWorld } from './HelloWorld';

describe('Hello World', () => {
  it('should correctly translate', () => {
    render(<HelloWorld />);
    expect(screen.getByText('hello-world')).toBeInTheDocument();
  });

  it('should fetch data on mount', () => {
    render(<HelloWorld />);

    waitFor(() => expect(screen.getByText('GET MSW!')).toBeInTheDocument());
  });

  it('should call the API on button click', () => {
    render(<HelloWorld />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    act(() => {
      userEvent.click(button);
    });

    waitFor(() => expect(screen.getByText('POST MSW!')).toBeInTheDocument());
  });
});
