import React from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useGetUser } from '@/api/queries/useGetUser';
import { OrganizationNameSection } from '../OrganizationNameSection/OrganizationNameSection';

type CreatorPersonalDataProps = {
  email: string;
};

export const CreatorPersonalData = ({}: CreatorPersonalDataProps) => {
  const { t } = useTranslation('creator-profile');
  const { data: user } = useGetUser();

  return (
    <article className="flex flex-col gap-6">
      <h2 className="text-xl">{t('personal-data.title')}</h2>
      <div className="flex max-w-[40rem] flex-col gap-2">
        <OrganizationNameSection
          currentValue={user?.organizationName ?? null}
        />
      </div>
    </article>
  );
};
