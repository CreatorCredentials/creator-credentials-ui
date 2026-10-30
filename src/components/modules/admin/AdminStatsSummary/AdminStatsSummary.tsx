import { useTranslation } from '@/shared/utils/useTranslation';
import { useAdminStats } from '@/api/queries/useAdminStats';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';

const STATUSES = [
  CredentialVerificationStatus.Success,
  CredentialVerificationStatus.Pending,
  CredentialVerificationStatus.Revoked,
];

type StatProps = {
  label: string;
  value: number;
};

const Stat = ({ label, value }: StatProps) => (
  <div className="flex flex-col rounded-md border border-grey-2 px-4 py-2">
    <span className="text-xs uppercase text-grey-4">{label}</span>
    <span className="text-lg text-black">{value}</span>
  </div>
);

const sum = (counts: Record<string, number>) =>
  Object.values(counts).reduce((total, count) => total + count, 0);

/** Platform totals above the credentials table; silent while loading or on error. */
export const AdminStatsSummary = () => {
  const { t } = useTranslation('admin');
  const { data } = useAdminStats();

  if (!data) {
    return null;
  }

  return (
    <div
      className="mb-6 flex gap-4"
      data-testid="admin-stats"
    >
      <Stat
        label={t('stats.users')}
        value={sum(data.users)}
      />
      {STATUSES.map((status) => (
        <Stat
          key={status}
          label={t(`credentials.status.${status.toLowerCase()}`)}
          value={data.credentials.byStatus[status] ?? 0}
        />
      ))}
      <Stat
        label={t('stats.revocations-last-30-days')}
        value={data.revocationsLast30Days}
      />
    </div>
  );
};
