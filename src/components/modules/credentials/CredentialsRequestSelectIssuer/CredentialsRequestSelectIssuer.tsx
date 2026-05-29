import { Button } from 'flowbite-react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { FormFooter } from '@/components/shared/FormFooter';
import { IssuerDetailsCard } from '@/components/shared/IssuerDetailsCard';
import { Loader } from '@/components/shared/Loader';
import { PageHeader } from '@/components/shared/PageHeader';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { useGetIssuers } from '@/api/queries/useGetIssuers';
import { IssuerConnectionStatus } from '@/shared/typings/IssuerConnectionStatus';
import { TEMPLATE_TYPE_TO_CREDENTIAL_TYPE } from '@/shared/typings/CredentialTemplateType';
import { useCredentialsRequestContext } from '../CredentialsRequestContext';
import { CredentialsRequestStepper } from '../CredentialsRequestStepper';
import { CredentialsRequestNoIssuersCard } from '../CredentialsRequestNoIssuersCard';

export const CredentialsRequestSelectIssuer = () => {
  const { t } = useTranslation('creator-credentials-request');

  const {
    selectedIssuer,
    toggleIssuerSelection,
    preSelectedIssuerId,
    stepper,
    stepKeys,
    templates,
  } = useCredentialsRequestContext();

  const { data, isFetching, isLoading, status } = useGetIssuers({});
  const { connected } = useMemo(() => {
    const all =
      data?.filter(
        (issuer) => issuer.status === IssuerConnectionStatus.Connected,
      ) || [];

    // Narrow to issuers that support every selected template type.
    const connected =
      templates.selectedItems.length === 0
        ? all
        : all.filter((issuer) =>
            templates.selectedItems.every((tmpl) => {
              const credType =
                TEMPLATE_TYPE_TO_CREDENTIAL_TYPE[tmpl.templateType];
              if (!credType) return true;
              return issuer.vcs.some((vc) => vc.type === credType);
            }),
          );

    return { connected };
  }, [data, templates.selectedItems]);

  const renderContent = useCallback(() => {
    if (status === 'error') {
      return <ApiErrorMessage message={t('errors.fetching-issuers')} />;
    }

    if (isLoading) {
      return <Loader />;
    }

    const issuersToRender = connected;

    if (issuersToRender.length === 0) {
      return <CredentialsRequestNoIssuersCard />;
    }

    return (
      <div className="mt-8">
        <div className="grid grid-cols-3 gap-4">
          {issuersToRender.map((issuer) => (
            <IssuerDetailsCard
              key={issuer.id}
              issuer={issuer}
              renderFooter={() => {
                const selected = selectedIssuer?.id === issuer.id;

                if (selected) {
                  return (
                    <ColoredBadge
                      badgeType="selected"
                      className="self-center"
                    />
                  );
                }

                return (
                  <Button
                    color="primary"
                    className="self-stretch"
                    onClick={() => toggleIssuerSelection(issuer)}
                  >
                    {t(selected ? 'deselect' : 'select', { ns: 'common' })}
                  </Button>
                );
              }}
            />
          ))}
        </div>
      </div>
    );
  }, [connected, isLoading, selectedIssuer, status, t, toggleIssuerSelection]);

  return (
    <>
      <PageHeader
        title={t('header.title')}
        subtitle={t('steps.select-issuer.description')}
        closeButtonHref="/creator/credentials"
      />
      <div className="flex justify-center">
        <CredentialsRequestStepper
          activeStep={stepper.activeStep}
          stepKeys={stepKeys}
        />
      </div>
      {renderContent()}
      <FormFooter>
        <FormFooter.BackButton
          onClick={stepper.prevStep}
          disabled={isLoading || isFetching}
        />
        <FormFooter.NextButton
          onClick={stepper.nextStep}
          disabled={
            (!selectedIssuer && !preSelectedIssuerId) || isLoading || isFetching
          }
        />
      </FormFooter>
    </>
  );
};
