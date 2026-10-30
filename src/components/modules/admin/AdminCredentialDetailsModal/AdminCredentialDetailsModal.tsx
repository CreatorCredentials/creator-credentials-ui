import { ReactNode } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { AdminCredential } from '@/shared/typings/Credentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { creatorOf } from '@/shared/utils/credentialsList';
import { formatDate } from '@/shared/utils/formatDate';
import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';
import { AdminDialog } from '../AdminDialog';
import { issuerDisplayName } from '../AdminCredentialsTable';

const JSON_INDENT = 2;

type DetailProps = {
  label: string;
  children: ReactNode;
};

const Detail = ({ label, children }: DetailProps) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs uppercase text-grey-4">{label}</dt>
    <dd className="break-all text-sm text-black">{children}</dd>
  </div>
);

type AdminCredentialDetailsModalProps = {
  credential: AdminCredential;
  typeLabelOf: (type: CredentialType) => string;
  onClose: () => void;
};

export const AdminCredentialDetailsModal = ({
  credential,
  typeLabelOf,
  onClose,
}: AdminCredentialDetailsModalProps) => {
  const { t } = useTranslation('admin');
  const creator = creatorOf(credential);
  const credentialObject = credential.data.credentialObject;

  return (
    <AdminDialog
      title={t('credentials.details.title')}
      testId="admin-details-modal"
      onClose={onClose}
    >
      <dl className="grid grid-cols-2 gap-4">
        <Detail label={t('credentials.details.creator')}>
          <div>{creator.name || EMPTY_VALUE_PLACEHOLDER}</div>
          <div className="text-grey-4">{creator.email}</div>
          <div className="text-grey-4">{creator.didKey}</div>
        </Detail>
        <Detail label={t('credentials.details.issuer')}>
          <div>
            {issuerDisplayName(credential, t('credentials.self-issued'))}
          </div>
          {credential.issuer?.domain && (
            <div className="text-grey-4">{credential.issuer.domain}</div>
          )}
        </Detail>
        <Detail label={t('credentials.details.type')}>
          {typeLabelOf(credential.type)}
        </Detail>
        <Detail label={t('credentials.details.status')}>
          {credential.status ?? EMPTY_VALUE_PLACEHOLDER}
        </Detail>
        <Detail label={t('credentials.details.issued-at')}>
          {formatDate(credential.issuedAt)}
        </Detail>
        <Detail label={t('credentials.details.updated-at')}>
          {formatDate(credential.updatedAt)}
        </Detail>
        {credential.revokedAt && (
          <>
            <Detail label={t('credentials.details.revoked-at')}>
              {formatDate(credential.revokedAt)}
            </Detail>
            <Detail label={t('credentials.details.revoked-by')}>
              {credential.revokedBy
                ? `${credential.revokedBy.name ?? credential.revokedBy.id} (${credential.revokedBy.role})`
                : EMPTY_VALUE_PLACEHOLDER}
            </Detail>
            <Detail label={t('credentials.details.reason')}>
              {credential.revokedReason || EMPTY_VALUE_PLACEHOLDER}
            </Detail>
          </>
        )}
        <Detail label={t('credentials.details.status-list')}>
          {credential.statusList ? (
            <>
              <div>
                {t('credentials.details.status-list-index', {
                  index: String(credential.statusList.index),
                })}
              </div>
              <a
                href={credential.statusList.credential}
                target="_blank"
                rel="noreferrer"
                className="break-all text-primary underline underline-offset-[3px]"
                data-testid="admin-status-list-link"
              >
                {credential.statusList.credential}
              </a>
            </>
          ) : (
            <span data-testid="admin-no-status-entry">
              {t('credentials.details.no-status-entry')}
            </span>
          )}
        </Detail>
      </dl>
      <section className="flex flex-col gap-2">
        <h3 className="text-xs uppercase text-grey-4">
          {t('credentials.details.credential-object')}
        </h3>
        {credentialObject ? (
          <pre
            className="scrollbar max-h-96 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-black"
            data-testid="admin-credential-object"
          >
            {JSON.stringify(credentialObject, null, JSON_INDENT)}
          </pre>
        ) : (
          <p className="text-sm text-grey-4">
            {t('credentials.details.no-credential-object')}
          </p>
        )}
      </section>
    </AdminDialog>
  );
};
