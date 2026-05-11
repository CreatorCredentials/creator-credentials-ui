import { Alert, Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { FormFooter } from '@/components/shared/FormFooter';
import { Icon } from '@/components/shared/Icon';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  KeypairVerificationContextProvider,
  useKeypairVerificationContext,
} from '@/components/modules/verification/keypair/KeypairVerificationContext';
import { KeypairVerificationFormWrapper } from '@/components/modules/verification/keypair/KeypairVerificationFormWrapper';
import { useResetKeypairChallenge } from '@/api/mutations/useResetKeypairChallenge';
import { QueryKeys } from '@/api/queryKeys';
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

/**
 * Each credential request must start with a fresh keypair challenge so that
 * stale "verified" (or in-progress) challenges from previous incomplete flows
 * cannot be silently reused. We reset any non-consumed challenge before
 * mounting the form, then clear the React Query cache so the context fetches
 * up-to-date status (null / consumed) and always begins at the "generate" step.
 */
export const CredentialsRequestVerifyKeypair = () => {
  const queryClient = useQueryClient();
  const [resetDone, setResetDone] = useState(false);
  const { mutateAsync: reset } = useResetKeypairChallenge({});

  useEffect(() => {
    let cancelled = false;
    reset()
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        // Remove any cached status so the Provider mounts with a clean fetch.
        queryClient.removeQueries([QueryKeys.keypairChallengeStatus]);
        setResetDone(true);
      });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!resetDone) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <KeypairVerificationContextProvider>
      <VerifyKeypairContent />
    </KeypairVerificationContextProvider>
  );
};
