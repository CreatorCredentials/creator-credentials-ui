import { Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useInitiateCertChallenge } from '@/api/mutations/useInitiateCertChallenge';
import { useSubmitCertPem } from '@/api/mutations/useSubmitCertPem';
import { CopyCommandBlock } from '@/components/modules/verification/keypair/CopyCommandBlock';
import { useCertVerificationContext } from '../CertVerificationContext';

export const CertVerificationSubmitCertCard = () => {
  const queryClient = useQueryClient();
  const { currentStep, commands, setCurrentStep, setCommands } =
    useCertVerificationContext();

  const [certPem, setCertPem] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries([QueryKeys.certChallengeStatus]);
  };

  const { mutateAsync: initiate, isLoading: isInitiating } =
    useInitiateCertChallenge({ onSuccess: invalidate });

  const { mutateAsync: submitCert, isLoading: isSubmitting } = useSubmitCertPem(
    { onSuccess: invalidate },
  );

  const handleSubmit = async () => {
    if (!certPem.trim()) return;
    await initiate();
    const result = await submitCert(certPem.trim());
    setCommands(result.commands);
    setCurrentStep('verify-signature');
  };

  const isDisabled =
    currentStep === 'verify-signature' || currentStep === 'completed';
  const isLoading = isInitiating || isSubmitting;

  return (
    <CardWithTitle
      title="Step 1: Submit Your X.509 Certificate"
      description="Paste your certificate PEM content below."
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Paste the contents of your{' '}
          <code className="rounded bg-gray-100 px-1">cert.pem</code> file. The
          certificate must be valid (not expired) and use a supported algorithm.
          You can view it with:
        </p>
        <CopyCommandBlock command="cat cert.pem | pbcopy" />
        <Textarea
          rows={8}
          placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
          value={certPem}
          onChange={(e) => setCertPem(e.target.value)}
          disabled={isDisabled}
          className="font-mono text-sm"
        />
        {!isDisabled && (
          <Button
            color="primary"
            className="self-start"
            onClick={handleSubmit}
            isProcessing={isLoading}
            disabled={isLoading || !certPem.trim()}
          >
            Submit Certificate
          </Button>
        )}
        {isDisabled && commands.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Sign the challenge with the private key for this certificate:
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
              Replace{' '}
              <code className="rounded bg-gray-100 px-1">
                your_private_key.pem
              </code>{' '}
              with the path to your private key file.
            </p>
          </div>
        )}
      </div>
    </CardWithTitle>
  );
};
