import { ReactNode } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { clsxm } from '@/shared/utils/clsxm';
import { Icon, IconName } from '@/components/shared/Icon';
import {
  CredentialVerificationResult,
  RevocationCheck,
  SignatureCheck,
  ValidityCheck,
} from '@/shared/typings/CredentialVerification';
import { formatDate } from '@/shared/utils/formatDate';
import { EMPTY_VALUE_PLACEHOLDER } from '@/shared/constants/placeholders';

const JSON_INDENT = 2;

type CheckOutcome = 'passed' | 'failed' | 'revoked' | 'unknown';

const OUTCOME_STYLE: Record<
  CheckOutcome,
  { icon: IconName; className: string }
> = {
  passed: { icon: 'CheckCircle', className: 'fill-success text-success' },
  failed: { icon: 'Close', className: 'fill-alert text-alert' },
  revoked: { icon: 'Close', className: 'fill-alert text-alert' },
  unknown: { icon: 'Info', className: 'fill-grey-4 text-grey-4' },
};

const passOrFail = (valid: boolean): CheckOutcome =>
  valid ? 'passed' : 'failed';

const revocationOutcome = (check: RevocationCheck): CheckOutcome => {
  switch (check.status) {
    case 'valid':
      return 'passed';
    case 'revoked':
      return 'revoked';
    case 'unknown':
      return 'unknown';
  }
};

type CheckRowProps = {
  name: 'signature' | 'validity' | 'revocation';
  outcome: CheckOutcome;
  children: ReactNode;
};

const CheckRow = ({ name, outcome, children }: CheckRowProps) => {
  const { t } = useTranslation('admin');
  const { icon, className } = OUTCOME_STYLE[outcome];

  return (
    <li
      className="flex items-start gap-3 py-3"
      data-testid={`admin-verify-check-${name}`}
      data-outcome={outcome}
    >
      <Icon
        icon={icon}
        className={clsxm('mt-0.5 shrink-0', className)}
      />
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-black">
            {t(`verify.result.checks.${name}`)}
          </span>
          <span className={clsxm('text-sm font-medium', className)}>
            {t(`verify.result.outcome.${outcome}`)}
          </span>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-sm text-grey-4">
          {children}
        </dl>
      </div>
    </li>
  );
};

type FactProps = {
  label: string;
  value: string | null | undefined;
};

const Fact = ({ label, value }: FactProps) => (
  <>
    <dt>{label}</dt>
    <dd className="break-all text-black">{value || EMPTY_VALUE_PLACEHOLDER}</dd>
  </>
);

const SignatureFacts = ({ check }: { check: SignatureCheck }) => {
  const { t } = useTranslation('admin');
  return (
    <>
      <Fact
        label={t('verify.result.issuer-did')}
        value={check.issuerDid}
      />
      <Fact
        label={t('verify.result.certificate-subject')}
        value={check.certificateSubject}
      />
    </>
  );
};

const ValidityFacts = ({ check }: { check: ValidityCheck }) => {
  const { t } = useTranslation('admin');
  return (
    <>
      <Fact
        label={t('verify.result.valid-from')}
        value={formatDate(check.validFrom)}
      />
      <Fact
        label={t('verify.result.valid-until')}
        value={formatDate(check.validUntil)}
      />
    </>
  );
};

const RevocationFacts = ({ check }: { check: RevocationCheck }) => {
  const { t } = useTranslation('admin');
  return (
    <>
      {check.status === 'unknown' && (
        <dt className="col-span-2">{t('verify.result.no-status-entry')}</dt>
      )}
      <Fact
        label={t('verify.result.checked-at')}
        value={formatDate(check.checkedAt)}
      />
    </>
  );
};

type VerifyResultCardProps = {
  result: CredentialVerificationResult;
};

export const VerifyResultCard = ({ result }: VerifyResultCardProps) => {
  const { t } = useTranslation('admin');
  const { signature, validity, revocation } = result.checks;

  return (
    <section
      className={clsxm(
        'flex flex-col gap-4 rounded-lg border-2 bg-white p-6',
        result.valid ? 'border-success' : 'border-alert',
      )}
      data-testid="admin-verify-result"
      data-valid={result.valid}
    >
      <h2
        className={clsxm(
          'text-xl font-medium',
          result.valid ? 'text-success' : 'text-alert',
        )}
      >
        {t(result.valid ? 'verify.result.valid' : 'verify.result.invalid')}
      </h2>
      <ul className="divide-y divide-gray-200">
        <CheckRow
          name="signature"
          outcome={passOrFail(signature.valid)}
        >
          <SignatureFacts check={signature} />
        </CheckRow>
        <CheckRow
          name="validity"
          outcome={passOrFail(validity.valid)}
        >
          <ValidityFacts check={validity} />
        </CheckRow>
        <CheckRow
          name="revocation"
          outcome={revocationOutcome(revocation)}
        >
          <RevocationFacts check={revocation} />
        </CheckRow>
      </ul>
      <details data-testid="admin-verify-raw">
        <summary className="cursor-pointer text-sm text-grey-4">
          {t('verify.result.raw')}
        </summary>
        <pre className="scrollbar mt-2 max-h-96 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-black">
          {JSON.stringify(result, null, JSON_INDENT)}
        </pre>
      </details>
    </section>
  );
};
