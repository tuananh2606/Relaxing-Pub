'use client';
import Lottie from 'lottie-react';
import likeAnimation from '~/lib/lotties/likeAnimation.json';
import { cn } from '~/lib/utils';
interface ILogo {
  className?: string;
}

const Logo = ({ className, ...props }: ILogo) => {
  return (
    <>
      <Lottie animationData={likeAnimation} loop={false} className={cn('-mt-[10px] size-12 md:size-16', className)} />
      <span className="font-semibold">FILMPUB</span>
    </>
  );
};
export default Logo;
