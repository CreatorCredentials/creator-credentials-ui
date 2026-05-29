import { Alert, Button, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from '@/api/axiosNest';
import { QueryKeys } from '@/api/queryKeys';
import { useSetOrganizationName } from '@/api/mutations/useSetOrganizationName';

type Props = {
  currentValue: string | null;
};

export const OrganizationNameSection = ({ currentValue }: Props) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { mutateAsync, isLoading } = useSetOrganizationName({
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
      setSuccess(false);
    }
  };

  const isSet = currentValue !== null && currentValue !== undefined;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">Organization name</p>
        <p className="mt-1 text-sm text-gray-600">
          Used as the <code className="rounded bg-gray-100 px-1">sameAs</code>{' '}
          field in your Data Supplier verifiable credential.
        </p>
      </div>

      {isSet ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <span className="flex-1 text-sm font-medium text-gray-800">
              {currentValue}
            </span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Set
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Organization name is locked and cannot be changed. To update it,
            please contact{' '}
            <a
              href="mailto:info@liccium.com"
              className="font-medium text-blue-600 underline"
            >
              info@liccium.com
            </a>
            .
          </p>
        </div>
      ) : (
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
              Save
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Once saved, this value cannot be changed. To update it, contact{' '}
            <a
              href="mailto:info@liccium.com"
              className="font-medium text-blue-600 underline"
            >
              info@liccium.com
            </a>
            .
          </p>
          {error && (
            <Alert color="failure">
              <p className="text-sm">{error}</p>
            </Alert>
          )}
          {success && (
            <Alert color="success">
              <p className="text-sm">Organization name saved successfully.</p>
            </Alert>
          )}
        </form>
      )}
    </div>
  );
};
