import { useToast } from '@/shared/hooks/useToast';

type CopyCommandBlockProps = {
  command: string;
};

export const CopyCommandBlock = ({ command }: CopyCommandBlockProps) => {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      toast.success('Copied to clipboard');
    });
  };

  return (
    <div className="relative flex items-start rounded-md bg-gray-800 p-3">
      <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-green-400">
        <code>{command}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-2 shrink-0 rounded p-1 text-gray-400 hover:text-white"
        title="Copy to clipboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
};
