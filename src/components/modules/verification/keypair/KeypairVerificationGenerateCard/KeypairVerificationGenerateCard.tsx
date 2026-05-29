import { Button } from 'flowbite-react';
import { useId, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from '@/api/axiosNest';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useInitiateKeypairChallenge } from '@/api/mutations/useInitiateKeypairChallenge';
import { useToast } from '@/shared/hooks/useToast';
import { useCredentialsRequestContext } from '@/components/modules/credentials/CredentialsRequestContext';
import { TEMPLATE_TYPE_TO_CREDENTIAL_TYPE } from '@/shared/typings/CredentialTemplateType';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';
import { CopyCommandBlock } from '../CopyCommandBlock';

type KeypairOriginChoice = 'new' | 'existing';
type TerminalOs = 'mac' | 'windows' | 'linux';

/**
 * Converts free-form text into a safe filename segment:
 * lowercase, non-alphanumeric runs collapsed to a single underscore,
 * leading/trailing underscores stripped.
 */
const toFilenamePart = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

/** Prefix segment from backend credential type (e.g. DATASUPPLIER), not template enum. */
const buildKeyFilePrefix = (
  issuerName: string | undefined,
  credentialType: string | undefined,
  date: Date,
): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  const parts = [
    issuerName ? toFilenamePart(issuerName) : '',
    credentialType ? toFilenamePart(credentialType) : '',
    `${dd}_${mm}_${yyyy}`,
  ].filter(Boolean);
  return parts.join('_') || 'cc';
};

const buildKeyFileNames = (
  prefix: string,
): { privateKey: string; publicKey: string } => ({
  privateKey: `${prefix}_private_key.pem`,
  publicKey: `${prefix}_public_key.pem`,
});

const buildNewKeypairCommands = (prefix: string): string[] => {
  const { privateKey, publicKey } = buildKeyFileNames(prefix);
  return [
    `openssl ecparam -name prime256v1 -genkey -noout -out ${privateKey}`,
    `openssl ec -in ${privateKey} -pubout -out ${publicKey}`,
  ];
};

const buildCopyPublicKeyCommands = (
  prefix: string,
): Record<TerminalOs, { command: string; hint: ReactNode }> => {
  const { publicKey } = buildKeyFileNames(prefix);
  return {
    mac: {
      command: `cat ${publicKey} | pbcopy`,
      hint: (
        <>
          Runs in Terminal. If something prints, you can ignore it – check your
          clipboard in Step 2.
        </>
      ),
    },
    windows: {
      command: `Get-Content ${publicKey} | Set-Clipboard`,
      hint: (
        <>
          Run in <strong>PowerShell</strong> from the folder that contains{' '}
          <code className="rounded bg-gray-100 px-1">{publicKey}</code>. In
          Command Prompt you can run{' '}
          <code className="rounded bg-gray-100 px-1">
            type {publicKey} | clip
          </code>{' '}
          instead.
        </>
      ),
    },
    linux: {
      command: `xclip -selection clipboard < ${publicKey}`,
      hint: (
        <>
          Requires <code className="rounded bg-gray-100 px-1">xclip</code> (e.g.{' '}
          <code className="rounded bg-gray-100 px-1">
            sudo apt install xclip
          </code>{' '}
          on Debian/Ubuntu). Alternatively open{' '}
          <code className="rounded bg-gray-100 px-1">{publicKey}</code> in a
          text editor and copy the entire file, including{' '}
          <code className="rounded bg-gray-100 px-1">BEGIN</code> /{' '}
          <code className="rounded bg-gray-100 px-1">END</code> lines.
        </>
      ),
    },
  };
};

const OS_LABELS: Record<TerminalOs, string> = {
  mac: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
};

type OsSegmentedControlProps = {
  value: TerminalOs;
  onChange: (os: TerminalOs) => void;
  labelledBy?: string;
};

const OsSegmentedControl = ({
  value,
  onChange,
  labelledBy,
}: OsSegmentedControlProps) => (
  <div
    role="group"
    aria-labelledby={labelledBy}
    className="flex flex-wrap gap-2"
  >
    {(Object.keys(OS_LABELS) as TerminalOs[]).map((os) => (
      <Button
        key={os}
        type="button"
        size="sm"
        color={value === os ? 'primary' : 'light'}
        onClick={() => onChange(os)}
      >
        {OS_LABELS[os]}
      </Button>
    ))}
  </div>
);

