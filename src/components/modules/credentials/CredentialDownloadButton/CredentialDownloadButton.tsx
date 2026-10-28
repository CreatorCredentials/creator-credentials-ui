import { Button } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { credentialFileName } from '@/shared/utils/credentialFileName';
import { downloadJson } from '@/shared/utils/downloadJson';
import { Icon } from '@/components/shared/Icon';

type CredentialDownloadButtonProps = {
  credential: VerifiedCredentialsUnion;
};

export const CredentialDownloadButton = ({
  credential,
}: CredentialDownloadButtonProps) => {
  const { t } = useTranslation('common');

  return (
    <Button
      color="outline"
      className="self-stretch"
      data-testid="credential-download"
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
