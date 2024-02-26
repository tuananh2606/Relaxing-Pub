import { cn } from '~/utils/misc';
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(`${shimmer} relative h-80 w-52 overflow-hidden rounded-xl  bg-gray-500/80 shadow-sm`, className)}
    >
      <div className="h-full w-full  bg-[rgba(255,255,255,0.2)]" />
    </div>
  );
}

export const HomePageSkeleton = () => {
  return (
    <div className="mt-16 px-2">
      <div
        className="relative flex h-[56.25vw] w-full flex-col items-center justify-center overflow-hidden bg-gray-500/80 p-4
      before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent md:min-h-screen"
      ></div>
      <div className="mt-4 flex justify-between  md:hidden">
        <CardSkeleton />
        <CardSkeleton className="ml-1" />
      </div>
    </div>
  );
};
