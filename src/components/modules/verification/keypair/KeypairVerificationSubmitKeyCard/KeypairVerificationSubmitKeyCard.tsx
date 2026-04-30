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
      title="Step 2: Send us your public key"
      description="Paste cc_public_key.pem below. Once submitted you'll get a one-time challenge to sign in Step 3."
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          <p className="font-semibold">
            How to get the file contents into the box
          </p>
          <ul className="mt-2 list-disc ps-5">
            <li>
              macOS: run{' '}
              <code className="rounded bg-white px-1">
                cat cc_public_key.pem | pbcopy
              </code>{' '}
              and paste below.
            </li>
            <li>
              Or run{' '}
              <code className="rounded bg-white px-1">
                cat cc_public_key.pem
              </code>{' '}
              and copy the printed block manually.
            </li>
            <li>Or open the file in any text editor and copy its contents.</li>
          </ul>
          <p className="mt-2">
            Include the BEGIN PUBLIC KEY and END PUBLIC KEY delimiter lines -
            leaving them out is the most common cause of a rejected submission.
          </p>
        </div>
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
              Sign the challenge with your private key
            </p>
            <p className="text-sm text-gray-500">
              The command signs the one-time challenge with{' '}
              <code className="rounded bg-gray-100 px-1">
                cc_private_key.pem
              </code>{' '}
              and prints the resulting base64 signature (on macOS it also copies
              it to your clipboard). If your private key file has a different
              name or path, swap it into the command before running.
            </p>
            {commands.map((cmd) => (
              <CopyCommandBlock
                key={cmd}
                command={cmd}
              />
            ))}
            <ul className="list-disc ps-5 text-sm text-gray-500">
              <li>
                Paste the printed signature into the box in Step 3 - a single
                base64 string.
              </li>
              <li>
                Re-running the command produces a different valid signature
                (normal for ECDSA).
              </li>
              <li>
                On Windows or Linux, copy the printed signature manually if
                pbcopy isn&apos;t available.
              </li>
            </ul>
          </div>
        )}
      </div>
    </CardWithTitle>
  );
};
