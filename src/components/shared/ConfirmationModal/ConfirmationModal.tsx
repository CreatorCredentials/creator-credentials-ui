import { Button } from 'flowbite-react';
import { ReactNode } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';

type ConfirmationModalTestIds = {
  modal?: string;
  confirm?: string;
  cancel?: string;
};

type ConfirmationModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isProcessing?: boolean;
  /** Whether the backdrop and the close button dismiss the dialog; defaults to the inverse of `isProcessing`. */
  dismissible?: boolean;
  children?: ReactNode;
  testIds?: ConfirmationModalTestIds;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  isProcessing = false,
  dismissible = !isProcessing,
  children,
  testIds,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  const { t } = useTranslation('common');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      data-testid={testIds?.modal}
      onClick={(e) => {
        if (dismissible && e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="Warning"
              className="shrink-0 fill-amber-500 text-amber-500"
            />
            <h2
              id="confirmation-modal-title"
              className="text-base font-semibold text-gray-900"
            >
              {title}
            </h2>
          </div>
          <IconButton
            icon="Close"
            className="shrink-0 fill-gray-400 p-1 text-gray-400 hover:fill-gray-600 hover:text-gray-600"
            aria-label={t('close')}
            disabled={!dismissible}
            onClick={onCancel}
          />
        </div>
        <p className="text-sm text-gray-600">{message}</p>
        {children}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            color="light"
            size="sm"
            disabled={isProcessing}
            data-testid={testIds?.cancel}
            onClick={onCancel}
          >
            {cancelLabel ?? t('cancel')}
          </Button>
          <Button
            color="failure"
            size="sm"
            disabled={isProcessing}
            isProcessing={isProcessing}
            data-testid={testIds?.confirm}
            onClick={onConfirm}
          >
            {confirmLabel ?? t('confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};
