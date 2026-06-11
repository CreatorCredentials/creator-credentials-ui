import { Button, ButtonProps } from 'flowbite-react';
import { KeyboardEvent, MouseEvent } from 'react';
import { clsxm } from '@/shared/utils/clsxm';

export type AccessibleButtonProps = ButtonProps;

/**
 * Native `disabled` removes a button from the keyboard tab order, so pressing
 * Tab on the last field skips the action entirely and focus escapes the form
 * (e.g. to the browser URL bar). This wrapper keeps the button focusable by
 * using `aria-disabled` instead, while still blocking activation (click / Enter
 * / Space) and preserving the disabled look.
 */
export const AccessibleButton = ({
  disabled,
  onClick,
  onKeyDown,
  className,
  ...restProps
}: AccessibleButtonProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onKeyDown?.(event);
  };

  return (
    <Button
      {...restProps}
      aria-disabled={disabled || undefined}
      className={clsxm(disabled && 'cursor-not-allowed opacity-50', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
};
