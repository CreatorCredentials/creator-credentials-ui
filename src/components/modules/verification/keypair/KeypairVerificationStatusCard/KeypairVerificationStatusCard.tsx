import { Alert, Badge, Button } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useRemoveExternalDidKey } from '@/api/mutations/useRemoveExternalDidKey';
import { useUpdateActiveDidKeySource } from '@/api/mutations/useUpdateActiveDidKeySource';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';

export const KeypairVerificationStatusCard = () => {
  const queryClient = useQueryClient();
  const { externalDidKey, activeDidKeySource } =
    useKeypairVerificationContext();

  const invalidateAll = () => {
    queryClient.invalidateQueries([QueryKeys.keypairChallengeStatus]);
    queryClient.invalidateQueries([QueryKeys.getUser]);
  };

  const { mutateAsync: removeKey, isLoading: isRemoving } =
    useRemoveExternalDidKey({ onSuccess: invalidateAll });

  const { mutateAsync: updateSource, isLoading: isUpdatingSource } =
    useUpdateActiveDidKeySource({ onSuccess: invalidateAll });

  const handleRemove = async () => {
    if (!window.confirm('Remove your external DID key? This cannot be undone.'))
      return;
    await removeKey();
  };

  const handleToggleSource = async () => {
    const newSource =
      activeDidKeySource === 'platform' ? 'external' : 'platform';
    await updateSource(newSource);
  };

  return (
    <CardWithTitle title="Your External DID Key">
      <div className="flex flex-col gap-4">
        <Alert color="success">
          <p className="font-medium">
            External keypair registered and verified.
          </p>
        </Alert>

        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">
            External DID:key
          </p>
          <code className="block break-all rounded bg-gray-100 p-2 text-xs">
            {externalDidKey}
          </code>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-700">
            Active DID source:
          </p>
          <Badge color={activeDidKeySource === 'external' ? 'success' : 'info'}>
            {activeDidKeySource === 'external'
              ? 'External (yours)'
              : 'Platform'}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            color="primary"
            onClick={handleToggleSource}
            isProcessing={isUpdatingSource}
            disabled={isUpdatingSource || isRemoving}
          >
            {activeDidKeySource === 'external'
              ? 'Switch to Platform DID'
              : 'Use External DID for Credentials'}
          </Button>
          <Button
            color="failure"
            onClick={handleRemove}
            isProcessing={isRemoving}
            disabled={isRemoving || isUpdatingSource}
          >
            Remove External Key
          </Button>
        </div>
      </div>
    </CardWithTitle>
  );
};
