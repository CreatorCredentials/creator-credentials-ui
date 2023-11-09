import { Button } from 'flowbite-react';
import Link from 'next/link';
import React, { ElementType } from 'react';
import { Icon } from '../Icon';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  closeButtonHref?: string;
};

export const PageHeader = ({
  title,
  subtitle,
  closeButtonHref,
}: PageHeaderProps) => (
  <header className="mb-6 flex flex-col gap-4 text-black">
    <h1 className="text-2xl">{title}</h1>
    {subtitle && <h2 className="text-lg">{subtitle}</h2>}
    {closeButtonHref && (
      <aside className="absolute left-5">
        <Button
          color="black"
          href="/creator/verification"
          as={Link as ElementType}
          size="xs"
        >
          <Icon icon="ArrowLeft" />
        </Button>
      </aside>
    )}
  </header>
);
