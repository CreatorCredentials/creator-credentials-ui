import { Button } from 'flowbite-react';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';

type ConfirmationModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirmation-modal-title"
    onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
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
          aria-label="Close"
          onClick={onCancel}
        />
      </div>
      <p className="text-sm text-gray-600">{message}</p>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          color="light"
          size="sm"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          color="failure"
          size="sm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </div>
);
