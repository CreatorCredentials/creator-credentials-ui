import { Button } from 'flowbite-react';
import { useId, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useInitiateKeypairChallenge } from '@/api/mutations/useInitiateKeypairChallenge';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';
import { CopyCommandBlock } from '../CopyCommandBlock';

type KeypairOriginChoice = 'new' | 'existing';
type TerminalOs = 'mac' | 'windows' | 'linux';

const NEW_KEYPAIR_COMMANDS = [
  'openssl ecparam -name prime256v1 -genkey -noout -out cc_private_key.pem',
  'openssl ec -in cc_private_key.pem -pubout -out cc_public_key.pem',
];

const COPY_PUBLIC_KEY: Record<
  TerminalOs,
  { command: string; hint: ReactNode }
> = {
  mac: {
    command: 'cat cc_public_key.pem | pbcopy',
    hint: (
      <>
        Runs in Terminal. If something prints, you can ignore it – check your
        clipboard in Step 2.
      </>
    ),
  },
  windows: {
    command: 'Get-Content cc_public_key.pem | Set-Clipboard',
    hint: (
      <>
        Run in <strong>PowerShell</strong> from the folder that contains{' '}
        <code className="rounded bg-gray-100 px-1">cc_public_key.pem</code>. In
        Command Prompt you can run{' '}
        <code className="rounded bg-gray-100 px-1">
          type cc_public_key.pem | clip
        </code>{' '}
        instead.
      </>
    ),
  },
  linux: {
    command: 'xclip -selection clipboard < cc_public_key.pem',
    hint: (
      <>
        Requires <code className="rounded bg-gray-100 px-1">xclip</code> (e.g.{' '}
        <code className="rounded bg-gray-100 px-1">sudo apt install xclip</code>{' '}
        on Debian/Ubuntu). Alternatively open{' '}
        <code className="rounded bg-gray-100 px-1">cc_public_key.pem</code> in a
        text editor and copy the entire file, including{' '}
        <code className="rounded bg-gray-100 px-1">BEGIN</code> /{' '}
        <code className="rounded bg-gray-100 px-1">END</code> lines.
      </>
    ),
  },
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
};

const CopyPublicKeyStep = ({ stepNumber }: CopyPublicKeyStepProps) => {
  const [os, setOs] = useState<TerminalOs>('mac');
  const { command, hint } = COPY_PUBLIC_KEY[os];
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

export const KeypairVerificationGenerateCard = () => {
  const queryClient = useQueryClient();
  const { currentStep, setCurrentStep, setCommands } =
    useKeypairVerificationContext();

  const [origin, setOrigin] = useState<KeypairOriginChoice>('new');

  const { mutateAsync, isLoading } = useInitiateKeypairChallenge({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.keypairChallengeStatus]);
    },
  });

  const handleInitiate = async () => {
    const result = await mutateAsync();
    setCommands(result.commands);
    setCurrentStep('submit-key');
  };

  const showButton = currentStep === 'generate';

  return (
    <CardWithTitle
      title="Step 1: Get your keypair ready"
      description="A keypair is two files: a private key you keep secret and a public key that's safe to share. We use them to prove ownership of this credential without ever seeing your private key."
    >
      <div className="flex flex-col gap-6">
        <section className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">A few things worth knowing</p>
          <ul className="mt-2 list-disc ps-5">
            <li>
              <code className="rounded bg-white px-1">cc_private_key.pem</code>{' '}
              is the secret half. Don&apos;t email it, paste it in chat, or
              upload it - anyone with the file can sign on your behalf.
            </li>
            <li>
              <code className="rounded bg-white px-1">cc_public_key.pem</code>{' '}
              is the public half - safe to share, and the one you&apos;ll paste
              in Step 2.
            </li>
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
                chmod 600 cc_private_key.pem
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
              size="sm"
              color={origin === 'new' ? 'primary' : 'light'}
              onClick={() => setOrigin('new')}
            >
              Generate a new keypair
            </Button>
            <Button
              size="sm"
              color={origin === 'existing' ? 'primary' : 'light'}
              onClick={() => setOrigin('existing')}
            >
              Use an existing private key
            </Button>
          </div>
        </section>

        {origin === 'new' && <NewKeypairInstructions />}
        {origin === 'existing' && <ExistingKeypairInstructions />}

        {showButton && (
          <Button
            color="primary"
            className="self-start"
            onClick={handleInitiate}
            isProcessing={isLoading}
            disabled={isLoading}
          >
            I have my keypair files - continue to Step 2
          </Button>
        )}
      </div>
    </CardWithTitle>
  );
};

