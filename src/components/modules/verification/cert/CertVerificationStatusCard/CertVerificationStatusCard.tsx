import { Alert, Button } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useRemoveExternalCert } from '@/api/mutations/useRemoveExternalCert';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { useCertVerificationContext } from '../CertVerificationContext';

export const CertVerificationStatusCard = () => {
  const queryClient = useQueryClient();
  const { externalCertPem } = useCertVerificationContext();
  const { copy } = useCopyToClipboard();

  const invalidateAll = () => {
    queryClient.invalidateQueries([QueryKeys.certChallengeStatus]);
    queryClient.invalidateQueries([QueryKeys.getUser]);
  };

  const { mutateAsync: removeCert, isLoading: isRemoving } =
    useRemoveExternalCert({ onSuccess: invalidateAll });

  const handleRemove = async () => {
    if (
      !window.confirm(
        'Remove your external X.509 certificate? X.509 Cert-Signed Credentials will revert to the platform certificate.',
      )
    )
      return;
    await removeCert();
  };

  return (
    <CardWithTitle title="Your External X.509 Certificate">
      <div className="flex flex-col gap-4">
        <Alert color="success">
          <p className="font-medium">
            External certificate registered and verified. It will be used
            automatically when issuing X.509 Cert-Signed Credentials.
          </p>
        </Alert>

        {externalCertPem && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Certificate PEM
              </p>
              <Button
                size="xs"
                color="light"
                onClick={() => copy(externalCertPem)}
              >
                Copy
              </Button>
            </div>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-gray-100 p-3 text-xs leading-relaxed">
              {externalCertPem}
            </pre>
          </div>
        )}

        <div>
          <Button
            color="failure"
            onClick={handleRemove}
            isProcessing={isRemoving}
            disabled={isRemoving}
          >
            Remove External Certificate
          </Button>
        </div>
      </div>
    </CardWithTitle>
  );
};
