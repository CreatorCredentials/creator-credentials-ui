import { Button } from 'flowbite-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { QueryKeys } from '@/api/queryKeys';
import { useInitiateKeypairChallenge } from '@/api/mutations/useInitiateKeypairChallenge';
import { useKeypairVerificationContext } from '../KeypairVerificationContext';
import { CopyCommandBlock } from '../CopyCommandBlock';

type KeypairOriginChoice = 'new' | 'existing';

const NEW_KEYPAIR_COMMANDS = [
  'openssl ecparam -name prime256v1 -genkey -noout -out cc_private_key.pem',
  'openssl ec -in cc_private_key.pem -pubout -out cc_public_key.pem',
  'cat cc_public_key.pem | pbcopy',
];

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
    <p className="text-sm text-gray-700">
      Run the following in a terminal (macOS Terminal, Windows PowerShell, Linux
      Terminal). Output files land in the folder you&apos;re currently in.
    </p>

    <CommandStep
      number={1}
      title="Create the private (secret) key file"
      command={NEW_KEYPAIR_COMMANDS[0]}
      explanation={
        <>
          Creates{' '}
          <code className="rounded bg-gray-100 px-1">cc_private_key.pem</code>{' '}
          in the current folder. No output on success - this is the secret half,
          so don&apos;t open, share, or paste it.
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

    <CommandStep
      number={3}
      title="Copy the public key to your clipboard"
      command={NEW_KEYPAIR_COMMANDS[2]}
      explanation={
        <>
          The command shown is for macOS. On Windows PowerShell use{' '}
          <code className="rounded bg-gray-100 px-1">
            Get-Content cc_public_key.pem | Set-Clipboard
          </code>
          ; on Linux,{' '}
          <code className="rounded bg-gray-100 px-1">
            xclip -sel clip &lt; cc_public_key.pem
          </code>{' '}
          (or open the file in a text editor and copy by hand).
        </>
      }
    />

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
          <span className="font-medium">EC (elliptic curve) P-256</span> key -
          RSA and other curves won&apos;t work. If yours is something else, use
          &quot;Generate a new keypair&quot; above instead.
        </li>
      </ul>
    </div>

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
          isn&apos;t compatible - switch to &quot;Generate a new keypair&quot;
          above.
          <br />
          If openssl isn&apos;t installed: macOS{' '}
          <code className="rounded bg-gray-100 px-1">brew install openssl</code>
          ; Windows use{' '}
          <a
            className="underline"
            href="https://git-scm.com/download/win"
            target="_blank"
            rel="noreferrer"
          >
            Git for Windows
          </a>{' '}
          (Git Bash); Linux{' '}
          <code className="rounded bg-gray-100 px-1">
            sudo apt install openssl
          </code>
          .
        </>
      }
    />

    <CommandStep
      number={3}
      title="Derive the public key from your existing private key"
      command="openssl ec -in your_private_key.pem -pubout -out cc_public_key.pem"
      explanation={
        <>
          Reads your private key and writes{' '}
          <code className="rounded bg-gray-100 px-1">cc_public_key.pem</code>{' '}
          alongside it. Replace{' '}
          <code className="rounded bg-gray-100 px-1">your_private_key.pem</code>{' '}
          with your real filename.
          <br />
          Note for Step 3: the signing command references{' '}
          <code className="rounded bg-gray-100 px-1">cc_private_key.pem</code> -
          either rename your file, or swap the name in the command before
          running it.
        </>
      }
    />

    <CommandStep
      number={4}
      title="Copy the public key to your clipboard"
      command="cat cc_public_key.pem | pbcopy"
      explanation={
        <>
          macOS form shown. Windows PowerShell:{' '}
          <code className="rounded bg-gray-100 px-1">
            Get-Content cc_public_key.pem | Set-Clipboard
          </code>
          . Linux:{' '}
          <code className="rounded bg-gray-100 px-1">
            xclip -sel clip &lt; cc_public_key.pem
          </code>
          . Whatever you paste in Step 2 must include both the BEGIN PUBLIC KEY
          and END PUBLIC KEY delimiter lines.
        </>
      }
    />
  </section>
);

type CommandStepProps = {
  number: number;
  title: string;
  command: string;
  explanation: React.ReactNode;
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
