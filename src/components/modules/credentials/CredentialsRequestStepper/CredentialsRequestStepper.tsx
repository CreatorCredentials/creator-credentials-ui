import { useTranslation } from '@/shared/utils/useTranslation';
import { Stepper } from '@/components/shared/Stepper';

export type CredentialsRequestStepKey =
  | 'select-credential'
  | 'select-issuer'
  | 'verify-keypair'
  | 'confirm-data';

export const CREDENTIALS_REQUEST_BASE_STEP_KEYS: CredentialsRequestStepKey[] = [
  'select-credential',
  'select-issuer',
  'confirm-data',
];

export const CREDENTIALS_REQUEST_KEYPAIR_STEP_KEYS: CredentialsRequestStepKey[] =
  ['select-credential', 'select-issuer', 'verify-keypair', 'confirm-data'];

const STEP_KEY_TO_TKEY: Record<CredentialsRequestStepKey, string> = {
  'select-credential': 'steps.select-credential.label',
  'select-issuer': 'steps.select-issuer.label',
  'verify-keypair': 'steps.verify-keypair.label',
  'confirm-data': 'steps.confirm-data.label',
};

type CredentialsRequestStepperProps = {
  activeStep: number;
  stepKeys?: CredentialsRequestStepKey[];
};

export const CredentialsRequestStepper = ({
  activeStep,
  stepKeys = CREDENTIALS_REQUEST_BASE_STEP_KEYS,
}: CredentialsRequestStepperProps) => {
  const { t } = useTranslation('creator-credentials-request');

  return (
    <Stepper
      steps={stepKeys.map((key) => t(STEP_KEY_TO_TKEY[key]))}
      activeStep={activeStep}
      className="mt-2"
    />
  );
};
