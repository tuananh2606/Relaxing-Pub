import Image, { ImageProps } from 'next/image';

import fallbackImage from '../../../public/blank-image.png';

interface ImageWithFallbackProps extends ImageProps {
  fallback?: ImageProps['src'];
}

const ImageWithFallback = ({ fallback = fallbackImage, alt, src, ...props }: ImageWithFallbackProps) => {
  return <Image alt={alt} src={src} placeholder="blur" blurDataURL="/blank-image.png" {...props} />;
};
export default ImageWithFallback;
