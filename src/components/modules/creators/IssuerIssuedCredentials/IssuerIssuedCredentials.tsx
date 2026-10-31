import { useCallback, useMemo, useState } from 'react';
import { Alert, Button, Spinner } from 'flowbite-react';
import { keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { clsxm } from '@/shared/utils/clsxm';
import { Loader } from '@/components/shared/Loader';
import { useIssuersCredentials } from '@/api/queries/useIssuersCredentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { IssuedCredential } from '@/shared/typings/Credentials';
import { CredentialAction } from '@/shared/typings/CredentialAction';
import { CreatorCredentialDetailsCard } from '@/components/shared/CreatorCredentialDetailsCard';
import {
  CredentialsSort,
  CredentialTypeLabelResolver,
  filterCredentials,
  sortCredentials,
} from '@/shared/utils/credentialsList';
import {
  revocationListAction,
  verifyCredentialAction,
} from '@/shared/utils/credentialActions';
import { CreatorsFilters, CredentialsView } from '../CreatorsFilters';
import { IssuedCredentialsTable } from '../IssuedCredentialsTable';
import { IssuedCredentialStatus } from '../IssuedCredentialStatus';
import { RevokeCredentialModal } from '../RevokeCredentialModal';

type IssuedStatusFilter =
  CredentialVerificationStatus.Success | CredentialVerificationStatus.Revoked;

const STATUS_FILTERS: IssuedStatusFilter[] = [
  CredentialVerificationStatus.Success,
  CredentialVerificationStatus.Revoked,
];

type StatusChipsProps = {
  value: IssuedStatusFilter;
  onChange: (status: IssuedStatusFilter) => void;
};

const StatusChips = ({ value, onChange }: StatusChipsProps) => {
  const { t } = useTranslation('issuer-credentials');

  return (
    <div className="mb-6 flex gap-2">
      {STATUS_FILTERS.map((status) => (
        <Button
          key={status}
          pill
          size="xs"
          color={status === value ? 'primary' : 'outline'}
          aria-pressed={status === value}
          data-testid={`issued-status-${status.toLowerCase()}`}
          onClick={() => onChange(status)}
        >
          {t(`issued.status.${status.toLowerCase()}`)}
        </Button>
      ))}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <p
    className="text-xl text-grey-4"
    data-testid="issued-empty"
  >
    {message}
  </p>
);

export const IssuerIssuedCredentials = () => {
  const { t } = useTranslation('issuer-credentials');
  const { t: tCards } = useTranslation('cards');
  const [statusFilter, setStatusFilter] = useState<IssuedStatusFilter>(
    CredentialVerificationStatus.Success,
  );
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CredentialsSort>('newest');
  const [view, setView] = useState<CredentialsView>('cards');
  const [credentialIdToRevoke, setCredentialIdToRevoke] = useState<
    string | null
  >(null);

  const { data, isError, isPending, isFetching, isPlaceholderData } =
    useIssuersCredentials(
      { params: { status: statusFilter } },
      { placeholderData: keepPreviousData },
    );
  // Cached rows of the previous status chip are shown until the new ones arrive.
  const isSwitchingStatus = isPlaceholderData && isFetching;

  const typeLabelOf = useCallback<CredentialTypeLabelResolver>(
    (credential) =>
      tCards(`credential.types.${credential.type.toLowerCase()}.title`),
    [tCards],
  );

  const credentials = data?.credentials;
  const visibleCredentials = useMemo(
    () =>
      sortCredentials(
        filterCredentials(credentials ?? [], query, typeLabelOf),
        sort,
      ),
    [credentials, query, sort, typeLabelOf],
  );

  const actionsFor = (credential: IssuedCredential): CredentialAction[] => [
    ...(credential.status === CredentialVerificationStatus.Success
      ? [
          {
            children: t('issued.actions.revoke'),
            disabled: isSwitchingStatus,
            onClick: () => setCredentialIdToRevoke(credential.id),
            'data-testid': 'credential-revoke',
          },
        ]
      : []),
    ...verifyCredentialAction(credential, t('verify', { ns: 'common' })),
    ...revocationListAction(credential, t('revocation-list', { ns: 'common' })),
  ];

  if (isPending) {
    return <Loader />;
  }

  const renderList = () => {
    if (!credentials?.length) {
      return <EmptyState message={t('issued.empty.no-credentials')} />;
    }
    if (visibleCredentials.length === 0) {
      return <EmptyState message={t('issued.empty.no-matches')} />;
    }
    if (view === 'table') {
      return (
        <IssuedCredentialsTable
          credentials={visibleCredentials}
          actionsFor={actionsFor}
          typeLabelOf={typeLabelOf}
        />
      );
    }
    return (
      <div className="grid grid-cols-3 gap-4">
        {visibleCredentials.map((credential) => (
          <CreatorCredentialDetailsCard
            key={credential.id}
            additionalBadgeType="credential"
            credential={credential}
            subtitle={t('issued.subtitle')}
            dropdownItems={actionsFor(credential)}
            renderFooter={() => (
              <IssuedCredentialStatus
                credential={credential}
                className="self-center"
              />
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <CreatorsFilters
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />
      <StatusChips
        value={statusFilter}
        onChange={setStatusFilter}
      />
      {isError && (
        <Alert
          color="failure"
          className="mb-4"
          data-testid="issued-error-banner"
        >
          {t('errors.fetching-credentials')}
        </Alert>
      )}
      <div
        className="relative"
        aria-busy={isSwitchingStatus}
        data-testid="issued-list"
      >
        {isSwitchingStatus && (
          <Spinner
            size="lg"
            className="absolute inset-x-0 top-2 z-10 mx-auto"
            data-testid="issued-switching"
          />
        )}
        <div className={clsxm({ 'opacity-50': isSwitchingStatus })}>
          {renderList()}
        </div>
      </div>
      {credentialIdToRevoke && (
        <RevokeCredentialModal
          credentialId={credentialIdToRevoke}
          onClose={() => setCredentialIdToRevoke(null)}
        />
      )}
    </>
  );
};
