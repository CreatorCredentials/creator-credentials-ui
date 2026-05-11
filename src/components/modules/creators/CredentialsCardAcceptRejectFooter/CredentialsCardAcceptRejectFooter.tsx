import React from 'react';
import { Alert, Badge, Button, Textarea } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useToast } from '@/shared/hooks/useToast';
import { QueryKeys } from '@/api/queryKeys';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { Creator } from '@/shared/typings/Creator';
import { useAcceptCredentialsIssuanceRequest } from '@/api/mutations/useAcceptCredentialsIssuanceRequest';
import { useRejectCredentialsIssuanceRequest } from '@/api/mutations/useRejectCredentialsIssuanceRequest';
import { useVerifyAcceptedCredentialSignature } from '@/api/mutations/useVerifyAcceptedCredentialSignature';
import { CopyCommandBlock } from '@/components/modules/verification/keypair/CopyCommandBlock';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { SupportingCredential } from '@/api/requests/acceptCredentialsIssuanceRequest';
import { downloadJson } from '@/shared/utils/downloadJson';

type CredentialObjectPreview = {
  id?: string;
  type?: string[] | string;
  issuer?: string;
  validFrom?: string;
  validUntil?: string;
  credentialSubject?: {
    id?: string;
    memberOf?: string;
    dataSupplierFor?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type CredentialsCardAcceptRejectFooterProps = {
  credential: VerifiedCredentialsUnion;
  creator?: Creator;
  onSuccessfullAcceptation?: () => void | Promise<void>;
  onSuccessfulRejection?: () => void | Promise<void>;
};

export const CredentialsCardAcceptRejectFooter = ({
  credential,
  creator,
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
  const [credentialObject, setCredentialObject] =
    React.useState<CredentialObjectPreview | null>(null);
  const [supportingCredential, setSupportingCredential] =
    React.useState<SupportingCredential | null>(null);
  const [privateKeyFilename, setPrivateKeyFilename] = React.useState(
    'your_private_key.pem',
  );
  const [showRawPayload, setShowRawPayload] = React.useState(false);
  const [signature, setSignature] = React.useState('');
  const [verificationError, setVerificationError] = React.useState<
    string | null
  >(null);
  const [missingSupportingVC, setMissingSupportingVC] = React.useState(false);

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
  const {
    mutateAsync: verifyAcceptSignatureAsync,
    isLoading: isVerifyingAccept,
  } = useVerifyAcceptedCredentialSignature({
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

      if (!acceptance?.supportingCredential) {
        setMissingSupportingVC(true);
        return;
      }

      setMissingSupportingVC(false);
      setCommands(acceptance?.commands ?? []);
      setSigningInput(acceptance?.challenge?.signingInput ?? '');
      setCredentialObject(
        (acceptance?.challenge?.credentialObject as CredentialObjectPreview) ??
          null,
      );
      setSupportingCredential(acceptance.supportingCredential);
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
        'Signature verification failed. Make sure you signed the exact payload from section 2 with the private key paired to your imported X.509 certificate, and try again.',
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

  const closeModal = () => {
    setIsAcceptModalOpen(false);
    setAcceptStep('idle');
    setCommands([]);
    setSigningInput('');
    setCredentialObject(null);
    setSupportingCredential(null);
    setSignature('');
    setVerificationError(null);
    setShowRawPayload(false);
    setMissingSupportingVC(false);
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
        {missingSupportingVC && (
          <Alert color="failure">
            <p className="text-sm font-medium">Cannot accept this credential</p>
            <p className="mt-1 text-xs">
              The supporting identity proof (keypair verification or email VC)
              for this creator could not be found. The credential cannot be
              issued without it. Please ask the creator to re-submit their
              request.
            </p>
          </Alert>
        )}
      </div>

      {isAcceptModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardWithTitle
              title="Review and sign this credential request"
              description="Below you'll see who requested the credential, the exact verifiable credential that will be minted, and the openssl command that signs it with the private key paired to your imported X.509 certificate."
              className="border-0 shadow-none"
            >
              <div className="flex flex-col gap-6">
                <CreatorReviewSection creator={creator} />

                {supportingCredential && (
                  <SupportingEvidenceSection
                    supportingCredential={supportingCredential}
                    credentialId={credential.id}
                  />
                )}

                <CredentialPreviewSection
                  credentialObject={credentialObject}
                  showRawPayload={showRawPayload}
                  toggleRawPayload={() => setShowRawPayload((v) => !v)}
                  signingInput={signingInput}
                  sectionNumber={supportingCredential ? 3 : 2}
                />

                <SigningSection
                  hasCommand={commands.length > 0}
                  commandWithFile={commandWithFile}
                  privateKeyFilename={privateKeyFilename}
                  setPrivateKeyFilename={setPrivateKeyFilename}
                  isCompleted={acceptStep === 'completed'}
                  inputId={`issuer-private-key-file-${credential.id}`}
                  sectionNumber={supportingCredential ? 4 : 3}
                />

                <PasteSignatureSection
                  signature={signature}
                  setSignature={setSignature}
                  isCompleted={acceptStep === 'completed'}
                  sectionNumber={supportingCredential ? 5 : 4}
                />

                {verificationError && (
                  <Alert color="failure">
                    <p>{verificationError}</p>
                  </Alert>
                )}

                {acceptStep === 'completed' && (
                  <Alert color="success">
                    <p className="font-medium">
                      Credential request accepted and signature verified.
                    </p>
                    <p className="text-sm">
                      The verifiable credential has been signed with your X.509
                      certificate and stored. The creator can use it from now
                      on.
                    </p>
                  </Alert>
                )}

                <div className="flex gap-3">
                  {acceptStep !== 'completed' && (
                    <Button
                      color="primary"
                      onClick={verifySignatureButtonHandler}
                      isProcessing={isVerifyingAccept}
                      disabled={isVerifyingAccept || !signature.trim()}
                    >
                      Verify Signature & Issue Credential
                    </Button>
                  )}
                  <Button
                    color={acceptStep === 'completed' ? 'primary' : 'light'}
                    onClick={closeModal}
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

type CreatorReviewSectionProps = {
  creator?: Creator;
};

const CreatorReviewSection = ({ creator }: CreatorReviewSectionProps) => {
  if (!creator) {
    return (
      <section className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-semibold">1. Who is requesting this credential?</p>
        <p>
          The matching creator profile isn&apos;t available in this view. Open
          the creator&apos;s details page from the parent card before
          continuing.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-blue-200 bg-blue-50 p-4">
      <p className="text-sm font-semibold text-blue-900">
        1. Who is requesting this credential?
      </p>
      <p className="mt-1 text-sm text-blue-800">
        Confirm these details match the person you intend to issue a credential
        to.
      </p>
      <div className="mt-3 flex items-start gap-4">
        <dl className="flex flex-1 flex-col gap-2 text-sm">
          <DetailRow
            tone="blue"
            label="Display name"
            value={creator.title}
          />
          <DetailRow
            tone="blue"
            label="Email"
            value={creator.credentials.email}
            mono
          />
          {creator.credentials.domain && (
            <DetailRow
              tone="blue"
              label="Domain"
              value={creator.credentials.domain}
              mono
            />
          )}
          {creator.credentials.walletAddress && (
            <DetailRow
              tone="blue"
              label="Wallet"
              value={creator.credentials.walletAddress}
              mono
            />
          )}
          <DetailRow
            tone="blue"
            label="Internal creator id"
            value={creator.id}
            mono
          />
        </dl>
      </div>
    </section>
  );
};

type CredentialPreviewSectionProps = {
  credentialObject: CredentialObjectPreview | null;
  showRawPayload: boolean;
  toggleRawPayload: () => void;
  signingInput: string;
  sectionNumber?: number;
};

const CredentialPreviewSection = ({
  credentialObject,
  showRawPayload,
  toggleRawPayload,
  signingInput,
  sectionNumber = 2,
}: CredentialPreviewSectionProps) => {
  const types = Array.isArray(credentialObject?.type)
    ? (credentialObject?.type as string[])
    : credentialObject?.type
      ? [credentialObject.type as string]
      : [];

  const subjectId = credentialObject?.credentialSubject?.id;
  const memberOf = credentialObject?.credentialSubject?.memberOf;
  const dataSupplierFor = credentialObject?.credentialSubject?.dataSupplierFor;

  const handleDownload = () => {
    if (credentialObject) {
      downloadJson(
        `credential-to-sign-${credentialObject.id ?? 'vc'}`,
        credentialObject,
      );
    }
  };

  const jwtIoUrl = signingInput
    ? `https://jwt.io/#token=${encodeURIComponent(signingInput)}`
    : null;

  return (
    <section className="rounded-md border border-indigo-200 bg-indigo-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-900">
            {sectionNumber}. What credential will you actually be signing?
          </p>
          <p className="mt-1 text-sm text-indigo-800">
            This is the W3C Verifiable Credential we&apos;ll store and hand to
            the creator after your signature is verified. Once signed, the
            contents below are locked in.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          {credentialObject && (
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-md border border-indigo-400 bg-white px-3 py-1.5 text-xs font-medium text-indigo-800 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Download VC
            </button>
          )}
          {jwtIoUrl && (
            <a
              href={jwtIoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-indigo-400 bg-white px-3 py-1.5 text-center text-xs font-medium text-indigo-800 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Verify on jwt.io
            </a>
          )}
        </div>
      </div>

      {credentialObject ? (
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          {types.length > 0 && (
            <DetailRow
              tone="indigo"
              label="VC Types"
              value={
                <div className="flex flex-wrap gap-1">
                  {types.map((type) => (
                    <Badge
                      key={type}
                      color="indigo"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              }
            />
          )}
          {credentialObject.id && (
            <DetailRow
              tone="indigo"
              label="Credential id"
              value={credentialObject.id}
              mono
            />
          )}
          {credentialObject.issuer && (
            <DetailRow
              tone="indigo"
              label="Issued by"
              value={credentialObject.issuer}
              mono
            />
          )}
          {subjectId && (
            <DetailRow
              tone="indigo"
              label="Issued to (subject did:key)"
              value={subjectId}
              mono
            />
          )}
          {memberOf && (
            <DetailRow
              tone="indigo"
              label="Member of"
              value={memberOf}
              mono
            />
          )}
          {dataSupplierFor && (
            <DetailRow
              tone="indigo"
              label="Data supplier for"
              value={dataSupplierFor}
              mono
            />
          )}
          {credentialObject.validFrom && (
            <DetailRow
              tone="indigo"
              label="Valid from"
              value={formatTimestamp(credentialObject.validFrom)}
            />
          )}
          {credentialObject.validUntil && (
            <DetailRow
              tone="indigo"
              label="Valid until"
              value={formatTimestamp(credentialObject.validUntil)}
            />
          )}
        </dl>
      ) : (
        <p className="mt-3 text-sm text-indigo-800">
          The server didn&apos;t return a credential payload. Cancel and retry;
          if it keeps happening, contact support.
        </p>
      )}

      {/* <button
        type="button"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-indigo-700 underline-offset-2 hover:text-indigo-900 hover:underline"
        onClick={toggleRawPayload}
      >
        <span aria-hidden="true">{showRawPayload ? '▾' : '▸'}</span>
        {showRawPayload
          ? 'Hide technical signing payload'
          : 'Show technical signing payload (advanced)'}
      </button>

      {showRawPayload && (
        <div className="mt-3 flex flex-col gap-2">
          {credentialObject && (
            <div>
              <p className="text-xs font-medium text-indigo-900">
                Full credentialObject (the JSON the issuer&apos;s certificate
                signs over):
              </p>
              <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-3 text-xs leading-relaxed text-indigo-900">
                {JSON.stringify(credentialObject, null, 2)}
              </pre>
            </div>
          )}
          {signingInput && (
            <div>
              <p className="text-xs font-medium text-indigo-900">
                Raw JWS signing input (header.payload, base64url) - what the
                openssl command digests:
              </p>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-3 text-xs leading-relaxed text-indigo-900">
                {signingInput}
              </pre>
            </div>
          )}
        </div>
      )} */}
    </section>
  );
};

type SigningSectionProps = {
  hasCommand: boolean;
  commandWithFile: string;
  privateKeyFilename: string;
  setPrivateKeyFilename: (value: string) => void;
  isCompleted: boolean;
  inputId: string;
  sectionNumber?: number;
};

const SigningSection = ({
  hasCommand,
  commandWithFile,
  privateKeyFilename,
  setPrivateKeyFilename,
  isCompleted,
  inputId,
  sectionNumber = 3,
}: SigningSectionProps) => {
  if (!hasCommand) return null;

  return (
    <section className="rounded-md border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">
        {sectionNumber}. Sign the credential with your private key
      </p>
      <p className="mt-1 text-sm text-gray-600">
        Your private key never leaves your machine. You run a single openssl
        command locally, it produces a base64 signature, and you paste that
        signature back into this dialog.
      </p>

      <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-semibold">About the private key file</p>
        <p className="mt-2">
          The filename you enter below is substituted into the openssl command
          live, so you can keep the command exactly as shown.
        </p>
        <ul className="mt-2 list-disc ps-5">
          <li>
            If the key file is in the folder you run the command from, a bare
            filename works. Otherwise use a full absolute path.
          </li>
          <li>
            The key must pair with the X.509 certificate you imported on the
            &quot;X.509 Certificate Import&quot; page - a different key
            won&apos;t verify.
          </li>
          <li>
            The file must be PEM-encoded (contents start with the usual BEGIN
            PRIVATE KEY line). DER, PFX or PKCS#12 keys can be converted with
            openssl first.
          </li>
        </ul>
      </div>

      <article className="mt-3 flex flex-col gap-3 rounded-md border border-gray-200 p-3">
        <h4 className="text-sm font-semibold text-gray-900">
          Run the openssl signing command
        </h4>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            Private key filename or path
          </label>
          <input
            id={inputId}
            type="text"
            value={privateKeyFilename}
            onChange={(e) => setPrivateKeyFilename(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm"
            placeholder="your_private_key.pem"
            disabled={isCompleted}
          />
          <p className="text-sm text-gray-600">
            What you type here is inserted into the openssl command below.
          </p>
        </div>

        <CopyCommandBlock command={commandWithFile} />

        <p className="text-sm text-gray-600">
          The command hashes the credential payload, signs it with your private
          key, and prints the resulting base64 signature. On macOS it also
          copies the signature to your clipboard.
        </p>
        <p className="text-sm text-gray-600">
          On Windows or Linux, copy the printed signature manually. If openssl
          can&apos;t find your key file, run the command from the folder that
          contains it, or use a full path in the field above.
        </p>
        <p className="text-sm text-gray-600">
          As a sanity check: an RSA signature is around 300+ base64 characters,
          an ECDSA signature around 96. Anything much shorter usually means the
          command failed.
        </p>
      </article>
    </section>
  );
};

type PasteSignatureSectionProps = {
  signature: string;
  setSignature: (value: string) => void;
  isCompleted: boolean;
  sectionNumber?: number;
};

const PasteSignatureSection = ({
  signature,
  setSignature,
  isCompleted,
  sectionNumber = 4,
}: PasteSignatureSectionProps) => (
  <section className="rounded-md border border-sky-200 bg-sky-50 p-4">
    <p className="text-sm font-semibold text-sky-900">
      {sectionNumber}. Paste the signature back here
    </p>
    <p className="mt-1 text-sm text-sky-800">
      Paste the raw base64 signature only - no surrounding &quot;Signature
      length: ...&quot; line, no quotation marks, no JSON wrapper.
    </p>
    <Textarea
      rows={5}
      placeholder="Paste signature here..."
      value={signature}
      onChange={(e) => setSignature(e.target.value)}
      disabled={isCompleted}
      className="mt-3 bg-white font-mono text-sm"
    />
    <p className="mt-2 text-sm text-sky-800">
      Line breaks are fine - whitespace is stripped before verifying. If
      verification fails, paste a fresh signature and try again.
    </p>
  </section>
);

type DetailRowTone = 'neutral' | 'blue' | 'indigo' | 'sky';

const DETAIL_TONE_CLASSES: Record<
  DetailRowTone,
  { label: string; value: string; mono: string }
> = {
  neutral: {
    label: 'text-gray-500',
    value: 'text-gray-800',
    mono: 'bg-gray-100 text-gray-800',
  },
  blue: {
    label: 'text-blue-700',
    value: 'text-blue-900',
    mono: 'bg-white text-blue-900',
  },
  indigo: {
    label: 'text-indigo-700',
    value: 'text-indigo-900',
    mono: 'bg-white text-indigo-900',
  },
  sky: {
    label: 'text-sky-700',
    value: 'text-sky-900',
    mono: 'bg-white text-sky-900',
  },
};

const DetailRow = ({
  label,
  value,
  mono,
  tone = 'neutral',
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  tone?: DetailRowTone;
}) => {
  const toneClasses = DETAIL_TONE_CLASSES[tone];
  return (
    <div className="grid grid-cols-[10rem_1fr] items-start gap-2">
      <dt
        className={`text-xs font-medium uppercase tracking-wide ${toneClasses.label}`}
      >
        {label}
      </dt>
      <dd
        className={
          mono
            ? `break-all rounded ${toneClasses.mono} px-2 py-1 font-mono text-xs`
            : `text-sm ${toneClasses.value}`
        }
      >
        {value}
      </dd>
    </div>
  );
};

type SupportingEvidenceSectionProps = {
  supportingCredential: SupportingCredential;
  credentialId: string;
};

const SupportingEvidenceSection = ({
  supportingCredential,
  credentialId,
}: SupportingEvidenceSectionProps) => {
  const co = supportingCredential.credentialObject;
  const types = Array.isArray(co?.type)
    ? (co.type as string[])
    : co?.type
      ? [co.type as string]
      : [];

  const subjectId = (co?.credentialSubject as Record<string, unknown>)?.id as
    | string
    | undefined;
  const verifiedKeypairDid = (co?.credentialSubject as Record<string, unknown>)
    ?.sameAs as string | undefined;
  const email = (co?.credentialSubject as Record<string, unknown>)?.email as
    | string
    | undefined;

  const isExternalKeypair = types.includes('ExternalKeypairVerification');

  const vcWithProof = { ...co, proof: supportingCredential.proof };

  const handleDownload = () => {
    const filename = isExternalKeypair
      ? `external-keypair-verification-${credentialId}`
      : `email-verification-${credentialId}`;
    downloadJson(filename, vcWithProof);
  };

  const jwtIoUrl = supportingCredential.proof.jwt
    ? `https://jwt.io/#token=${encodeURIComponent(supportingCredential.proof.jwt)}`
    : null;

  return (
    <section className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-900">
            2. Supporting evidence - creator identity proof
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            {isExternalKeypair
              ? 'This platform-issued credential proves the creator completed a keypair challenge and controls the external DID key that will become their credential subject.'
              : "This platform-issued credential proves the creator's email address has been verified by the platform."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-md border border-emerald-400 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Download VC
          </button>
          {jwtIoUrl && (
            <a
              href={jwtIoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-emerald-400 bg-white px-3 py-1.5 text-center text-xs font-medium text-emerald-800 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Verify on jwt.io
            </a>
          )}
        </div>
      </div>

      <dl className="mt-3 flex flex-col gap-2 text-sm">
        {types.length > 0 && (
          <DetailRow
            tone="neutral"
            label="VC types"
            value={
              <div className="flex flex-wrap gap-1">
                {types.map((type) => (
                  <Badge
                    key={type}
                    color="success"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            }
          />
        )}
        {Boolean(co?.issuer) && (
          <DetailRow
            tone="neutral"
            label="Issued by"
            value={co.issuer as string}
            mono
          />
        )}
        {Boolean(subjectId) && (
          <DetailRow
            tone="neutral"
            label="Subject DID"
            value={subjectId as string}
            mono
          />
        )}
        {Boolean(verifiedKeypairDid) && (
          <DetailRow
            tone="neutral"
            label="Same as (keypair DID)"
            value={verifiedKeypairDid as string}
            mono
          />
        )}
        {Boolean(email) && (
          <DetailRow
            tone="neutral"
            label="Verified email"
            value={email as string}
            mono
          />
        )}
        {Boolean(co?.validFrom) && (
          <DetailRow
            tone="neutral"
            label="Valid from"
            value={formatTimestamp(co.validFrom as string)}
          />
        )}
        {Boolean(co?.validUntil) && (
          <DetailRow
            tone="neutral"
            label="Valid until"
            value={formatTimestamp(co.validUntil as string)}
          />
        )}
        <DetailRow
          tone="neutral"
          label="Proof type"
          value={supportingCredential.proof.type}
        />
      </dl>
    </section>
  );
};

const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.toLocaleString()} (${iso})`;
};
