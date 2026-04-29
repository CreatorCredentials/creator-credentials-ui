import { Card } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useSendCredentialsRequest } from '@/api/mutations/useSendCredentialsRequest';
// import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { FormFooter } from '@/components/shared/FormFooter';
import { Icon } from '@/components/shared/Icon';
import { IssuerDetailsCard } from '@/components/shared/IssuerDetailsCard';
import { SuccessfullCredentialRequestConfirmationCard } from '@/components/shared/SuccessfullCredentialRequestConfirmationCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { CredentialTemplateDetailsCard } from '@/components/shared/CredentialTemplateDetailsCard';
import { useToast } from '@/shared/hooks/useToast';
import { useGetUser } from '@/api/queries/useGetUser';
import { KEYPAIR_REQUIRED_TEMPLATE_TYPES } from '@/shared/typings/CredentialTemplateType';
import { KeypairVerificationContextProvider } from '@/components/modules/verification/keypair/KeypairVerificationContext';
import { KeypairVerificationFormWrapper } from '@/components/modules/verification/keypair/KeypairVerificationFormWrapper';
import { useCredentialsRequestContext } from '../CredentialsRequestContext';
import { CredentialsRequestStepper } from '../CredentialsRequestStepper';

export const CredentialsRequestDataConfirmation = () => {
  const { t } = useTranslation('creator-credentials-request');
  const toast = useToast();
  const {
    mutateAsync: sendCredentialsRequest,
    isSuccess: successfullyRequestedCredentials,
    isLoading: isRequestingCredentials,
  } = useSendCredentialsRequest({
    onError: () => {
      toast.error(t('steps.confirm-data.card.request-failed'));
    },
  });

  const { stepper, templates, selectedIssuer } = useCredentialsRequestContext();
  const { data: user } = useGetUser();

  const needsKeypairChallenge =
    templates.selectedItems.some((tmpl) =>
      KEYPAIR_REQUIRED_TEMPLATE_TYPES.includes(tmpl.templateType),
    ) && !user?.externalDidKey;

  const confirmButtonHandler = () => {
    if (!selectedIssuer) return;

    sendCredentialsRequest({
      templates: templates.selectedItems,
      issuerId: selectedIssuer.id,
    });
  };

  if (successfullyRequestedCredentials) {
    return <SuccessfullCredentialRequestConfirmationCard />;
  }

  if (needsKeypairChallenge) {
    return (
      <>
        <PageHeader
          title={t('header.title')}
          subtitle="Complete keypair verification to continue with your credential request."
          closeButtonHref="/creator/credentials"
        />
        <div className="flex justify-center">
          <CredentialsRequestStepper activeStep={stepper.activeStep} />
        </div>
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-4 text-sm font-medium text-blue-800">
            The credential type you selected requires you to verify your own
            cryptographic keypair. Complete the steps below to continue.
          </p>
          <KeypairVerificationContextProvider>
            <KeypairVerificationFormWrapper />
          </KeypairVerificationContextProvider>
        </div>
        <FormFooter>
          <FormFooter.BackButton onClick={stepper.prevStep} />
        </FormFooter>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('header.title')}
        subtitle={t('steps.confirm-data.description')}
        closeButtonHref="/creator/credentials"
      />
      <div className="flex justify-center">
        <CredentialsRequestStepper activeStep={stepper.activeStep} />
      </div>
      <Card className="mt-12 w-full">
        <div className="grid grid-cols-[22rem_4rem_22rem_1fr] gap-4">
          <div>
            <h3 className="mb-4 text-xl">
              {t('steps.confirm-data.card.credential')}
            </h3>
            {templates.selectedItems.map((template) => (
              <CredentialTemplateDetailsCard
                dropdownItems={[]}
                key={template.templateType}
                template={template}
              />
            ))}
          </div>
          <div></div>
          <div>
            <h3 className="mb-4 text-xl">
              {t('steps.confirm-data.card.issuer')}
            </h3>
            <IssuerDetailsCard
              issuer={selectedIssuer!}
              renderFooter={null}
            />
          </div>
        </div>
      </Card>
      <FormFooter>
        <FormFooter.BackButton onClick={stepper.prevStep} />
        <FormFooter.ConfirmButton
          onClick={confirmButtonHandler}
          disabled={!selectedIssuer || isRequestingCredentials}
          isProcessing={isRequestingCredentials}
        >
          {t('confirm', { ns: 'common' })}
          <Icon
            icon="ArrowRight"
            className="ms-2"
          />
        </FormFooter.ConfirmButton>
      </FormFooter>
    </>
  );
};
