import { screen } from '@testing-library/react';
import { render } from '@/shared/utils/testUtils';
import { NoLogoBlankLayout } from './NoLogoBlankLayout';

describe('BlankLayout', () => {
  it('should render children', () => {
    render(<NoLogoBlankLayout>TEST</NoLogoBlankLayout>);

    expect(screen.getByText('TEST')).toBeInTheDocument();
  });
});
