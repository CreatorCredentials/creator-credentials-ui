import { Button } from 'flowbite-react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
// import { useRequestableCredentials } from '@/api/queries/useRequestableCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { FormFooter } from '@/components/shared/FormFooter';
import { Loader } from '@/components/shared/Loader';
import { PageHeader } from '@/components/shared/PageHeader';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { CredentialTemplateDetailsCard } from '@/components/shared/CredentialTemplateDetailsCard';
import { useCreatorsRequestableTemplates } from '@/api/queries/useCreatorsRequestableTemplates';
import { TEMPLATE_TYPE_TO_CREDENTIAL_TYPE } from '@/shared/typings/CredentialTemplateType';
import { VerifiedCredentialsTemplate } from '@/shared/typings/Templates';
import { useGetIssuers } from '@/api/queries/useGetIssuers';
import { IssuerConnectionStatus } from '@/shared/typings/IssuerConnectionStatus';
import { useCredentialsRequestContext } from '../CredentialsRequestContext';
import { CredentialsRequestStepper } from '../CredentialsRequestStepper';

export const CredentialsRequestSelectCredentials = () => {
  const { t } = useTranslation('creator-credentials-request');

  const { stepper, templates, stepKeys, preSelectedIssuerId } =
    useCredentialsRequestContext();

  const { data, isFetching, isLoading, status } =
    useCreatorsRequestableTemplates();

  const { data: issuersData, isLoading: issuersLoading } = useGetIssuers({});

  // Collect the credential types that relevant connected issuers actually
  // support. When a specific issuer is pre-selected, only that issuer counts;
  // otherwise the union of all connected issuers is used.
  const supportedCredentialTypes = useMemo(() => {
    const connected =
      issuersData?.filter(
        (issuer) => issuer.status === IssuerConnectionStatus.Connected,
      ) ?? [];

    const relevant = preSelectedIssuerId
      ? connected.filter((i) => i.id === preSelectedIssuerId)
      : connected;

    const types = new Set<string>();
    relevant.forEach((issuer) =>
      issuer.vcs.forEach((vc) => types.add(vc.type)),
    );
    return types;
  }, [issuersData, preSelectedIssuerId]);

  const templatesToRender = useMemo(() => {
    const all: Omit<VerifiedCredentialsTemplate, 'id'>[] = [
      ...(data?.templates ?? []),
    ];

    // While issuers are still loading, show everything to avoid a flash of
    // an empty list. Once the issuer list is known, keep only templates
    // whose credential type is offered by at least one relevant connected issuer.
    if (issuersLoading) return all;

    return all.filter((template) => {
      const credType = TEMPLATE_TYPE_TO_CREDENTIAL_TYPE[template.templateType];
      if (!credType) return true;
      return supportedCredentialTypes.has(credType);
    });
  }, [data, issuersLoading, supportedCredentialTypes]);

  const renderContent = useCallback(() => {
    if (status === 'error') {
      return <ApiErrorMessage message={t('errors.fetching-credentials')} />;
    }

    if (isLoading) {
      return <Loader />;
    }

    if (templatesToRender.length === 0) {
      return (
        <p className="mt-8 text-center text-gray-500">
          {t('steps.select-credential.no-types-available')}
        </p>
      );
    }

    return (
      <div className="mt-8">
        <div className="grid grid-cols-3 gap-4">
          {templatesToRender.map((template) => (
            <CredentialTemplateDetailsCard
              key={template.templateType}
              dropdownItems={[]}
              template={template}
              renderFooter={() => {
                const selected = templates.isSelected(template);

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
                    color="outline"
                    className="self-stretch"
                    onClick={() => templates.toggleSelection(template)}
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
  }, [templates, templatesToRender, isLoading, status, t]);

  return (
    <>
      <PageHeader
        title={t('header.title')}
        subtitle={t('steps.select-credential.description')}
        closeButtonHref="/creator/credentials"
      />
      <div className="flex justify-center">
        <CredentialsRequestStepper
          activeStep={stepper.activeStep}
          stepKeys={stepKeys}
        />
      </div>
      {renderContent()}
      <FormFooter className="justify-end">
        <FormFooter.NextButton
          onClick={stepper.nextStep}
          disabled={
            templates.selectedItems.length === 0 || isLoading || isFetching
          }
        />
      </FormFooter>
    </>
  );
};
