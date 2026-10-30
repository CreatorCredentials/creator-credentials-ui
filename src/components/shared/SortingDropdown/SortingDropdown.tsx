import { Dropdown } from 'flowbite-react';
import React from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { Icon, IconName } from '../Icon';

export type SortingOption<T extends string> = {
  value: T;
  labelTkey: string;
  icon: IconName;
};

type SortingDropdownProps<T extends string> = {
  value: T;
  options: SortingOption<T>[];
  onChange: (value: T) => void;
  testId?: string;
};

export const SortingDropdown = <T extends string>({
  value,
  options,
  onChange,
  testId,
}: SortingDropdownProps<T>) => {
  const { t } = useTranslation('common');
  const selected = options.find((option) => option.value === value);

  return (
    <Dropdown
      label={`${t('sorting.label')}: ${selected ? t(selected.labelTkey) : ''}`}
      color="outline-black"
      data-testid={testId}
    >
      {options.map(({ value: optionValue, icon, labelTkey }) => (
        <Dropdown.Item
          key={optionValue}
          aria-current={optionValue === value}
          icon={() => (
            <Icon
              icon={icon}
              className="me-2"
            />
          )}
          onClick={() => onChange(optionValue)}
        >
          {t(labelTkey)}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
