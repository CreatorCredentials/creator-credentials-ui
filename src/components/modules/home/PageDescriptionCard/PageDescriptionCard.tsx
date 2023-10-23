import { Card } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

export const PageDescriptionCard = () => {
  const { t } = useTranslation('home');

  return (
    <Card>
      <article>
        <header>
          <h2 className="text-xl">{t('description-card.title')}</h2>
        </header>
        <p className="text-lg text-grey-4">{t('description-card.subtitle')}</p>
      </article>
    </Card>
  );
};
