import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { Icon } from '@/components/shared/Icon';
import { QueryKeys } from '@/api/queryKeys';
import { useVerifyCertSignature } from '@/api/mutations/useVerifyCertSignature';
import { useResetCertChallenge } from '@/api/mutations/useResetCertChallenge';
import { useCertVerificationContext } from '../CertVerificationContext';

export const CertVerificationVerifyCard = () => {
  const queryClient = useQueryClient();
  const {
    currentStep,
    externalCertPem,
    setCurrentStep,
    acknowledgeCompletion,
  } = useCertVerificationContext();

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
      <CardWithTitle title="Step 2: Certificate verified">
        <div className="flex flex-col gap-3">
          <Alert color="success">
            <p className="font-medium">
              Your X.509 certificate has been verified and registered.
            </p>
            <p className="text-sm">
              From now on, every credential you accept on the &quot;Creator
              requests&quot; page will be signed with this certificate. Click
              Continue when you&apos;re ready to switch to the
              certificate-management view.
            </p>
          </Alert>
          {externalCertPem && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
              <p className="font-medium">Registered certificate</p>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-2 font-mono text-[11px] leading-relaxed">
                {externalCertPem}
              </pre>
            </div>
          )}
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <p className="font-semibold">Next</p>
            <p className="mt-1">
              Continue takes you to the certificate-management view, where you
              can review the imported certificate or remove it if you imported
              the wrong one.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              color="primary"
              onClick={acknowledgeCompletion}
            >
              Continue
              <Icon
                icon="ArrowRight"
                className="ms-2"
              />
            </Button>
          </div>
        </div>
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
