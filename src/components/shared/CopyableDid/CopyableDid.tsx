import { useTranslation } from '@/shared/utils/useTranslation';
import { clsxm } from '@/shared/utils/clsxm';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { IconButton } from '../IconButton';

type CopyableDidProps = {
  did: string;
  className?: string;
  testId?: string;
};

/** A DID shortened to its ends, with the full value on hover and a copy button. */
export const CopyableDid = ({ did, className, testId }: CopyableDidProps) => {
  const { t } = useTranslation('common');
  const { copy } = useCopyToClipboard();

  return (
    <span
      className={clsxm('inline-flex max-w-full items-center gap-1', className)}
      data-testid={testId}
    >
      <code
        className="truncate font-mono text-xs text-grey-4"
        title={did}
      >
        {shortenDid(did)}
      </code>
      <IconButton
        icon="ContentCopy"
        className="shrink-0 p-1"
        aria-label={t('copy-to-clipboard.label')}
        onClick={() => copy(did)}
      />
    </span>
  );
};

const VISIBLE_HEAD = 12;
const VISIBLE_TAIL = 5;

/** `did:key:z6MkhaXg…Rb2fg` — keeps the method and both ends, which is what people compare by eye. */
export const shortenDid = (did: string): string =>
  did.length <= VISIBLE_HEAD + VISIBLE_TAIL + 1
    ? did
    : `${did.slice(0, VISIBLE_HEAD)}…${did.slice(-VISIBLE_TAIL)}`;
