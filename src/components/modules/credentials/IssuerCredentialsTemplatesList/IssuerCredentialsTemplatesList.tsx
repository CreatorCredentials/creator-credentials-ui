import React, { ElementType } from 'react';
import Link from 'next/link';
import { Button } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { useIssuersTemplates } from '@/api/queries/useIssuersTemplates';
import { CredentialTemplateDetailsCard } from '@/components/shared/CredentialTemplateDetailsCard';
import { CredentialTemplateType } from '@/shared/typings/CredentialTemplateType';
import { useGetUser } from '@/api/queries/useGetUser';

const CERT_SIGNED_TEMPLATE = {
  templateType: CredentialTemplateType.CertSigned,
  name: 'X.509 Cert-Signed Credential',
};

export const IssuerCredentialsTemplatesList = () => {
  const { t } = useTranslation('issuer-credentials');

  const { data, status, isLoading } = useIssuersTemplates();
  const { data: user } = useGetUser();
  const hasExternalCert = Boolean(user?.externalCertPem);

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-credentials')} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.templates.map((template) => (
        <CredentialTemplateDetailsCard
          key={template.id}
          template={template}
          dropdownItems={[]}
          renderFooter={() => (
            <ColoredBadge
              badgeType="active"
              className="self-center"
            />
          )}
        />
      ))}
      <CredentialTemplateDetailsCard
        template={CERT_SIGNED_TEMPLATE}
        dropdownItems={[]}
        renderFooter={() =>
          hasExternalCert ? (
            <ColoredBadge
              badgeType="active"
              className="self-center"
            />
          ) : (
            <Button
              color="light"
              fullSized
              href="/issuer/verification/cert"
              as={Link as ElementType}
            >
              Import Certificate to Unlock
            </Button>
          )
        }
      />
    </div>
  );
};
