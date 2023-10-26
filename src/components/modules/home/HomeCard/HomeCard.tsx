import { Card } from 'flowbite-react';
import React from 'react';
import { Icon, IconName } from '@/components/shared/Icon';
import { CardBadge } from '../CardBadge';

type HomeCardProps = {
  title: string;
  children: React.ReactNode;
  renderFooter?: (renderProps: { icon: React.ReactNode }) => React.ReactNode;
  className?: string;
  badge?: {
    iconName: IconName;
    label: string;
  };
};

export const HomeCard = ({
  className,
  badge,
  renderFooter,
  children,
  title,
}: HomeCardProps) => {
  return (
    <Card className={className}>
      <article className="flex flex-col gap-3">
        <header className="flex flex-col gap-3">
          {badge && (
            <CardBadge
              iconName={badge.iconName}
              className="bg-cyan-600/10 px-2 text-primary"
            >
              {badge.label}
            </CardBadge>
          )}
          <h2 className="text-xl">{title}</h2>
        </header>
        {children}
        <footer>
          {renderFooter &&
            renderFooter({
              icon: (
                <Icon
                  icon="ArrowRight"
                  className="ms-2 h-4 w-4"
                />
              ),
            })}
        </footer>
      </article>
    </Card>
  );
};
