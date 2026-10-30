import { screen, within } from '@testing-library/react';
import { render } from '@/shared/utils/testUtils';
import { CredentialVerificationResult } from '@/shared/typings/CredentialVerification';
import { VerifyResultCard } from './VerifyResultCard';

const CHECKED_AT = '2026-10-29T10:00:00.000Z';

const validResult: CredentialVerificationResult = {
  valid: true,
  checks: {
    signature: {
      valid: true,
      issuerDid: 'did:web:acme-publishing.test',
      certificateSubject: 'CN=Acme Publishing',
    },
    validity: {
      valid: true,
      validFrom: '2026-06-01T10:00:00.000Z',
      validUntil: '2027-06-01T10:00:00.000Z',
    },
    revocation: { status: 'valid', checkedAt: CHECKED_AT },
  },
  credential: { id: 'urn:uuid:1' },
};

const withChecks = (
  checks: Partial<CredentialVerificationResult['checks']>,
): CredentialVerificationResult => ({
  ...validResult,
  valid: false,
  checks: { ...validResult.checks, ...checks },
});

const check = (name: string) =>
  screen.getByTestId(`admin-verify-check-${name}`);

// `t` returns the key in unit tests (see setupTests.ts).
const T = {
  valid: 'verify.result.valid',
  invalid: 'verify.result.invalid',
  failed: 'verify.result.outcome.failed',
  revoked: 'verify.result.outcome.revoked',
  noStatusEntry: 'verify.result.no-status-entry',
};

describe('VerifyResultCard', () => {
  it('shows a valid credential with all three checks passed', () => {
    render(<VerifyResultCard result={validResult} />);

    const card = screen.getByTestId('admin-verify-result');
    expect(card).toHaveAttribute('data-valid', 'true');
    expect(within(card).getByText(T.valid)).toBeInTheDocument();
    expect(check('signature')).toHaveAttribute('data-outcome', 'passed');
    expect(check('validity')).toHaveAttribute('data-outcome', 'passed');
    expect(check('revocation')).toHaveAttribute('data-outcome', 'passed');
    expect(
      within(check('signature')).getByText('did:web:acme-publishing.test'),
    ).toBeInTheDocument();
    expect(
      within(check('validity')).getByText('01 Jun 2027'),
    ).toBeInTheDocument();
  });

  it('marks a revoked credential as invalid while the signature stays passed', () => {
    render(
      <VerifyResultCard
        result={withChecks({
          revocation: { status: 'revoked', checkedAt: CHECKED_AT },
        })}
      />,
    );

    expect(screen.getByTestId('admin-verify-result')).toHaveAttribute(
      'data-valid',
      'false',
    );
    expect(screen.getByText(T.invalid)).toBeInTheDocument();
    expect(check('signature')).toHaveAttribute('data-outcome', 'passed');
    expect(check('revocation')).toHaveAttribute('data-outcome', 'revoked');
    expect(
      within(check('revocation')).getByText(T.revoked),
    ).toBeInTheDocument();
  });

  it('fails the signature check of a tampered credential', () => {
    render(
      <VerifyResultCard
        result={withChecks({
          signature: {
            valid: false,
            issuerDid: null,
            certificateSubject: null,
          },
        })}
      />,
    );

    expect(check('signature')).toHaveAttribute('data-outcome', 'failed');
    expect(within(check('signature')).getByText(T.failed)).toBeInTheDocument();
    expect(within(check('signature')).getAllByText('—')).toHaveLength(2);
  });

  it('shows an unknown revocation status as neutral with an explanation', () => {
    render(
      <VerifyResultCard
        result={{
          ...validResult,
          checks: {
            ...validResult.checks,
            revocation: { status: 'unknown', checkedAt: CHECKED_AT },
          },
        }}
      />,
    );

    expect(check('revocation')).toHaveAttribute('data-outcome', 'unknown');
    expect(
      within(check('revocation')).getByText(T.noStatusEntry),
    ).toBeInTheDocument();
  });

  it('shows a failed status list check as failed with its reason', () => {
    render(
      <VerifyResultCard
        result={{
          ...validResult,
          valid: false,
          checks: {
            ...validResult.checks,
            revocation: {
              status: 'error',
              reason: 'STATUS_VERIFICATION_ERROR',
              checkedAt: CHECKED_AT,
            },
          },
        }}
      />,
    );

    expect(check('revocation')).toHaveAttribute('data-outcome', 'failed');
    expect(
      within(check('revocation')).getByText(
        'verify.result.reason.STATUS_VERIFICATION_ERROR',
      ),
    ).toBeInTheDocument();
  });

  it('exposes the raw response in a collapsible block', () => {
    render(<VerifyResultCard result={validResult} />);

    const raw = screen.getByTestId('admin-verify-raw');
    expect(raw.tagName).toBe('DETAILS');
    expect(raw).toHaveTextContent(
      '"issuerDid": "did:web:acme-publishing.test"',
    );
  });
});