const NewKeypairInstructions = () => (
  <section className="flex flex-col gap-4">
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
      <p className="font-semibold">Where new key files are saved</p>
      <p className="mt-2">
        When you choose <strong>Generate a new keypair</strong>, OpenSSL writes{' '}
        <code className="rounded bg-white px-1">cc_private_key.pem</code> and{' '}
        <code className="rounded bg-white px-1">cc_public_key.pem</code> into
        your terminal&apos;s <strong>current working directory</strong> – the
        folder your shell is &quot;in&quot; when you run each command. Check it
        with <code className="rounded bg-white px-1">pwd</code> on macOS/Linux
        or <code className="rounded bg-white px-1">Get-Location</code> in
        Windows PowerShell before you run the openssl commands.
      </p>
      <p className="mt-2">
        So: open the terminal, <code className="rounded bg-white px-1">cd</code>{' '}
        into the folder where you want the key files to live <em>before</em>{' '}
        running step 1 below. If you run the commands without changing directory
        first, the files appear wherever that terminal session started (often
        your home folder or the desktop), which is easy to lose track of – pick
        the folder on purpose.
      </p>
    </div>

    <p className="text-sm text-gray-700">
      Run the following in a terminal (macOS Terminal, Windows PowerShell, Linux
      shell). Use <code className="rounded bg-gray-100 px-1">pwd</code> (macOS /
      Linux) or <code className="rounded bg-gray-100 px-1">Get-Location</code>{' '}
      (PowerShell) to confirm the folder you&apos;re in before generating keys.
    </p>

    <OpenSslInstallationSection />

    <CommandStep
      number={1}
      title="Create the private (secret) key file"
      command={NEW_KEYPAIR_COMMANDS[0]}
      explanation={
        <>
          Creates{' '}
          <code className="rounded bg-gray-100 px-1">cc_private_key.pem</code>{' '}
          in that working directory (the terminal&apos;s current folder). No
          output on success – this is the secret half, so don&apos;t open,
          share, or paste it.
        </>
      }
    />

    <CommandStep
      number={2}
      title="Derive the public key file from the secret one"
      command={NEW_KEYPAIR_COMMANDS[1]}
      explanation={
        <>
          Writes{' '}
          <code className="rounded bg-gray-100 px-1">cc_public_key.pem</code>{' '}
          next to the secret file. A short &quot;read EC key / writing EC
          key&quot; message is normal.
        </>
      }
    />

    <CopyPublicKeyStep stepNumber={3} />

    <p className="text-sm text-gray-600">
      You should now have both files. Continue to Step 2.
    </p>
  </section>
);

const ExistingKeypairInstructions = () => (
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
          RSA and other curves won&apos;t work. If yours is something else, use
          &quot;Generate a new keypair&quot; above instead.
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
          or <code className="rounded bg-gray-100 px-1">dir</code> (Windows) to
          confirm your key file is in the listing.
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
          <code className="rounded bg-gray-100 px-1">your_private_key.pem</code>{' '}
          with your actual filename. Expected output contains &quot;ASN1 OID:
          prime256v1&quot;; anything else (secp384r1, RSA, etc.) means the key
          isn&apos;t compatible – switch to &quot;Generate a new keypair&quot;
          above. If <code className="rounded bg-gray-100 px-1">openssl</code> is
          not found, use the &quot;Install OpenSSL&quot; section above for your
          system.
        </>
      }
    />

    <CommandStep
      number={3}
      title="Derive the public key from your existing private key"
      command="openssl ec -in your_private_key.pem -pubout -out cc_public_key.pem"
      explanation={
        <>
          <p>
            Reads your private key and writes{' '}
            <code className="rounded bg-gray-100 px-1">cc_public_key.pem</code>{' '}
            alongside it. Replace{' '}
            <code className="rounded bg-gray-100 px-1">
              your_private_key.pem
            </code>{' '}
            with your real filename.
          </p>
          <p>
            Note for Step 3: the signing command references{' '}
            <code className="rounded bg-gray-100 px-1">cc_private_key.pem</code>{' '}
            - either rename your file, or swap the name in the command before
            running it.
          </p>
        </>
      }
    />

    <CopyPublicKeyStep stepNumber={4} />
  </section>
);

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
