import { getPlaiceholder } from 'plaiceholder';
import sharp from 'sharp';
import type { ImageProps } from 'next/image';

export async function getBlurredImage(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const image = sharp(arrayBuffer);
  const { width, height } = await image.metadata();
  const resizedImageBuffer = await image
    .resize(32, 32, { fit: 'inside' })
    .png({
      quality: 40,
    })
    .toBuffer();

  const imageBase64 = `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`;

  return {
    imageBase64,
    width,
    height,
  };
}

export async function getImages(imageSrc: string) {
  const withBlurredImages = await getBlurredImage(imageSrc);
  return withBlurredImages;
}
