import Image, { ImageProps } from 'next/image';
import React from 'react';
import { clsxm, ClassValue } from '@/shared/utils/clsxm';

type BrandProps = Omit<ImageProps, 'src' | 'alt'> & {
  containerClassName?: ClassValue;
};

export const BrandImage = ({
  fill = true,
  containerClassName = '',
  ...imageProps
}: BrandProps) => (
  <div
    className={clsxm(
      'absolute h-[4.375rem] w-[4.375rem] bg-transparent',
      containerClassName,
    )}
  >
    <Image
      src="/images/brand.svg"
      alt="Creator Credentials brand logo"
      fill={fill}
      {...imageProps}
    />
  </div>
);
