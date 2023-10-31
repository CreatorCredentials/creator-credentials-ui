import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <header className="flex flex-col gap-4 text-black">
    <h1 className="text-2xl">{title}</h1>
    {subtitle && <h2 className="text-lg">{subtitle}</h2>}
  </header>
);
