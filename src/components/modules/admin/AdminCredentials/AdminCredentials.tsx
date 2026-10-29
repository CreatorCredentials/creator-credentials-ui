import { Alert, Spinner } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { clsxm } from '@/shared/utils/clsxm';
import { Loader } from '@/components/shared/Loader';
import { useAdminCredentials } from '@/api/queries/useAdminCredentials';
import { useAdminUsers } from '@/api/queries/useAdminUsers';
import { ClerkRole } from '@/api/requests/getUser';
import { AdminCredential } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { AdminCredentialsFilters } from '../AdminCredentialsFilters';
import { AdminCredentialsTable } from '../AdminCredentialsTable';
import { AdminCredentialDetailsModal } from '../AdminCredentialDetailsModal';
import { AdminRevokeCredentialModal } from '../AdminRevokeCredentialModal';
import { AdminPagination } from '../AdminPagination';
import { AdminStatsSummary } from '../AdminStatsSummary';
import { AdminCredentialsFilters as Filters } from './adminCredentialsFilters';
import { useAdminCredentialsFilters } from './useAdminCredentialsFilters';

/** Upper bound of the admin API page size; every issuer fits in one select. */
const ISSUER_OPTIONS_PAGE_SIZE = 100;

type AdminCredentialsProps = {
  initialFilters: Filters;
};

export const AdminCredentials = ({ initialFilters }: AdminCredentialsProps) => {
  const { t } = useTranslation('admin');
  const { t: tCards } = useTranslation('cards');
  const { filters, params, update, setPage } =
    useAdminCredentialsFilters(initialFilters);
  const [viewedCredential, setViewedCredential] =
    useState<AdminCredential | null>(null);
  const [credentialIdToRevoke, setCredentialIdToRevoke] = useState<
    string | null
  >(null);

  const { data, isError, isPending, isFetching, isPlaceholderData } =
    useAdminCredentials(params, { placeholderData: keepPreviousData });
  const { data: issuersPage } = useAdminUsers({
    role: ClerkRole.Issuer,
    pageSize: ISSUER_OPTIONS_PAGE_SIZE,
  });
  // Rows of the previous filters stay visible until the new page arrives.
  const isRefreshing = isPlaceholderData && isFetching;

  const typeLabelOf = useCallback(
    (type: CredentialType) =>
      tCards(`credential.types.${type.toLowerCase()}.title`),
    [tCards],
  );

  const issuers = (issuersPage?.items ?? []).map((issuer) => ({
    id: issuer.id,
    name: issuer.organizationName || issuer.name,
    domain: issuer.domain,
  }));

  const renderList = () => {
    if (isPending) {
      return <Loader />;
    }
    if (!data?.items.length) {
      return (
        <p
          className="text-xl text-grey-4"
          data-testid="admin-empty"
        >
          {t('credentials.empty')}
        </p>
      );
    }
    return (
      <>
        <AdminCredentialsTable
          credentials={data.items}
          typeLabelOf={typeLabelOf}
          onView={setViewedCredential}
          onRevoke={(credential) => setCredentialIdToRevoke(credential.id)}
        />
        <AdminPagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      </>
    );
  };

  return (
    <>
      <AdminStatsSummary />
      <AdminCredentialsFilters
        filters={filters}
        issuers={issuers}
        typeLabelOf={typeLabelOf}
        onChange={update}
      />
      {isError && (
        <Alert
          color="failure"
          className="mb-4"
          data-testid="admin-error-banner"
        >
          {t('credentials.error')}
        </Alert>
      )}
      <div
        className="relative min-h-[8rem]"
        aria-busy={isRefreshing}
        data-testid="admin-credentials-list"
      >
        {isRefreshing && (
          <Spinner
            size="lg"
            className="absolute inset-x-0 top-2 z-10 mx-auto"
            data-testid="admin-refreshing"
          />
        )}
        <div className={clsxm({ 'opacity-50': isRefreshing })}>
          {renderList()}
        </div>
      </div>
      {viewedCredential && (
        <AdminCredentialDetailsModal
          credential={viewedCredential}
          typeLabelOf={typeLabelOf}
          onClose={() => setViewedCredential(null)}
        />
      )}
      {credentialIdToRevoke && (
        <AdminRevokeCredentialModal
          credentialId={credentialIdToRevoke}
          onClose={() => setCredentialIdToRevoke(null)}
        />
      )}
    </>
  );
};
