import { Card } from 'flowbite-react';
import React from 'react';

type CardWithTitleProps = {
  children?: React.ReactNode;
  title: string;
  description?: string;
};

export const CardWithTitle = ({
  children,
  title,
  description,
}: CardWithTitleProps) => (
  <Card className="overflow-hidden">
    <article className="flex flex-col gap-3">
      <header className="flex flex-col gap-4">
        <h3 className="text-xl">
          <p>{title}</p>
        </h3>
        {description && <h4 className="text-lg text-grey-4">{description}</h4>}
      </header>
      <div className="flex flex-col">{children}</div>
    </article>
  </Card>
);
