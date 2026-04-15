import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useVerifyKeypairSignature } from '@/api/mutations/useVerifyKeypairSignature';
import { useResetKeypairChallenge } from '@/api/mutations/useResetKeypairChallenge';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';

export const KeypairVerificationVerifyCard = () => {
  const queryClient = useQueryClient();
  const { currentStep, derivedDidKey, setCurrentStep } =
    useKeypairVerificationContext();

  const [signature, setSignature] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutateAsync: verifySignature, isLoading: isVerifying } =
    useVerifyKeypairSignature({
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.keypairChallengeStatus]);
        queryClient.invalidateQueries([QueryKeys.getUser]);
      },
    });

  const { mutateAsync: resetChallenge, isLoading: isResetting } =
    useResetKeypairChallenge({
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.keypairChallengeStatus]);
      },
    });

  const handleVerify = async () => {
    if (!signature.trim()) return;
    setErrorMsg(null);
    const result = await verifySignature(signature.trim());
    if (result.verified) {
      setCurrentStep('completed');
    } else {
      setErrorMsg(result.error ?? 'Signature verification failed');
    }
  };

  const handleReset = async () => {
    await resetChallenge();
    setSignature('');
    setErrorMsg(null);
    setCurrentStep('generate');
  };

  if (currentStep === 'completed') {
    return (
      <CardWithTitle title="Step 3: Signature Verified">
        <div className="flex flex-col gap-3">
          <Alert color="success">
            <p className="font-medium">Your keypair has been verified!</p>
          </Alert>
          {derivedDidKey && (
            <div>
              <p className="mb-1 text-sm font-medium text-gray-700">
                Your external DID:key
              </p>
              <code className="block break-all rounded bg-gray-100 p-2 text-xs">
                {derivedDidKey}
              </code>
            </div>
          )}
        </div>
      </CardWithTitle>
    );
  }

  return (
    <CardWithTitle
      title="Step 3: Verify Signature"
      description="Paste the base64-encoded signature output from the signing command."
    >
      <div className="flex flex-col gap-4">
        {errorMsg && (
          <Alert color="failure">
            <p>{errorMsg}</p>
          </Alert>
        )}
        <Textarea
          rows={4}
          placeholder="Paste base64 signature here..."
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="font-mono text-sm"
        />
        <div className="flex gap-3">
          <Button
            color="primary"
            onClick={handleVerify}
            isProcessing={isVerifying}
            disabled={isVerifying || !signature.trim()}
          >
            Verify Signature
          </Button>
          <Button
            color="light"
            onClick={handleReset}
            isProcessing={isResetting}
            disabled={isResetting}
          >
            Start Over
          </Button>
        </div>
      </div>
    </CardWithTitle>
  );
};
