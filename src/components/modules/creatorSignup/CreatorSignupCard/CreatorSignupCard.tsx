import { Card } from 'flowbite-react';
import React from 'react';

type CreatorSignupCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const CreatorSignupCard = ({
  title,
  description,
  children,
}: CreatorSignupCardProps) => (
  <Card className="w-[39rem]">
    <section className="flex flex-col gap-16">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl">
          <p>{title}</p>
        </h2>
        <h3>
          <p>{description}</p>
        </h3>
      </header>
      <div className="flex justify-center">{children}</div>
    </section>
  </Card>
);