const OpenSslInstallationSection = () => {
  const headingId = useId();
  const systemPickId = useId();
  const [os, setOs] = useState<TerminalOs>('mac');

  return (
    <section className="rounded-md border border-violet-200 bg-violet-50 p-3 text-sm text-violet-950">
      <p
        className="font-semibold"
        id={headingId}
      >
        Install OpenSSL (if needed)
      </p>
      <p className="mt-2 text-violet-900">
        These flows call the{' '}
        <code className="rounded bg-white px-1">openssl</code> program from your
        terminal. If{' '}
        <code className="rounded bg-white px-1">openssl version</code> reports
        an error, install it using the option for your system.
      </p>
      <p
        className="mt-3 text-xs font-medium uppercase tracking-wide text-violet-800"
        id={systemPickId}
      >
        Your system
      </p>
      <div className="mt-1">
        <OsSegmentedControl
          value={os}
          onChange={setOs}
          labelledBy={systemPickId}
        />
      </div>
      <div className="mt-3 text-violet-900">
        {os === 'mac' && (
          <ul className="list-disc ps-5">
            <li>
              Recent macOS usually ships with an OpenSSL-compatible CLI in
              Terminal. Run{' '}
              <code className="rounded bg-white px-1">openssl version</code> to
              confirm.
            </li>
            <li>
              For a current OpenSSL via Homebrew:{' '}
              <code className="rounded bg-white px-1">
                brew install openssl
              </code>
              . If the shell still picks up the old binary, call the Homebrew
              one explicitly, e.g.{' '}
              <code className="rounded bg-white px-1">
                $(brew --prefix openssl@3)/bin/openssl
              </code>{' '}
              (path may differ slightly by version).
            </li>
          </ul>
        )}
        {os === 'windows' && (
          <ul className="list-disc ps-5">
            <li>
              <strong>Git for Windows</strong> (Git Bash) includes OpenSSL — see{' '}
              <a
                className="underline"
                href="https://git-scm.com/download/win"
                target="_blank"
                rel="noreferrer"
              >
                git-scm.com/download/win
              </a>
              .
            </li>
            <li>
              Or install via <strong>winget</strong>:{' '}
              <code className="rounded bg-white px-1">
                winget install ShiningLight.OpenSSL.Light
              </code>{' '}
              (package name may vary; search{' '}
              <code className="rounded bg-white px-1">
                winget search openssl
              </code>
              ).
            </li>
            <li>
              Or <strong>Chocolatey</strong>:{' '}
              <code className="rounded bg-white px-1">
                choco install openssl.light
              </code>{' '}
              (run an elevated shell if prompted).
            </li>
            <li>
              After installing, open a <strong>new</strong> terminal/PowerShell
              window so <code className="rounded bg-white px-1">openssl</code>{' '}
              is on your PATH (or use the full path shown by the installer).
            </li>
          </ul>
        )}
        {os === 'linux' && (
          <ul className="list-disc ps-5">
            <li>
              Debian / Ubuntu:{' '}
              <code className="rounded bg-white px-1">
                sudo apt update && sudo apt install openssl
              </code>
            </li>
            <li>
              Fedora:{' '}
              <code className="rounded bg-white px-1">
                sudo dnf install openssl
              </code>
            </li>
            <li>
              Arch:{' '}
              <code className="rounded bg-white px-1">
                sudo pacman -S openssl
              </code>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

type CopyPublicKeyStepProps = {
  stepNumber: number;
  keyFilePrefix: string;
};

/** New keypair only — OS-specific copy commands tied to generated filenames. */
const CopyPublicKeyStep = ({
  stepNumber,
  keyFilePrefix,
}: CopyPublicKeyStepProps) => {
  const [os, setOs] = useState<TerminalOs>('mac');
  const copyPublicKeyCommands = useMemo(
    () => buildCopyPublicKeyCommands(keyFilePrefix),
    [keyFilePrefix],
  );
  const { command, hint } = copyPublicKeyCommands[os];
  const systemPickId = useId();

  return (
    <article className="flex flex-col gap-2 rounded-md border border-gray-200 p-3">
      <h4 className="text-sm font-semibold text-gray-900">
        {stepNumber}. Copy the public key to your clipboard
      </h4>
      <OsSegmentedControl
        value={os}
        onChange={setOs}
        labelledBy={systemPickId}
      />
      <CopyCommandBlock command={command} />
      <p className="text-sm text-gray-600">{hint}</p>
      <p className="text-sm text-gray-600">
        Whatever you paste in Step 2 must include both the{' '}
        <code className="rounded bg-gray-100 px-1">BEGIN PUBLIC KEY</code> and{' '}
        <code className="rounded bg-gray-100 px-1">END PUBLIC KEY</code>{' '}
        delimiter lines.
      </p>
    </article>
  );
};

type KeypairNamesCalloutProps = {
  templateLabel: string;
  credentialType: string;
  privateKey: string;
  publicKey: string;
};

const KeypairNamesCallout = ({
  templateLabel,
  credentialType,
  privateKey,
  publicKey,
}: KeypairNamesCalloutProps) => (
  <section className="rounded-md border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-950">
    <p className="font-semibold">Credential type → key file names</p>
    <p className="mt-2 text-indigo-900">
      For this request, OpenSSL commands use filenames derived from your issuer,
      credential type, and today&apos;s date:
    </p>
    <dl className="mt-3 grid gap-2 text-indigo-900">
      <div className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1">
        <dt className="font-medium">Template</dt>
        <dd>{templateLabel}</dd>
        <dt className="font-medium">Credential type</dt>
        <dd>
          <code className="rounded bg-white px-1">{credentialType}</code>
        </dd>
        <dt className="font-medium">Private key file</dt>
        <dd>
          <code className="rounded bg-white px-1">{privateKey}</code>
        </dd>
        <dt className="font-medium">Public key file</dt>
        <dd>
          <code className="rounded bg-white px-1">{publicKey}</code>
        </dd>
      </div>
    </dl>
  </section>
);

type ExistingCopyPublicKeyStepProps = { stepNumber: number };

/** Existing keypair — no template-based filenames or OS command template. */
const ExistingCopyPublicKeyStep = ({
  stepNumber,
}: ExistingCopyPublicKeyStepProps) => (
  <article className="flex flex-col gap-2 rounded-md border border-gray-200 p-3">
    <h4 className="text-sm font-semibold text-gray-900">
      {stepNumber}. Copy the public key to your clipboard
    </h4>
    <p className="text-sm text-gray-600">
      Copy the entire PEM for the public key file you created in step 3 (or an
      existing public key you already have). Include the{' '}
      <code className="rounded bg-gray-100 px-1">BEGIN PUBLIC KEY</code> and{' '}
      <code className="rounded bg-gray-100 px-1">END PUBLIC KEY</code> delimiter
      lines — whatever you paste in Step 2 must include both.
    </p>
    <ul className="list-disc ps-5 text-sm text-gray-600">
      <li>Open the file in any text editor and copy all contents.</li>
      <li>
        Or from the folder that contains your public key file, run a copy
        command using <strong>your actual filename</strong> (examples:{' '}
        <code className="rounded bg-gray-100 px-1">
          cat your_public_key.pem | pbcopy
        </code>{' '}
        on macOS,{' '}
        <code className="rounded bg-gray-100 px-1">
          Get-Content your_public_key.pem | Set-Clipboard
        </code>{' '}
        in PowerShell).
      </li>
    </ul>
  </article>
);

export const KeypairVerificationGenerateCard = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { currentStep, setCurrentStep, setCommands } =
    useKeypairVerificationContext();
  const { selectedIssuer, templates } = useCredentialsRequestContext();

  const selectedTemplate = templates.selectedItems[0];

  const credentialTypeForFiles = selectedTemplate?.templateType
    ? TEMPLATE_TYPE_TO_CREDENTIAL_TYPE[selectedTemplate.templateType]
    : undefined;

  const keyFilePrefix = useMemo(() => {
    return buildKeyFilePrefix(
      selectedIssuer?.name,
      credentialTypeForFiles,
      new Date(),
    );
  }, [selectedIssuer?.name, credentialTypeForFiles]);

  const keyFileNames = useMemo(
    () => buildKeyFileNames(keyFilePrefix),
    [keyFilePrefix],
  );

  /** Signing commands use generic cc_* names when reusing an existing private key. */
  const existingSigningNames = buildKeyFileNames('cc');

  const [origin, setOrigin] = useState<KeypairOriginChoice>('new');

  const { mutateAsync, isLoading } = useInitiateKeypairChallenge({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.keypairChallengeStatus]);
    },
  });

  const handleInitiate = async () => {
    try {
      const challengePrefix = origin === 'existing' ? undefined : keyFilePrefix;
      const result = await mutateAsync(challengePrefix);
      setCommands(result.commands);
      setCurrentStep('submit-key');
    } catch (err) {
      const message =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ??
        'Failed to start keypair challenge. Please try again.';
      toast.error(message);
    }
  };

  const isGenerateStep = currentStep === 'generate';

  return (
    <CardWithTitle
      title="Step 1: Get your keypair ready"
      description="A keypair is two files: a private key you keep secret and a public key that's safe to share. We use them to prove ownership of this credential without ever seeing your private key."
    >
      <div className="flex flex-col gap-6">
        {origin === 'new' && selectedTemplate && credentialTypeForFiles && (
          <KeypairNamesCallout
            templateLabel={selectedTemplate.name}
            credentialType={credentialTypeForFiles}
            privateKey={keyFileNames.privateKey}
            publicKey={keyFileNames.publicKey}
          />
        )}

        <section className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">A few things worth knowing</p>
          <ul className="mt-2 list-disc ps-5">
            {origin === 'new' ? (
              <>
                <li>
                  <code className="rounded bg-white px-1">
                    {keyFileNames.privateKey}
                  </code>{' '}
                  is the secret half. Don&apos;t email it, paste it in chat, or
                  upload it - anyone with the file can sign on your behalf.
                </li>
                <li>
                  <code className="rounded bg-white px-1">
                    {keyFileNames.publicKey}
                  </code>{' '}
                  is the public half - safe to share, and the one you&apos;ll
                  paste in Step 2.
                </li>
              </>
            ) : (
              <>
                <li>
                  Keep using your existing private key filename on disk. Step 3
                  signing will reference{' '}
                  <code className="rounded bg-white px-1">
                    {existingSigningNames.privateKey}
                  </code>{' '}
                  — rename your file to match, or adjust the signing command
                  filename when you run it.
                </li>
                <li>
                  Paste whichever public key PEM belongs to that private key in
                  Step 2 (filename does not matter for the paste).
                </li>
              </>
            )}
            <li>
              The proof is single-use for this request. The next time you
              request the same credential type you&apos;ll go through this flow
              again (you can reuse the same key file).
            </li>
          </ul>
        </section>

        <section className="rounded-md border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900">
          <p className="font-semibold">
            Managing, storing, and using your private key (.pem)
          </p>
          <p className="mt-2 text-slate-800">
            You are responsible for keeping the private key file secret and
            available only on devices you trust. Creator Credentials never
            receives your private key; you only use it locally with{' '}
            <code className="rounded bg-white px-1">openssl</code> (or similar)
            to sign challenges.
          </p>
          <p className="mt-2 font-medium text-slate-900">
            Where should <code className="rounded bg-white px-1">.pem</code>{' '}
            files live?
          </p>
          <ul className="mt-2 list-disc ps-5 text-slate-800">
            <li>
              Use a folder on your computer that is <strong>not</strong> synced
              to the cloud (avoid Dropbox, iCloud Drive, OneDrive, Google Drive,
              etc. for the <em>private</em> key), not inside a git repo, and not
              on a shared network drive unless it is encrypted and
              access-controlled.
            </li>
            <li>
              A common pattern is a dedicated directory such as{' '}
              <code className="rounded bg-white px-1">~/.ssh</code>-style usage
              or{' '}
              <code className="rounded bg-white px-1">
                ~/keys/creator-credentials
              </code>{' '}
              – pick one place, stay consistent, and restrict permissions (on
              macOS/Linux:{' '}
              <code className="rounded bg-white px-1">
                chmod 600{' '}
                {origin === 'new'
                  ? keyFileNames.privateKey
                  : existingSigningNames.privateKey}
              </code>
              ).
            </li>
            <li>
              The public <code className="rounded bg-white px-1">.pem</code> may
              sit next to the private file while you complete this flow; long
              term you can archive or move the public key separately – it is not
              secret.
            </li>
            <li>
              Back up the private key only in an <strong>encrypted</strong> form
              (e.g. encrypted disk, password manager, or hardware you control).
              Do not store plaintext private keys in email, tickets, or
              screenshots.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-800">
            How would you like to proceed?
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              color={origin === 'new' ? 'primary' : 'light'}
              onClick={() => setOrigin('new')}
            >
              Generate a new keypair
            </Button>
            <Button
              type="button"
              size="sm"
              color={origin === 'existing' ? 'primary' : 'light'}
              onClick={() => setOrigin('existing')}
            >
              Use an existing private key
            </Button>
          </div>
        </section>

        {origin === 'new' && (
          <NewKeypairInstructions keyFilePrefix={keyFilePrefix} />
        )}
        {origin === 'existing' && <ExistingKeypairInstructions />}

        {isGenerateStep ? (
          <Button
            type="button"
            color="primary"
            className="self-start"
            onClick={handleInitiate}
            isProcessing={isLoading}
            disabled={isLoading}
          >
            I have my keypair files - continue to Step 2
          </Button>
        ) : (
          <p className="text-sm font-medium text-emerald-700">
            Step 1 complete — continue with Step 2 below.
          </p>
        )}
      </div>
    </CardWithTitle>
  );
};

