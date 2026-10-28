import { useTranslation } from '@/shared/utils/useTranslation';
import { IssuedCredential } from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';

type IssuedCredentialStatusProps = {
  credential: IssuedCredential;
  className?: ClassValue;
};

export const IssuedCredentialStatus = ({
  credential,
  className,
}: IssuedCredentialStatusProps) => {
  const { t } = useTranslation('issuer-credentials');

  if (credential.status !== CredentialVerificationStatus.Revoked) {
    return (
      <ColoredBadge
        badgeType="accepted"
        className={className}
      />
    );
  }

  return (
    <div className={clsxm('flex flex-col gap-1', className)}>
      <ColoredBadge
        badgeType="revoked"
        className="self-center"
      />
      {credential.revokedReason && (
        <p className="text-sm text-grey-4">
          {t('issued.revoked-reason')}: {credential.revokedReason}
        </p>
      )}
    </div>
  );
};
