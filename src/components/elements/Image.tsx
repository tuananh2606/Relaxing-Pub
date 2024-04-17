import { forwardRef, useState } from 'react';
import { Image as NextuiImage, type ImageProps as NextuiImageProps } from '@nextui-org/image';
import NextImage, { ImageProps as NextImageProps, ImageLoaderProps } from 'next/image';

// @ts-ignore
type UseImageProps = NextuiImageProps & NextImageProps;

export interface ImageProps extends Omit<UseImageProps, 'ref' | 'isBlurred' | 'as'> {}

const Image = forwardRef<React.ElementRef<typeof NextuiImage>, ImageProps>(({ loader, ...props }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <NextuiImage
      ref={ref}
      as={NextImage}
      isLoading={isLoading}
      data-loaded={!isLoading}
      onLoad={() => setIsLoading(false)}
      {...props}
    />
  );
});
Image.displayName = NextuiImage.displayName;

export default Image;