type NewKeypairInstructionsProps = { keyFilePrefix: string };

const NewKeypairInstructions = ({
  keyFilePrefix,
}: NewKeypairInstructionsProps) => {
  const commands = useMemo(
    () => buildNewKeypairCommands(keyFilePrefix),
    [keyFilePrefix],
  );
  const { privateKey, publicKey } = buildKeyFileNames(keyFilePrefix);

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
        <p className="font-semibold">Where new key files are saved</p>
        <p className="mt-2">
          When you choose <strong>Generate a new keypair</strong>, OpenSSL
          writes <code className="rounded bg-white px-1">{privateKey}</code> and{' '}
          <code className="rounded bg-white px-1">{publicKey}</code> into your
          terminal&apos;s <strong>current working directory</strong> – the
          folder your shell is &quot;in&quot; when you run each command. Check
          it with <code className="rounded bg-white px-1">pwd</code> on
          macOS/Linux or{' '}
          <code className="rounded bg-white px-1">Get-Location</code> in Windows
          PowerShell before you run the openssl commands.
        </p>
        <p className="mt-2">
          So: open the terminal,{' '}
          <code className="rounded bg-white px-1">cd</code> into the folder
          where you want the key files to live <em>before</em> running step 1
          below. If you run the commands without changing directory first, the
          files appear wherever that terminal session started (often your home
          folder or the desktop), which is easy to lose track of – pick the
          folder on purpose.
        </p>
      </div>

      <p className="text-sm text-gray-700">
        Run the following in a terminal (macOS Terminal, Windows PowerShell,
        Linux shell). Use <code className="rounded bg-gray-100 px-1">pwd</code>{' '}
        (macOS / Linux) or{' '}
        <code className="rounded bg-gray-100 px-1">Get-Location</code>{' '}
        (PowerShell) to confirm the folder you&apos;re in before generating
        keys.
      </p>

      <OpenSslInstallationSection />

      <CommandStep
        number={1}
        title="Create the private (secret) key file"
        command={commands[0]}
        explanation={
          <>
            Creates{' '}
            <code className="rounded bg-gray-100 px-1">{privateKey}</code> in
            that working directory (the terminal&apos;s current folder). No
            output on success – this is the secret half, so don&apos;t open,
            share, or paste it.
          </>
        }
      />

      <CommandStep
        number={2}
        title="Derive the public key file from the secret one"
        command={commands[1]}
        explanation={
          <>
            Writes <code className="rounded bg-gray-100 px-1">{publicKey}</code>{' '}
            next to the secret file. A short &quot;read EC key / writing EC
            key&quot; message is normal.
          </>
        }
      />

      <CopyPublicKeyStep
        stepNumber={3}
        keyFilePrefix={keyFilePrefix}
      />

      <p className="text-sm text-gray-600">
        You should now have both files. Continue to Step 2.
      </p>
    </section>
  );
};

