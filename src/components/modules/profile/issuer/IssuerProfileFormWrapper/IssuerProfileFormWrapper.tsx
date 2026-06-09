import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useIssuerProfile } from '@/api/queries/useIssuerProfile';
import { useUpdateUserProfile } from '@/api/mutations/useUpdateUserProfile';
import { useToast } from '@/shared/hooks/useToast';
import { QueryKeys } from '@/api/queryKeys';
import { AxiosError } from '@/api/axiosNest';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { IssuerProfileFormContextType } from '../IssuerProfileForm/IssuerProfileFormContextType';
import { IssuerProfileFormSchema } from '../IssuerProfileForm/IssuerProfileFormSchema';
import { IssuerProfileForm } from '../IssuerProfileForm';
import { issuerProfileFormDefaultValues } from '../IssuerProfileForm/IssuerProfileFormDefaultValues';

export const IssuerProfileFormWrapper = () => {
  const { t } = useTranslation('issuer-profile');
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, status, isLoading } = useIssuerProfile();

  const form = useForm<IssuerProfileFormContextType>({
    resolver: joiResolver(IssuerProfileFormSchema),
    defaultValues: issuerProfileFormDefaultValues,
    values: data,
    mode: 'onBlur',
  });

  const { mutateAsync, isLoading: isSaving } = useUpdateUserProfile({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.issuerProfile]);
      toast.success('Profile updated successfully.');
    },
    onError: (err) => {
      const axiosErr = err as AxiosError<{ message?: string }>;
      toast.error(
        axiosErr?.response?.data?.message ?? t('errors.fetching-profile'),
      );
    },
  });

  const onSubmit: SubmitHandler<IssuerProfileFormContextType> = async (
    formData,
  ) => {
    await mutateAsync({
      description: formData.description,
      domain: formData.domain,
    });
  };

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-profile')} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormProvider {...form}>
      <IssuerProfileForm
        handleSubmit={form.handleSubmit(onSubmit)}
        isLoading={isSaving}
      />
    </FormProvider>
  );
};
