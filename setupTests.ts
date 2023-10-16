import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('next-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));
