import React, { useMemo } from 'react';
import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
// import { useAuth } from '@clerk/nextjs';
// import { useRouter } from 'next/router';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { Icon } from '@/components/shared/Icon';
// import axiosNest from '@/api/axiosNest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadJson(exportName: string, content: any) {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(content, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

type CreatorIssuedCredentialsProps = {
  credentials: VerifiedCredentialsUnion[];
};

export const CreatorIssuedCredentials = ({
  credentials,
}: CreatorIssuedCredentialsProps) => {
  const { t } = useTranslation('cards');
  // const router = useRouter();
  // const auth = useAuth();
  const issuedCredentials = useMemo(
    () =>
      credentials.filter(
        (credential) =>
          credential.status &&
          credential.status === CredentialVerificationStatus.Success,
      ),
    [credentials],
  );

  return (
    <section className="grid grid-cols-3 gap-4">
      {issuedCredentials.map((credential) => (
        <CredentialDetailsCard
          key={credential.id}
          credential={credential}
          dropdownItems={
            [
              //   {
              //     onClick: async () => {
              //       const token = await auth.getToken();
              //       await axiosNest.delete(`v1/credentials`, {
              //         headers: {
              //           Authorization: `Bearer ${token}`,
              //         },
              //       });
              //       router.reload();
              //     },
              //     children: 'Delete credential',
              //   },
            ]
          }
          renderFooter={() => (
            <Button
              color="outline"
              className="self-stretch"
              onClick={() =>
                downloadJson(
                  `${credential.data.credentialsObject.credentialSubject.email} ${credential.data.credentialsObject.validFrom}`,
                  credential.data.credentialsObject,
                )
              }
            >
              {t('download', { ns: 'common' })}
              <Icon
                icon="Download"
                className="ms-2"
              />
            </Button>
          )}
        />
      ))}
    </section>
  );
};
