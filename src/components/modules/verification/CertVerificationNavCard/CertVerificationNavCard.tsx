import { Button } from 'flowbite-react';
import Link from 'next/link';
import { ElementType } from 'react';
import { CardWithBadge } from '@/components/shared/CardWithBadge';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { useGetUser } from '@/api/queries/useGetUser';

export const CertVerificationNavCard = () => {
  const { data: user } = useGetUser();
  const hasExternalCert = Boolean(user?.externalCertPem);
  const href = '/issuer/verification/cert';

  const footer = hasExternalCert ? (
    <>
      <Button
        color="primary"
        fullSized
        href={href}
        as={Link as ElementType}
      >
        Manage External Certificate
      </Button>
      <ColoredBadge
        badgeType="verified"
        className="self-center"
      />
    </>
  ) : (
    <Button
      color="primary"
      fullSized
      href={href}
      as={Link as ElementType}
    >
      Import Certificate
    </Button>
  );

  return (
    <CardWithBadge
      badgeType="verification"
      title="External X.509 Certificate"
      image={{ iconName: 'Verified' }}
      className="flex-1"
      content={
        hasExternalCert ? (
          <CardWithBadge.ContentWithIcon
            iconName="Verified"
            className="whitespace-pre-wrap"
          >
            External certificate registered
          </CardWithBadge.ContentWithIcon>
        ) : (
          <p>
            Import your own X.509 certificate to use in credential signing (
            <code className="rounded bg-gray-100 px-1">x5c</code> header).
          </p>
        )
      }
      footer={footer}
    />
  );
};
