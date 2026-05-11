import { Card } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useSendCredentialsRequest } from '@/api/mutations/useSendCredentialsRequest';
import { FormFooter } from '@/components/shared/FormFooter';
import { Icon } from '@/components/shared/Icon';
import { IssuerDetailsCard } from '@/components/shared/IssuerDetailsCard';
import { SuccessfullCredentialRequestConfirmationCard } from '@/components/shared/SuccessfullCredentialRequestConfirmationCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { CredentialTemplateDetailsCard } from '@/components/shared/CredentialTemplateDetailsCard';
import { useToast } from '@/shared/hooks/useToast';
import { AxiosError } from '@/api/axiosNest';
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
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        toast.warning(t('steps.confirm-data.card.request-conflict'));
      } else {
        toast.error(t('steps.confirm-data.card.request-failed'));
      }
    },
  });

  const { stepper, templates, selectedIssuer, stepKeys } =
    useCredentialsRequestContext();

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

  return (
    <>
      <PageHeader
        title={t('header.title')}
        subtitle={t('steps.confirm-data.description')}
        closeButtonHref="/creator/credentials"
      />
      <div className="flex justify-center">
        <CredentialsRequestStepper
          activeStep={stepper.activeStep}
          stepKeys={stepKeys}
        />
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
