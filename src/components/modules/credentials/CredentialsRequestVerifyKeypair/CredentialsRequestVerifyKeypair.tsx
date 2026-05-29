import { Alert, Button, Spinner, TextInput } from 'flowbite-react';
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
import { useSetOrganizationName } from '@/api/mutations/useSetOrganizationName';
import { useGetUser } from '@/api/queries/useGetUser';
import { AxiosError } from '@/api/axiosNest';
import { QueryKeys } from '@/api/queryKeys';
import {
  CredentialTemplateType,
  TEMPLATE_TYPE_TO_CREDENTIAL_TYPE,
} from '@/shared/typings/CredentialTemplateType';
import { CredentialType } from '@/shared/typings/CredentialType';
import { useCredentialsRequestContext } from '../CredentialsRequestContext';
import { CredentialsRequestStepper } from '../CredentialsRequestStepper';

const OrganizationNameGate = ({
  onSaved,
}: {
  onSaved: (name: string) => void;
}) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isLoading } = useSetOrganizationName({
    onSuccess: (user) => {
      queryClient.invalidateQueries([QueryKeys.getUser]);
      if (user.organizationName) {
        onSaved(user.organizationName);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!value.trim()) {
      setError('Organization name must not be empty.');
      return;
    }
    try {
      await mutateAsync(value.trim());
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr?.response?.data?.message ??
          'Failed to save organization name. Please try again.',
      );
    }
  };

  return (
    <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
      <p className="mb-1 text-base font-semibold text-amber-900">
        Organization name required
      </p>
      <p className="mb-4 text-sm text-amber-800">
        Data Supplier credentials include your organization name in the
        credential subject. You must set it once before proceeding — this value
        is permanent. To change it later, contact{' '}
        <a
          href="mailto:info@liccium.com"
          className="font-medium underline"
        >
          info@liccium.com
        </a>
        .
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <div className="flex gap-2">
          <TextInput
            className="flex-1"
            placeholder="e.g. Acme Media GmbH"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button
            type="submit"
            color="primary"
            isProcessing={isLoading}
            disabled={isLoading || !value.trim()}
          >
            Save & continue
          </Button>
        </div>
        {error && (
          <Alert color="failure">
            <p className="text-sm">{error}</p>
          </Alert>
        )}
      </form>
    </div>
  );
};

const VerifyKeypairContent = () => {
  const { t } = useTranslation('creator-credentials-request');
  const { stepper, stepKeys, templates } = useCredentialsRequestContext();
  const { currentStep } = useKeypairVerificationContext();
  const { data: user } = useGetUser();

  const selectedTemplate = templates.selectedItems[0];
  const credentialType = selectedTemplate
    ? (TEMPLATE_TYPE_TO_CREDENTIAL_TYPE[
        selectedTemplate.templateType as CredentialTemplateType
      ] as CredentialType | undefined)
    : undefined;
  const requiresOrganizationName =
    credentialType === CredentialType.DataSupplier;

  const [localOrgName, setLocalOrgName] = useState<string | null>(
    user?.organizationName ?? null,
  );

  const orgName = localOrgName ?? user?.organizationName ?? null;
  const hasOrgName = orgName !== null && orgName !== undefined;

  const isCompleted = currentStep === 'completed';

  const canProceed = isCompleted && (!requiresOrganizationName || hasOrgName);

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

      {requiresOrganizationName && !hasOrgName && (
        <OrganizationNameGate onSaved={(name) => setLocalOrgName(name)} />
      )}

      {requiresOrganizationName && hasOrgName && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <span className="text-sm text-green-800">
            <span className="font-medium">Organization:</span> {orgName}
          </span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            ✓ Set
          </span>
        </div>
      )}

      {(!requiresOrganizationName || hasOrgName) && (
        <>
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
        </>
      )}

      <FormFooter>
        <FormFooter.BackButton onClick={stepper.prevStep} />
        <Button
          color="primary"
          onClick={stepper.nextStep}
          disabled={!canProceed}
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

    const prepareFreshChallenge = async () => {
      try {
        await reset();
      } catch {
        // Non-fatal — still clear any cached status before mounting the form.
      }

      if (cancelled) return;

      await queryClient.cancelQueries([QueryKeys.keypairChallengeStatus]);
      queryClient.removeQueries([QueryKeys.keypairChallengeStatus]);
      setResetDone(true);
    };

    void prepareFreshChallenge();

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
