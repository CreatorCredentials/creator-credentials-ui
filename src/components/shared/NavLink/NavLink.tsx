import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { ClassValue, clsxm } from '@/shared/utils/clsxm';

export interface LinkProps extends NextLinkProps {
  children: ReactNode;
  className?: ClassValue;
  disabled?: boolean;
  exact?: boolean;
}

export const NavLink = ({
  className,
  children,
  disabled,
  exact,
  href,
}: LinkProps) => {
  const { asPath } = useRouter();

  const isActive = exact
    ? asPath === href.toString()
    : asPath.startsWith(href.toString());

  return (
    <NextLink
      href={href}
      className={clsxm(className, {
        'font-bold': isActive,
        'anchor__button--disabled': disabled,
      })}
    >
      {children}
    </NextLink>
  );
};
