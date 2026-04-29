import React from 'react';
import { Alert, Button, Textarea } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useToast } from '@/shared/hooks/useToast';
import { QueryKeys } from '@/api/queryKeys';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { useAcceptCredentialsIssuanceRequest } from '@/api/mutations/useAcceptCredentialsIssuanceRequest';
import { useRejectCredentialsIssuanceRequest } from '@/api/mutations/useRejectCredentialsIssuanceRequest';
import { useVerifyAcceptedCredentialSignature } from '@/api/mutations/useVerifyAcceptedCredentialSignature';
import { CopyCommandBlock } from '@/components/modules/verification/keypair/CopyCommandBlock';
import { CardWithTitle } from '@/components/shared/CardWithTitle';

type CredentialsCardAcceptRejectFooterProps = {
  credential: VerifiedCredentialsUnion;
  onSuccessfullAcceptation?: () => void | Promise<void>;
  onSuccessfulRejection?: () => void | Promise<void>;
};

export const CredentialsCardAcceptRejectFooter = ({
  credential,
  onSuccessfullAcceptation,
  onSuccessfulRejection,
}: CredentialsCardAcceptRejectFooterProps) => {
  const { t } = useTranslation('issuer-creators');
  const toast = useToast();
  const queryClient = useQueryClient();

  const [acceptStep, setAcceptStep] = React.useState<
    'idle' | 'signature' | 'completed'
  >('idle');
  const [isAcceptModalOpen, setIsAcceptModalOpen] = React.useState(false);
  const [commands, setCommands] = React.useState<string[]>([]);
  const [signingInput, setSigningInput] = React.useState('');
  const [privateKeyFilename, setPrivateKeyFilename] =
    React.useState('your_private_key.pem');
  const [signature, setSignature] = React.useState('');
  const [verificationError, setVerificationError] = React.useState<string | null>(
    null,
  );

  const { mutateAsync: acceptAsync, isLoading: isAccepting } =
    useAcceptCredentialsIssuanceRequest({
      onSuccess: () => {
        queryClient.invalidateQueries([
          QueryKeys.issuersCredentials,
          { status: CreatorVerificationStatus.Pending },
        ]);
      },
    });

  const { mutateAsync: rejectAsync, isLoading: isRejecting } =
    useRejectCredentialsIssuanceRequest({
      onSuccess: () => {
        queryClient.invalidateQueries([
          QueryKeys.issuersCredentials,
          { status: CredentialVerificationStatus.Pending },
        ]);
      },
    });
  const { mutateAsync: verifyAcceptSignatureAsync, isLoading: isVerifyingAccept } =
    useVerifyAcceptedCredentialSignature({
      onSuccess: () => {
        queryClient.invalidateQueries([
          QueryKeys.issuersCredentials,
          { status: CredentialVerificationStatus.Pending },
        ]);
      },
    });

  const acceptButtonHandler = async () => {
    try {
      const acceptance = await acceptAsync({ credentialId: credential.id });
      setCommands(acceptance?.commands ?? []);
      setSigningInput(acceptance?.challenge?.signingInput ?? '');
      setAcceptStep('signature');
      setIsAcceptModalOpen(true);
      setVerificationError(null);
    } catch (error) {
      toast.error(t('requests.errors.accept-failed'));
    }
  };

  const verifySignatureButtonHandler = async () => {
    if (!signature.trim()) return;
    try {
      setVerificationError(null);
      await verifyAcceptSignatureAsync({
        credentialId: credential.id,
        signature: signature.trim().replaceAll('\n', ''),
      });
      setAcceptStep('completed');
      await onSuccessfullAcceptation?.();
    } catch (error) {
      setVerificationError(
        'Signature verification failed. Ensure you signed with the private key matching your imported issuer certificate.',
      );
    }
  };

  const rejectButtonHandler = async () => {
    try {
      await rejectAsync({ credentialId: credential.id });
      await onSuccessfulRejection?.();
    } catch (error) {
      toast.error(t('requests.errors.reject-failed'));
    }
  };

  const disableButtons = isAccepting || isRejecting || isVerifyingAccept;
  const commandTemplate = commands[0] ?? '';
  const commandWithFile = commandTemplate.replace(
    /your_private_key\.pem/g,
    privateKeyFilename.trim() || 'your_private_key.pem',
  );

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Button
          color="primary"
          disabled={disableButtons}
          isProcessing={isAccepting || isVerifyingAccept}
          onClick={acceptButtonHandler}
        >
          {t('accept', { ns: 'common' })}
        </Button>
        <Button
          color="outline"
          disabled={disableButtons}
          isProcessing={isRejecting}
          onClick={rejectButtonHandler}
        >
          {t('reject', { ns: 'common' })}
        </Button>
      </div>

      {isAcceptModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
            <CardWithTitle
              title="Credential Acceptance Verification"
              description="Sign the payload with the private key matching your imported issuer certificate, then submit signature for verification."
              className="border-0 shadow-none"
            >
              <div className="flex flex-col gap-4">
                {!!signingInput && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700">
                      Signing input (JWS header.payload)
                    </p>
                    <CopyCommandBlock command={signingInput} />
                  </div>
                )}

                {commands.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700">
                      Step 1: Run command to generate base64 signature
                    </p>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`issuer-private-key-file-${credential.id}`}
                        className="text-sm text-gray-600"
                      >
                        Private key filename/path
                      </label>
                      <input
                        id={`issuer-private-key-file-${credential.id}`}
                        type="text"
                        value={privateKeyFilename}
                        onChange={(e) => setPrivateKeyFilename(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
                        placeholder="your_private_key.pem"
                        disabled={acceptStep === 'completed'}
                      />
                    </div>
                    <CopyCommandBlock command={commandWithFile} />
                    <p className="text-xs text-gray-500">
                      Tip: RSA signatures are usually long (300+ chars in base64),
                      while ECDSA signatures are shorter.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    Step 2: Paste base64 signature
                  </p>
                  <Textarea
                    rows={5}
                    placeholder="Paste signature here..."
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    disabled={acceptStep === 'completed'}
                    className="font-mono text-sm"
                  />
                </div>

                {verificationError && (
                  <Alert color="failure">
                    <p>{verificationError}</p>
                  </Alert>
                )}

                {acceptStep === 'completed' ? (
                  <Alert color="success">
                    <p className="font-medium">
                      Credential request accepted and signature verified.
                    </p>
                  </Alert>
                ) : null}

                <div className="flex gap-3">
                  {acceptStep !== 'completed' && (
                    <Button
                      color="primary"
                      onClick={verifySignatureButtonHandler}
                      isProcessing={isVerifyingAccept}
                      disabled={isVerifyingAccept || !signature.trim()}
                    >
                      Verify Signature & Accept
                    </Button>
                  )}
                  <Button
                    color={acceptStep === 'completed' ? 'primary' : 'light'}
                    onClick={() => {
                      setIsAcceptModalOpen(false);
                      setAcceptStep('idle');
                      setCommands([]);
                      setSigningInput('');
                      setSignature('');
                      setVerificationError(null);
                    }}
                    disabled={isVerifyingAccept}
                  >
                    {acceptStep === 'completed' ? 'Done' : 'Cancel'}
                  </Button>
                </div>
              </div>
            </CardWithTitle>
          </div>
        </div>
      )}
    </>
  );
};
