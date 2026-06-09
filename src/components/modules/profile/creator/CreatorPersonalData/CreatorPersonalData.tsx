import React, { useEffect, useState } from 'react';
import { Alert, Button, Textarea, TextInput } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useGetUser } from '@/api/queries/useGetUser';
import { useUpdateUserProfile } from '@/api/mutations/useUpdateUserProfile';
import { QueryKeys } from '@/api/queryKeys';
import { AxiosError } from '@/api/axiosNest';
import { OrganizationNameSection } from '../OrganizationNameSection/OrganizationNameSection';

type CreatorPersonalDataProps = {
  email: string;
};

type EditableFieldProps = {
  label: string;
  hint?: string;
  currentValue: string;
  isDataLoading: boolean;
  multiline?: boolean;
  fieldKey: 'description' | 'domain';
};

const EditableFieldSection = ({
  label,
  hint,
  currentValue,
  isDataLoading,
  multiline,
  fieldKey,
}: EditableFieldProps) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(currentValue);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(currentValue);
  }, [currentValue]);

  const { mutateAsync, isLoading } = useUpdateUserProfile({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.getUser]);
      setSuccess(true);
      setError(null);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await mutateAsync({ [fieldKey]: value.trim() });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr?.response?.data?.message ??
          'Failed to save. Please try again.',
      );
      setSuccess(false);
    }
  };

  const isDirty = value.trim() !== currentValue.trim();

  if (isDataLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
        {hint && <div className="h-3 w-64 animate-pulse rounded bg-gray-200" />}
        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {hint && <p className="mt-1 text-sm text-gray-600">{hint}</p>}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <div className="flex items-start gap-2">
          {multiline ? (
            <Textarea
              className="flex-1"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSuccess(false);
              }}
              disabled={isLoading}
              rows={3}
            />
          ) : (
            <TextInput
              className="flex-1"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSuccess(false);
              }}
              disabled={isLoading}
            />
          )}
          <Button
            type="submit"
            color="primary"
            isProcessing={isLoading}
            disabled={isLoading || !isDirty}
          >
            Save
          </Button>
        </div>
        {error && (
          <Alert color="failure">
            <p className="text-sm">{error}</p>
          </Alert>
        )}
        {success && (
          <Alert color="success">
            <p className="text-sm">Saved successfully.</p>
          </Alert>
        )}
      </form>
    </div>
  );
};

export const CreatorPersonalData = ({}: CreatorPersonalDataProps) => {
  const { t } = useTranslation('creator-profile');
  const { data: user, isLoading } = useGetUser();

  return (
    <article className="flex flex-col gap-6">
      <h2 className="text-xl">{t('personal-data.title')}</h2>
      <div className="flex max-w-[40rem] flex-col gap-6">
        <OrganizationNameSection
          currentValue={user?.organizationName ?? null}
          isLoading={isLoading}
        />
        <EditableFieldSection
          label="Description"
          hint="A short description of you or your organisation."
          currentValue={user?.description ?? ''}
          isDataLoading={isLoading}
          multiline
          fieldKey="description"
        />
        <EditableFieldSection
          label="Domain"
          hint="Your website domain (e.g. example.com)."
          currentValue={user?.domain ?? ''}
          isDataLoading={isLoading}
          fieldKey="domain"
        />
      </div>
    </article>
  );
};
