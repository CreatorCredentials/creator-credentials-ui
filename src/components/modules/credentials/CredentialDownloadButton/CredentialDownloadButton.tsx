import { Button, ButtonProps } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { credentialFileName } from '@/shared/utils/credentialFileName';
import { downloadJson } from '@/shared/utils/downloadJson';
import { Icon } from '@/components/shared/Icon';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';

type CredentialDownloadButtonProps = {
  credential: VerifiedCredentialsUnion;
  size?: ButtonProps['size'];
  className?: ClassValue;
  testId?: string;
};

export const CredentialDownloadButton = ({
  credential,
  size,
  className,
  testId = 'credential-download',
}: CredentialDownloadButtonProps) => {
  const { t } = useTranslation('common');

  return (
    <Button
      color="outline"
      size={size}
      className={clsxm('self-stretch', className)}
      data-testid={testId}
      onClick={() =>
        downloadJson(
          credentialFileName(credential),
          credential.data.credentialObject,
        )
      }
    >
      {t('download')}
      <Icon
        icon="Download"
        className="ms-2"
      />
    </Button>
  );
};
