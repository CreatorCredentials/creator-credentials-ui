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
        <CredentialsRequestStepper activeStep={stepper.activeStep} />
      </div>
      <Card className="mt-12 w-full">
        <div className="grid grid-cols-[22rem_4rem_22rem_1fr] gap-4">
          <div>
            <h3 className="mb-4 text-xl">
              {t('steps.confirm-data.card.credential')}
            </h3>
            {/* <div className="grid grid-cols-2 gap-4"> */}
            {templates.selectedItems.map((template) => (
              <CredentialTemplateDetailsCard
                dropdownItems={[]}
                key={template.templateType}
                template={template}
              />
            ))}
            {/* </div> */}
          </div>
          <div></div>
          <div>
            <h3 className="mb-4 text-xl">
              {/* mt-14*/}
              {t('steps.confirm-data.card.issuer')}
            </h3>
            {/* <div className="grid grid-cols-2 gap-4"> */}
            <IssuerDetailsCard
              issuer={selectedIssuer!}
              renderFooter={null}
            />
            {/* </div> */}
          </div>
        </div>
        {/* <h4 className="mb-4 mt-14 text-base">
          {t('steps.confirm-data.card.confirm')}
        </h4> */}
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
