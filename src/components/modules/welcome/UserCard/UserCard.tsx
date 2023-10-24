import React from 'react';
import { Card } from 'flowbite-react';
import { Icon, IconName } from '@/components/shared/Icon';

type UserCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  iconName: IconName;
};

export const UserCard = ({
  title,
  subtitle,
  iconName,
  children,
}: UserCardProps) => (
  <Card className="w-[19rem] text-black">
    <article className="flex flex-1 flex-col justify-between gap-3">
      <header className="flex flex-col gap-2">
        <Icon
          icon={iconName}
          className="mx-auto h-16 w-16 stroke-grey-4 stroke-[0.5px]"
        />
        <h2 className="text-center text-2xl">
          <p>{title}</p>
        </h2>
        <h3 className="text-lg">
          <p>{subtitle}</p>
        </h3>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </article>
  </Card>
);
