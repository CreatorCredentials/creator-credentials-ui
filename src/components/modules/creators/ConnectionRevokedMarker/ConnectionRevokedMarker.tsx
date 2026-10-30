import { ClassValue, clsxm } from '@/shared/utils/clsxm';
import { useTranslation } from '@/shared/utils/useTranslation';
import { Icon } from '@/components/shared/Icon';

type ConnectionRevokedMarkerProps = {
  className?: ClassValue;
};

export const ConnectionRevokedMarker = ({
  className,
}: ConnectionRevokedMarkerProps) => {
  const { t } = useTranslation('issuer-credentials');

  return (
    <span
      className={clsxm(
        'inline-flex items-center gap-1 rounded-md bg-alert/10 fill-alert px-2 py-0.5 text-sm text-alert',
        className,
      )}
      data-testid="connection-revoked-marker"
    >
      <Icon
        icon="Warning"
        className="h-4 w-4"
      />
      {t('issued.connection-revoked')}
    </span>
  );
};
