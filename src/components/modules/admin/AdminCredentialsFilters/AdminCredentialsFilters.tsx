import { Button, Select, TextInput } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { Icon } from '@/components/shared/Icon';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialIssuer } from '@/shared/typings/Credentials';
import {
  ADMIN_STATUS_FILTERS,
  AdminCredentialsFilters as Filters,
} from '../AdminCredentials/adminCredentialsFilters';

const ALL = '';

type AdminCredentialsFiltersProps = {
  filters: Filters;
  issuers: CredentialIssuer[];
  typeLabelOf: (type: CredentialType) => string;
  onChange: (patch: Partial<Omit<Filters, 'page'>>) => void;
};

export const AdminCredentialsFilters = ({
  filters,
  issuers,
  typeLabelOf,
  onChange,
}: AdminCredentialsFiltersProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <TextInput
          sizing="lg"
          color="primary"
          icon={() => <Icon icon="Search" />}
          placeholder={t('credentials.filters.search-placeholder')}
          className="min-w-[25rem] flex-1"
          value={filters.q}
          onChange={(event) => onChange({ q: event.target.value })}
          data-testid="admin-search"
        />
        <Select
          aria-label={t('credentials.filters.type')}
          value={filters.type ?? ALL}
          onChange={(event) =>
            onChange({
              type: (event.target.value || undefined) as
                CredentialType | undefined,
            })
          }
          data-testid="admin-filter-type"
        >
          <option value={ALL}>{t('credentials.filters.all-types')}</option>
          {Object.values(CredentialType).map((type) => (
            <option
              key={type}
              value={type}
            >
              {typeLabelOf(type)}
            </option>
          ))}
        </Select>
        <Select
          aria-label={t('credentials.filters.issuer')}
          value={filters.issuerId ?? ALL}
          onChange={(event) =>
            onChange({
              issuerId: event.target.value
                ? Number(event.target.value)
                : undefined,
            })
          }
          data-testid="admin-filter-issuer"
        >
          <option value={ALL}>{t('credentials.filters.all-issuers')}</option>
          {issuers.map((issuer) => (
            <option
              key={issuer.id}
              value={issuer.id}
            >
              {issuer.name || issuer.domain || issuer.id}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex gap-2">
        {ADMIN_STATUS_FILTERS.map((status) => (
          <Button
            key={status}
            pill
            size="xs"
            color={status === filters.status ? 'primary' : 'outline'}
            aria-pressed={status === filters.status}
            data-testid={`admin-filter-status-${status.toLowerCase()}`}
            onClick={() => onChange({ status })}
          >
            {t(`credentials.status.${status.toLowerCase()}`)}
          </Button>
        ))}
      </div>
    </div>
  );
};
