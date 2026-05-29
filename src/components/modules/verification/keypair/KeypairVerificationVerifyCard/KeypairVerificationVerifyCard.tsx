import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useVerifyKeypairSignature } from '@/api/mutations/useVerifyKeypairSignature';
import { useResetKeypairChallenge } from '@/api/mutations/useResetKeypairChallenge';
import { DidKeyPemModal } from '@/components/shared/DidKeyPemModal/DidKeyPemModal';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';

export const KeypairVerificationVerifyCard = () => {
  const queryClient = useQueryClient();
  const { currentStep, derivedDidKey, setCurrentStep } =
    useKeypairVerificationContext();

  const [signature, setSignature] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPemModalOpen, setIsPemModalOpen] = useState(false);

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
      <>
        <CardWithTitle title="Step 3: Signature verified">
          <div className="flex flex-col gap-3">
            <Alert color="success">
              <p className="font-medium">
                Your keypair has been verified for this credential request.
              </p>
              <p className="text-sm">
                Your signature matched the public key and the one-time
                challenge. The corresponding did:key will be bound to your
                request – click Continue at the bottom of the page when
                you&apos;re ready to submit.
              </p>
            </Alert>
            {derivedDidKey && (
              <div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  did:key derived from your public key
                </p>
                <code className="block break-all rounded bg-gray-100 p-2 text-xs">
                  {derivedDidKey}
                </code>
                <p className="mt-1 text-xs text-gray-500">
                  Anyone inspecting the credential later can re-derive this
                  identifier from your public key and confirm only you hold the
                  matching private key.
                </p>
                <Button
                  color="light"
                  size="xs"
                  className="mt-2"
                  onClick={() => setIsPemModalOpen(true)}
                >
                  Check public key PEM
                </Button>
              </div>
            )}
          </div>
        </CardWithTitle>

        {isPemModalOpen && derivedDidKey && (
          <DidKeyPemModal
            did={derivedDidKey}
            onClose={() => setIsPemModalOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <CardWithTitle
      title="Step 3: Send us the signature"
      description="Paste the base64 signature printed by the signing command from Step 2. We verify it server-side, which proves you control the private key without sharing it."
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          <p className="font-semibold">What to paste</p>
          <ul className="mt-2 list-disc ps-5">
            <li>
              A single base64 string. No quotation marks, no
              &quot;Signature:&quot; prefix, no JSON wrapper.
            </li>
            <li>
              Multi-line output is fine (whitespace is stripped). Skip unrelated
              lines like &quot;Signature length: 88&quot;.
            </li>
            <li>
              On a verification error, rerun the signing command and paste again
              – ECDSA produces a fresh valid signature each time.
            </li>
          </ul>
        </div>
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
