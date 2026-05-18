import { Alert, Button, Textarea } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useVerifyKeypairSignature } from '@/api/mutations/useVerifyKeypairSignature';
import { useResetKeypairChallenge } from '@/api/mutations/useResetKeypairChallenge';
import { getDidKeyPem } from '@/api/requests/getDidKeyPem';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';

export const KeypairVerificationVerifyCard = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const { currentStep, derivedDidKey, setCurrentStep } =
    useKeypairVerificationContext();

  const [signature, setSignature] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPem, setModalPem] = useState<string | null>(null);
  const [isPemLoading, setIsPemLoading] = useState(false);
  const [pemError, setPemError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleVerifyDid = useCallback(async () => {
    if (!derivedDidKey) return;
    setIsModalOpen(true);
    setModalPem(null);
    setPemError(null);
    setCopied(false);
    setIsPemLoading(true);
    try {
      const token = await auth.getToken();
      if (!token) throw new Error('Unauthorised');
      const res = await getDidKeyPem(token, derivedDidKey);
      setModalPem(res.data.publicKeyPem);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? null;
      setPemError(msg ?? 'Failed to reconstruct public key PEM from did:key.');
    } finally {
      setIsPemLoading(false);
    }
  }, [derivedDidKey, auth]);

  const handleCopyPem = useCallback(() => {
    if (!modalPem) return;
    navigator.clipboard.writeText(modalPem).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [modalPem]);

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
                  onClick={handleVerifyDid}
                >
                  Check public key PEM
                </Button>
              </div>
            )}
          </div>
        </CardWithTitle>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="did-pem-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    id="did-pem-modal-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Public key PEM reconstructed from did:key
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Compare this with the contents of your{' '}
                    <code className="rounded bg-gray-100 px-1">
                      cc_public_key.pem
                    </code>{' '}
                    file. They must match exactly.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {isPemLoading && (
                <p className="text-sm text-gray-500">Reconstructing PEM…</p>
              )}

              {pemError && (
                <Alert color="failure">
                  <p className="text-sm">{pemError}</p>
                </Alert>
              )}

              {modalPem && (
                <>
                  <pre className="max-h-56 overflow-auto rounded bg-gray-50 p-3 font-mono text-xs text-gray-800">
                    {modalPem}
                  </pre>
                  <Button
                    color="light"
                    size="sm"
                    onClick={handleCopyPem}
                  >
                    {copied ? 'Copied!' : 'Copy PEM'}
                  </Button>
                </>
              )}

              <Button
                color="primary"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
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
