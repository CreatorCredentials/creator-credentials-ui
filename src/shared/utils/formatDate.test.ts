import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO timestamp as a short date', () => {
    expect(formatDate('2026-10-20T10:00:00.000Z')).toBe('20 Oct 2026');
  });

  it('returns a placeholder for missing input', () => {
    expect(formatDate(undefined)).toBe(EMPTY_VALUE_PLACEHOLDER);
    expect(formatDate(null)).toBe(EMPTY_VALUE_PLACEHOLDER);
    expect(formatDate('')).toBe(EMPTY_VALUE_PLACEHOLDER);
  });

  it('returns a placeholder for an unparsable value', () => {
    expect(formatDate('not-a-date')).toBe(EMPTY_VALUE_PLACEHOLDER);
  });
});
