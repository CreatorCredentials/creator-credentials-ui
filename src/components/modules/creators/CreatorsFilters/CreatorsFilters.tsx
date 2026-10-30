import { Button, TextInput } from 'flowbite-react';
import React from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { Icon } from '@/components/shared/Icon';
import {
  SortingDropdown,
  SortingOption,
} from '@/components/shared/SortingDropdown';
import { CredentialsSort } from '@/shared/utils/credentialsList';

export type CredentialsView = 'cards' | 'table';

const SORT_OPTIONS: SortingOption<CredentialsSort>[] = [
  {
    value: 'name-asc',
    labelTkey: 'sorting.items.name-asc',
    icon: 'ArchiveFilled',
  },
  {
    value: 'name-desc',
    labelTkey: 'sorting.items.name-desc',
    icon: 'UnarchiveFilled',
  },
  {
    value: 'newest',
    labelTkey: 'sorting.items.newest',
    icon: 'EventTodayFilled',
  },
  { value: 'oldest', labelTkey: 'sorting.items.oldest', icon: 'EventFilled' },
];

const VIEWS: CredentialsView[] = ['cards', 'table'];

type CreatorsFiltersProps = {
  query: string;
  onQueryChange: (query: string) => void;
  sort: CredentialsSort;
  onSortChange: (sort: CredentialsSort) => void;
  view: CredentialsView;
  onViewChange: (view: CredentialsView) => void;
};

export const CreatorsFilters = ({
  query,
  onQueryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: CreatorsFiltersProps) => {
  const { t } = useTranslation('issuer-credentials');

  return (
    <div className="mb-8 flex justify-between gap-4">
      <TextInput
        sizing="lg"
        color="primary"
        icon={() => <Icon icon="Search" />}
        placeholder={t('issued.filters.search.placeholder')}
        className="min-w-[25rem]"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        data-testid="issued-search"
      />
      <div className="flex items-center gap-4">
        <Button.Group>
          {VIEWS.map((option) => (
            <Button
              key={option}
              color={option === view ? 'primary' : 'outline'}
              aria-pressed={option === view}
              data-testid={`issued-view-${option}`}
              onClick={() => onViewChange(option)}
            >
              {t(`issued.view.${option}`)}
            </Button>
          ))}
        </Button.Group>
        <SortingDropdown
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          testId="issued-sort"
        />
      </div>
    </div>
  );
};
