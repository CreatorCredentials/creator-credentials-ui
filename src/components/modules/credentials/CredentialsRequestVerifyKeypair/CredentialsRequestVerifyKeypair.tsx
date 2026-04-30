import { Alert, Button } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { FormFooter } from '@/components/shared/FormFooter';
import { Icon } from '@/components/shared/Icon';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  KeypairVerificationContextProvider,
  useKeypairVerificationContext,
} from '@/components/modules/verification/keypair/KeypairVerificationContext';
import { KeypairVerificationFormWrapper } from '@/components/modules/verification/keypair/KeypairVerificationFormWrapper';
import { useCredentialsRequestContext } from '../CredentialsRequestContext';
import { CredentialsRequestStepper } from '../CredentialsRequestStepper';

const VerifyKeypairContent = () => {
  const { t } = useTranslation('creator-credentials-request');
  const { stepper, stepKeys } = useCredentialsRequestContext();
  const { currentStep } = useKeypairVerificationContext();

  const isCompleted = currentStep === 'completed';

  return (
    <>
      <PageHeader
        title={t('header.title')}
        subtitle={t('steps.verify-keypair.description')}
        closeButtonHref="/creator/credentials"
      />
      <div className="flex justify-center">
        <CredentialsRequestStepper
          activeStep={stepper.activeStep}
          stepKeys={stepKeys}
        />
      </div>
      {isCompleted && (
        <Alert
          color="success"
          className="mt-8"
        >
          <p className="font-medium">
            {t('steps.verify-keypair.completed.title')}
          </p>
          <p className="text-sm">
            {t('steps.verify-keypair.completed.description')}
          </p>
        </Alert>
      )}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="mb-4 text-sm font-medium text-blue-800">
          {t('steps.verify-keypair.intro')}
        </p>
        <KeypairVerificationFormWrapper />
      </div>
      <FormFooter>
        <FormFooter.BackButton onClick={stepper.prevStep} />
        <Button
          color="primary"
          onClick={stepper.nextStep}
          disabled={!isCompleted}
        >
          {t('steps.verify-keypair.continue-button')}
          <Icon
            icon="ArrowRight"
            className="ms-2"
          />
        </Button>
      </FormFooter>
    </>
  );
};

export const CredentialsRequestVerifyKeypair = () => (
  <KeypairVerificationContextProvider>
    <VerifyKeypairContent />
  </KeypairVerificationContextProvider>
);
