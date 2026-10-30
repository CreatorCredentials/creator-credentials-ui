import { Dropdown } from 'flowbite-react';
import { CredentialAction } from '@/shared/typings/CredentialAction';
import { clsxm } from '@/shared/utils/clsxm';
import { useTranslation } from '@/shared/utils/useTranslation';
import { IconButton } from '../IconButton';

type ActionsMenuProps = {
  items: CredentialAction[];
  testId?: string;
};

export const ActionsMenu = ({ items, testId }: ActionsMenuProps) => {
  const { t } = useTranslation('common');

  if (items.length === 0) {
    return null;
  }

  return (
    <Dropdown
      label=""
      dismissOnClick={true}
      color="outline-black"
      renderTrigger={() => (
        <IconButton
          icon="MoreHoriz"
          className="relative p-0"
          aria-label={t('actions')}
          data-testid={testId}
        />
      )}
    >
      {items.map((item, index) => (
        <Dropdown.Item
          {...item}
          className={clsxm('min-w-[300px]', item.className)}
          key={item.key || index}
        />
      ))}
    </Dropdown>
  );
};
