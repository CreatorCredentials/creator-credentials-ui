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
import { useUpdateActiveDidKeySource } from '@/api/mutations/useUpdateActiveDidKeySource';
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
  const { mutateAsync: updateActiveSource } = useUpdateActiveDidKeySource();

  const confirmButtonHandler = () => {
    if (!selectedIssuer) return;

    sendCredentialsRequest({
      templates: templates.selectedItems,
      issuerId: selectedIssuer.id,
    });
  };

  const handleDidSourceChange = async (source: 'platform' | 'external') => {
    await updateActiveSource(source);
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
        {user?.externalDidKey && (
          <div className="mt-6 border-t pt-4">
            <h3 className="mb-3 text-base font-medium">
              DID:key to use for this credential
            </h3>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="didKeySource"
                  value="platform"
                  checked={user.activeDidKeySource === 'platform'}
                  onChange={() => handleDidSourceChange('platform')}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium">Platform DID:key</p>
                  <p className="break-all font-mono text-xs text-gray-500">
                    {user.activeDidKeySource === 'platform' ? '(active)' : ''}
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="didKeySource"
                  value="external"
                  checked={user.activeDidKeySource === 'external'}
                  onChange={() => handleDidSourceChange('external')}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium">Your External DID:key</p>
                  <p className="break-all font-mono text-xs text-gray-500">
                    {user.externalDidKey}
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
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
