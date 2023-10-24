import React from 'react';
import { useTranslation } from 'next-i18next';
import { clsxm } from '@/shared/utils/clsxm';
import { IssuerSignupFormStep } from '../IssuerSignupContext/IssuerSignupContext.types';

type Step = {
  labelKey: string;
  order: number;
};

const STEPS: Record<IssuerSignupFormStep, Step> = {
  details: {
    labelKey: 'steps.details.tab-label',
    order: 0,
  },
  email: {
    labelKey: 'steps.email.tab-label',
    order: 1,
  },
};

type IssuerSignupFormStepsTabsProps = {
  currentStep: IssuerSignupFormStep;
};

export const IssuerSignupFormStepsTabs = ({
  currentStep,
}: IssuerSignupFormStepsTabsProps) => {
  const { t } = useTranslation('issuer-signup');

  return (
    <div className="flex gap-8 font-semibold text-grey-4">
      {Object.entries(STEPS).map(([key, { order, labelKey }], index) => (
        <div
          key={key}
          className={clsxm(
            'flex items-center gap-3 border-black',
            {
              'text-black': order <= STEPS[currentStep].order,
            },
            {
              'text-success border-success': order < STEPS[currentStep].order,
            },
            {
              'text-grey-4 border-grey-4': order > STEPS[currentStep].order,
            },
          )}
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-inherit text-center">
            <span>{index + 1}</span>
          </div>
          <div>{t(labelKey)}</div>
        </div>
      ))}
    </div>
  );
};
