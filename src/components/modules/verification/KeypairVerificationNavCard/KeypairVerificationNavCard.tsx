import { Button } from 'flowbite-react';
import Link from 'next/link';
import { ElementType } from 'react';
import { CardWithBadge } from '@/components/shared/CardWithBadge';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { UserRole } from '@/shared/typings/UserRole';
import { useGetUser } from '@/api/queries/useGetUser';

type KeypairVerificationNavCardProps = {
  userRole: UserRole;
};

export const KeypairVerificationNavCard = ({
  userRole,
}: KeypairVerificationNavCardProps) => {
  const { data: user } = useGetUser();
  const hasExternalKey = Boolean(user?.externalDidKey);
  const href = `/${userRole.toLowerCase()}/verification/keypair`;

  const footer = hasExternalKey ? (
    <>
      <Button
        color="primary"
        fullSized
        href={href}
        as={Link as ElementType}
      >
        Manage External Key
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
      Register Keypair
    </Button>
  );

  return (
    <CardWithBadge
      badgeType="verification"
      title="External DID:key"
      image={{ iconName: 'Verified' }}
      className="flex-1"
      content={
        hasExternalKey && user?.externalDidKey ? (
          <CardWithBadge.ContentWithIcon
            iconName="Verified"
            className="whitespace-pre-wrap"
          >
            {user.externalDidKey.slice(0, 32)}…
          </CardWithBadge.ContentWithIcon>
        ) : (
          <p>
            Register your own EC P-256 keypair as an alternative DID identifier.
          </p>
        )
      }
      footer={footer}
    />
  );
};
