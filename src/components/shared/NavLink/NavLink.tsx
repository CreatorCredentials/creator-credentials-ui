import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';

export interface LinkProps extends NextLinkProps {
  children: ReactNode;
  className?: ClassValue;
}

export const NavLink = ({ className, children, href }: LinkProps) => {
  const { asPath } = useRouter();

  const isActive = asPath === href;

  return (
    <NextLink
      href={href}
      className={clsxm(className, {
        'font-bold': isActive,
      })}
    >
      {children}
    </NextLink>
  );
};
