import { Button } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useInitiateKeypairChallenge } from '@/api/mutations/useInitiateKeypairChallenge';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';
import { CopyCommandBlock } from '../CopyCommandBlock';

export const KeypairVerificationGenerateCard = () => {
  const queryClient = useQueryClient();
  const { currentStep, setCurrentStep, setCommands } =
    useKeypairVerificationContext();

  const { mutateAsync, isLoading } = useInitiateKeypairChallenge({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.keypairChallengeStatus]);
    },
  });

  const handleInitiate = async () => {
    const result = await mutateAsync();
    setCommands(result.commands);
    setCurrentStep('submit-key');
  };

  const generationCommands = [
    'openssl ecparam -name prime256v1 -genkey -noout -out cc_private_key.pem',
    'openssl ec -in cc_private_key.pem -pubout -out cc_public_key.pem',
    'cat cc_public_key.pem | pbcopy',
  ];

  return (
    <CardWithTitle
      title="Step 1: Generate Your Keypair"
      description="Run these commands in your terminal to generate an EC P-256 keypair."
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Use the following OpenSSL commands to generate your private and public
          key files locally. Your private key never leaves your machine.
        </p>
        <div className="flex flex-col gap-2">
          {generationCommands.map((cmd) => (
            <CopyCommandBlock
              key={cmd}
              command={cmd}
            />
          ))}
        </div>
        {currentStep === 'generate' && (
          <Button
            color="primary"
            className="self-start"
            onClick={handleInitiate}
            isProcessing={isLoading}
            disabled={isLoading}
          >
            I have generated my keypair - Continue
          </Button>
        )}
      </div>
    </CardWithTitle>
  );
};
