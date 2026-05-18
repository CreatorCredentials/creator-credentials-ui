import { Alert, Button } from 'flowbite-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getDidKeyPem } from '@/api/requests/getDidKeyPem';

type Props = {
  did: string;
  onClose: () => void;
};

export const DidKeyPemModal = ({ did, onClose }: Props) => {
  const { getToken } = useAuth();
  // Keep getToken in a ref so the effect closure always has the latest version
  // without listing it as a reactive dependency (it is stable but not guaranteed
  // to be ref-equal across renders in all Clerk versions).
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  });

  const [pem, setPem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getTokenRef
      .current()
      .then((token) => {
        if (!token) throw new Error('Unauthorised');
        return getDidKeyPem(token, did);
      })
      .then((res) => {
        if (!cancelled) setPem(res.data.publicKeyPem);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? null;
          setError(msg ?? 'Failed to reconstruct public key PEM from did:key.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [did]);

  const handleCopy = useCallback(() => {
    if (!pem) return;
    navigator.clipboard.writeText(pem).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [pem]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="did-pem-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
            <code className="mt-2 block break-all text-xs text-gray-400">
              {did}
            </code>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <p className="text-sm text-gray-500">Reconstructing PEM…</p>
        )}

        {error && (
          <Alert color="failure">
            <p className="text-sm">{error}</p>
          </Alert>
        )}

        {pem && (
          <>
            <pre className="max-h-56 overflow-auto rounded bg-gray-50 p-3 font-mono text-xs text-gray-800">
              {pem}
            </pre>
            <Button
              color="light"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy PEM'}
            </Button>
          </>
        )}

        <Button
          color="primary"
          size="sm"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};
