import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useVerifyCertSignature } from '@/api/mutations/useVerifyCertSignature';
import { useResetCertChallenge } from '@/api/mutations/useResetCertChallenge';
import { useCertVerificationContext } from '../CertVerificationContext';

export const CertVerificationVerifyCard = () => {
  const queryClient = useQueryClient();
  const { currentStep, setCurrentStep } = useCertVerificationContext();

  const [signature, setSignature] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutateAsync: verifySignature, isLoading: isVerifying } =
    useVerifyCertSignature({
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.certChallengeStatus]);
        queryClient.invalidateQueries([QueryKeys.getUser]);
      },
    });

  const { mutateAsync: resetChallenge, isLoading: isResetting } =
    useResetCertChallenge({
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.certChallengeStatus]);
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
    setCurrentStep('submit-cert');
  };

  if (currentStep === 'completed') {
    return (
      <CardWithTitle title="Step 2: Certificate Verified">
        <Alert color="success">
          <p className="font-medium">
            Your X.509 certificate has been verified and registered!
          </p>
        </Alert>
      </CardWithTitle>
    );
  }

  return (
    <CardWithTitle
      title="Step 2: Verify Signature"
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
