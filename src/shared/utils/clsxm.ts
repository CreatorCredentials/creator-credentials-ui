/* eslint-disable no-restricted-imports */
import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';

export const clsxm = (...classes: ClassValue[]): string =>
  twMerge(clsx(...classes));
