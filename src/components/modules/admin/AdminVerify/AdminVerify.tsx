import { Alert, Button, Label, Textarea } from 'flowbite-react';
import { FormEvent, useId, useState } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useVerifyCredential } from '@/api/mutations/useVerifyCredential';
import { VerifyResultCard } from '../VerifyResultCard';
import { parseVerifyInput, VerifyInputError } from './parseVerifyInput';

const INPUT_ROWS = 10;

export const AdminVerify = () => {
  const { t } = useTranslation('admin');
  const inputId = useId();
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<VerifyInputError | null>(null);
  const {
    mutate: verify,
    data: result,
    isPending,
    isError,
    reset,
  } = useVerifyCredential();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const parsed = parseVerifyInput(input);
    if ('error' in parsed) {
      setInputError(parsed.error);
      reset();
      return;
    }
    setInputError(null);
    verify(parsed.payload);
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={submitHandler}
      >
        <Label
          htmlFor={inputId}
          value={t('verify.input-label')}
        />
        <Textarea
          id={inputId}
          rows={INPUT_ROWS}
          className="scrollbar font-mono text-xs"
          placeholder={t('verify.input-placeholder')}
          value={input}
          color={inputError ? 'failure' : 'gray'}
          helperText={inputError ? t(`verify.${inputError}-input`) : undefined}
          disabled={isPending}
          onChange={(event) => setInput(event.target.value)}
          data-testid="admin-verify-input"
        />
        <Button
          type="submit"
          color="primary"
          className="self-start"
          isProcessing={isPending}
          disabled={isPending}
          data-testid="admin-verify-submit"
        >
          {t('verify.submit')}
        </Button>
      </form>
      {isError && (
        <Alert
          color="failure"
          data-testid="admin-verify-error"
        >
          {t('verify.error')}
        </Alert>
      )}
      {result && <VerifyResultCard result={result} />}
    </div>
  );
};
