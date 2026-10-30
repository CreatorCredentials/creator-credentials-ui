import { ReactNode, useId } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { IconButton } from '@/components/shared/IconButton';

type AdminDialogProps = {
  title: string;
  children: ReactNode;
  testId?: string;
  onClose: () => void;
};

/** Read-only modal dialog for the admin pages; the backdrop and the close button dismiss it. */
export const AdminDialog = ({
  title,
  children,
  testId,
  onClose,
}: AdminDialogProps) => {
  const { t } = useTranslation('common');
  const titleId = useId();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-testid={testId}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="scrollbar flex max-h-full w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="text-xl text-black"
          >
            {title}
          </h2>
          <IconButton
            icon="Close"
            className="shrink-0 fill-gray-400 p-1 text-gray-400 hover:fill-gray-600 hover:text-gray-600"
            aria-label={t('close')}
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
};
