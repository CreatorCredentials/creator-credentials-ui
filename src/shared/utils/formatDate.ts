import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/** Formats an ISO timestamp as a short date, e.g. "20 Oct 2026"; a placeholder for missing or invalid input. */
export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) {
    return EMPTY_VALUE_PLACEHOLDER;
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? EMPTY_VALUE_PLACEHOLDER
    : DATE_FORMAT.format(date);
};