const ExistingKeypairInstructions = () => {
  const signingPrivateKey = buildKeyFileNames('cc').privateKey;

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
        <p className="font-semibold">Compatibility checklist</p>
        <ul className="mt-2 list-disc ps-5">
          <li>
            The private key file is accessible on this computer (a{' '}
            <code className="rounded bg-white px-1">.pem</code> or{' '}
            <code className="rounded bg-white px-1">.key</code> file).
          </li>
          <li>
            It must be an{' '}
            <span className="font-medium">EC (elliptic curve) P-256</span> key –
            RSA and other curves won&apos;t work. If yours is something else,
            use &quot;Generate a new keypair&quot; above instead.
          </li>
        </ul>
      </div>

      <OpenSslInstallationSection />

      <CommandStep
        number={1}
        title="Open a terminal in the folder that holds your private key"
        command='cd "/path/to/folder/with/your/private/key"'
        explanation={
          <>
            Replace the path with the real one. Tip: on macOS you can drag the
            folder from Finder into the terminal to insert its path; on Windows
            the path is visible in the File Explorer address bar. Run{' '}
            <code className="rounded bg-gray-100 px-1">ls</code> (macOS / Linux)
            or <code className="rounded bg-gray-100 px-1">dir</code> (Windows)
            to confirm your key file is in the listing.
          </>
        }
      />

      <CommandStep
        number={2}
        title="Confirm the key type is EC P-256"
        command='openssl ec -in your_private_key.pem -text -noout | grep "ASN1 OID"'
        explanation={
          <>
            Replace{' '}
            <code className="rounded bg-gray-100 px-1">
              your_private_key.pem
            </code>{' '}
            with your actual filename. Expected output contains &quot;ASN1 OID:
            prime256v1&quot;; anything else (secp384r1, RSA, etc.) means the key
            isn&apos;t compatible – switch to &quot;Generate a new keypair&quot;
            above. If <code className="rounded bg-gray-100 px-1">openssl</code>{' '}
            is not found, use the &quot;Install OpenSSL&quot; section above for
            your system.
          </>
        }
      />

      <CommandStep
        number={3}
        title="Derive the public key from your existing private key"
        command="openssl ec -in your_private_key.pem -pubout -out your_public_key.pem"
        explanation={
          <>
            <p>
              Reads your private key and writes a public key PEM alongside it.
              Replace{' '}
              <code className="rounded bg-gray-100 px-1">
                your_private_key.pem
              </code>{' '}
              and{' '}
              <code className="rounded bg-gray-100 px-1">
                your_public_key.pem
              </code>{' '}
              with your real filenames.
            </p>
            <p>
              Step 3 signing will reference{' '}
              <code className="rounded bg-gray-100 px-1">
                {signingPrivateKey}
              </code>{' '}
              — rename your private key file to match, or replace the filename
              in the signing command before running it.
            </p>
          </>
        }
      />

      <ExistingCopyPublicKeyStep stepNumber={4} />
    </section>
  );
};

type CommandStepProps = {
  number: number;
  title: string;
  command: string;
  explanation: ReactNode;
};

const CommandStep = ({
  number,
  title,
  command,
  explanation,
}: CommandStepProps) => (
  <article className="flex flex-col gap-2 rounded-md border border-gray-200 p-3">
    <h4 className="text-sm font-semibold text-gray-900">
      {number}. {title}
    </h4>
    <CopyCommandBlock command={command} />
    <p className="text-sm text-gray-600">{explanation}</p>
  </article>
);
