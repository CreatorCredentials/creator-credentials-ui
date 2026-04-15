import { Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useSubmitKeypairPublicKey } from '@/api/mutations/useSubmitKeypairPublicKey';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';
import { CopyCommandBlock } from '../CopyCommandBlock';

export const KeypairVerificationSubmitKeyCard = () => {
  const queryClient = useQueryClient();
  const {
    currentStep,
    commands,
    setCurrentStep,
    setCommands,
    setChallengeMessage,
    setDerivedDidKey,
  } = useKeypairVerificationContext();

  const [publicKeyPem, setPublicKeyPem] = useState('');

  const { mutateAsync, isLoading } = useSubmitKeypairPublicKey({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.keypairChallengeStatus]);
    },
  });

  const handleSubmit = async () => {
    if (!publicKeyPem.trim()) return;
    const result = await mutateAsync(publicKeyPem.trim());
    setCommands(result.commands);
    if (result.challenge.challengeMessage) {
      setChallengeMessage(result.challenge.challengeMessage);
    }
    if (result.challenge.derivedDidKey) {
      setDerivedDidKey(result.challenge.derivedDidKey);
    }
    setCurrentStep('verify-signature');
  };

  const isDisabled =
    currentStep === 'verify-signature' || currentStep === 'completed';

  return (
    <CardWithTitle
      title="Step 2: Submit Your Public Key"
      description="Paste your public key PEM content below."
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Run{' '}
          <code className="rounded bg-gray-100 px-1">
            cat cc_public_key.pem
          </code>{' '}
          and paste the output below, or use{' '}
          <code className="rounded bg-gray-100 px-1">
            cat cc_public_key.pem | pbcopy
          </code>{' '}
          to copy it to your clipboard.
        </p>
        <Textarea
          rows={6}
          placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
          value={publicKeyPem}
          onChange={(e) => setPublicKeyPem(e.target.value)}
          disabled={isDisabled}
          className="font-mono text-sm"
        />
        {!isDisabled && (
          <Button
            color="primary"
            className="self-start"
            onClick={handleSubmit}
            isProcessing={isLoading}
            disabled={isLoading || !publicKeyPem.trim()}
          >
            Submit Public Key
          </Button>
        )}
        {isDisabled && commands.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Sign the challenge with your private key:
            </p>
            <p className="text-sm text-gray-500">
              This command signs once, prints the signature to your terminal,
              and copies it to your clipboard automatically.
            </p>
            {commands.map((cmd) => (
              <CopyCommandBlock
                key={cmd}
                command={cmd}
              />
            ))}
            <p className="text-sm text-gray-500">
              After running it, paste the printed signature into Step 3 below.
            </p>
          </div>
        )}
      </div>
    </CardWithTitle>
  );
};
