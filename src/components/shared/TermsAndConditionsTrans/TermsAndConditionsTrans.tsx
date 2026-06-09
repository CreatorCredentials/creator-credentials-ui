import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Trans } from 'react-i18next';
import { config } from '@/shared/constants/config';
import { useTranslation } from '@/shared/utils/useTranslation';

export type TermsAndConditionsTransProps = {
  agreed?: boolean;
  href?: string;
};

export const TermsAndConditionsTrans = ({
  agreed,
  href,
}: TermsAndConditionsTransProps) => {
  const tKey = agreed ? 'label.agreed' : 'label.will-agree';

  return (
    <Trans
      i18nKey={tKey}
      ns="terms-and-conditions"
      components={{
        link1: (
          <a
            className="underline underline-offset-[3px]"
            href={href ?? config.TERMS_AND_CONDITIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    />
  );
};
