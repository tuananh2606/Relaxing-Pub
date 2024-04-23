'use client';
import { cn } from '~/lib/utils';
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(`${shimmer} relative h-80 w-auto overflow-hidden rounded-xl  bg-gray-500/80 shadow-sm`, className)}
    >
      <div className="h-full w-full  bg-[rgba(255,255,255,0.2)]" />
    </div>
  );
}

export const HomePageSkeleton = () => {
  return (
    <div className="mt-16 h-screen w-full px-2">
      <div
        className="relative flex h-[56.25vw] w-full flex-col items-center justify-center overflow-hidden bg-gray-500/80 p-4
      before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
      ></div>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton className="hidden md:block" />
        <CardSkeleton className="hidden md:block" />
      </div>
    </div>
  );
};

export const VideoSkeleton = () => {
  return (
    <div
      className="relative flex h-screen max-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-500/80
      p-4 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
    >
      <div className="">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 9.2L22.2133 5.55071C22.4395 5.39235 22.7513 5.44737 22.9096 5.6736C22.9684 5.75764 23 5.85774 23 5.96033V18.0397C23 18.3158 22.7761 18.5397 22.5 18.5397C22.3974 18.5397 22.2973 18.5081 22.2133 18.4493L17 14.8V19C17 19.5523 16.5523 20 16 20H2C1.44772 20 1 19.5523 1 19V5C1 4.44772 1.44772 4 2 4H16C16.5523 4 17 4.44772 17 5V9.2ZM5 8V10H7V8H5Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};
export const HeroSkeleton = () => {
  return (
    <div
      className="relative flex h-[56.25vw] w-full flex-col items-center justify-center overflow-hidden bg-gray-500/80 p-4
      before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
    ></div>
  );
};
