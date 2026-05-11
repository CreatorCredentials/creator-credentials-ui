import React, { ElementType, useMemo } from 'react';
import Link from 'next/link';
import { Button } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { Loader } from '@/components/shared/Loader';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { CredentialTemplateDetailsCard } from '@/components/shared/CredentialTemplateDetailsCard';
import { CredentialTemplateType } from '@/shared/typings/CredentialTemplateType';
import { CredentialType } from '@/shared/typings/CredentialType';
import { useGetUser } from '@/api/queries/useGetUser';

/** Maps a CredentialType value to the template card to display for it. */
const CREDENTIAL_TYPE_TO_TEMPLATE: Partial<
  Record<string, { templateType: CredentialTemplateType; name: string }>
> = {
  [CredentialType.Member]: {
    templateType: CredentialTemplateType.Member,
    name: 'Member Credential',
  },
  [CredentialType.DataSupplier]: {
    templateType: CredentialTemplateType.ExternalKeypair,
    name: 'Data Supplier',
  },
};

export const IssuerCredentialsTemplatesList = () => {
  const { t } = useTranslation('issuer-credentials');

  const { data: user, isLoading } = useGetUser();

  const hasExternalCert = Boolean(user?.externalCertPem);

  const templateCards = useMemo(
    () =>
      (user?.credentialsToIssue ?? [])
        .map((ct) => CREDENTIAL_TYPE_TO_TEMPLATE[ct])
        .filter(Boolean) as {
        templateType: CredentialTemplateType;
        name: string;
      }[],
    [user?.credentialsToIssue],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {templateCards.map((template) => (
        <CredentialTemplateDetailsCard
          key={template.templateType}
          template={template}
          dropdownItems={[]}
          renderFooter={() => {
            // DataSupplier credentials require an X.509 certificate to be
            // imported. Show a prompt instead of "Active" when it is missing.
            if (
              template.templateType ===
                CredentialTemplateType.ExternalKeypair &&
              !hasExternalCert
            ) {
              return (
                <Button
                  color="light"
                  fullSized
                  href="/issuer/verification/cert"
                  as={Link as ElementType}
                >
                  {t('cert-signed.import-to-unlock')}
                </Button>
              );
            }

            return (
              <ColoredBadge
                badgeType="active"
                className="self-center"
              />
            );
          }}
        />
      ))}
    </div>
  );
};
