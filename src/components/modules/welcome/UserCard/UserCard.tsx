import React from 'react';
import { Card } from 'flowbite-react';

type UserCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export const UserCard = ({ title, subtitle, children }: UserCardProps) => (
  <Card className="w-[19rem] text-black">
    <article className="flex flex-col gap-3">
      <header className="flex flex-col gap-2">
        <h2 className="text-center text-2xl">
          <p>{title}</p>
        </h2>
        <h3 className="text-lg">
          <p>{subtitle}</p>
        </h3>
      </header>
      <p>{children}</p>
    </article>
  </Card>
);
