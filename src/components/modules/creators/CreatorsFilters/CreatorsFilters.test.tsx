import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { render } from '@/shared/utils/testUtils';
import { CreatorsFilters } from './CreatorsFilters';

const renderFilters = (overrides = {}) => {
  const props = {
    query: 'ali',
    onQueryChange: vi.fn(),
    sort: 'newest' as const,
    onSortChange: vi.fn(),
    view: 'cards' as const,
    onViewChange: vi.fn(),
    ...overrides,
  };
  render(<CreatorsFilters {...props} />);
  return props;
};

describe('CreatorsFilters', () => {
  it('shows the controlled query and emits every change', async () => {
    const { onQueryChange } = renderFilters();
    const search = screen.getByTestId('issued-search');

    expect(search).toHaveValue('ali');

    await userEvent.type(search, 'c');

    expect(onQueryChange).toHaveBeenCalledWith('alic');
  });

  it('emits the chosen sort option', async () => {
    const { onSortChange } = renderFilters();

    await userEvent.click(screen.getByTestId('issued-sort'));
    await userEvent.click(screen.getByText('sorting.items.name-desc'));

    expect(onSortChange).toHaveBeenCalledWith('name-desc');
  });

  it('marks the active view and emits a view change', async () => {
    const { onViewChange } = renderFilters();

    expect(screen.getByTestId('issued-view-cards')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByTestId('issued-view-table')).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await userEvent.click(screen.getByTestId('issued-view-table'));

    expect(onViewChange).toHaveBeenCalledWith('table');
  });
});
