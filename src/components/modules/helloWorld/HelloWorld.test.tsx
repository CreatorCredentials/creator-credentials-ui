import { act, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect } from 'vitest';
import { render } from '@/shared/utils/testUtils';
import { HelloWorld } from './HelloWorld';

describe('Hello World', () => {
  it('should correctly translate', async () => {
    render(<HelloWorld />);

    expect(await screen.findByText('hello-world')).toBeInTheDocument();
  });

  it('should fetch data on mount', async () => {
    render(<HelloWorld />);

    expect(await screen.findByText('GET MSW!')).toBeInTheDocument();
  });

  it('should call the API on button click', async () => {
    render(<HelloWorld />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    act(() => {
      userEvent.click(button);
    });

    expect(await screen.findByText('POST MSW!')).toBeInTheDocument();
  });
});
