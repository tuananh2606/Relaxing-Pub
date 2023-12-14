import Skeleton from 'react-loading-skeleton';
const PreviewModalSkeleton = () => {
  const shimmer = `absolute overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;
  return (
    <div className="w-[850px] min-w-[850px] animate-scale-in-center rounded-md bg-[#181818]">
      <div className="image-wrapper relative block w-full">
        <div className="h-auto w-full rounded-t-md" />
        <Skeleton height="45vw" className="!bg-gray-300/80" />
      </div>
      {/* <div className={`bg-gray-900 h-7 w-2/5 rounded-lg ${shimmer}`} />
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="bg-gray-900 h-6 w-2/6 rounded-lg" />
          <div className="bg-gray-900 h-4 w-1/6 rounded-lg" />
          <div className="bg-gray-900 h-4 w-full rounded-lg" />
          <div className="bg-gray-900 h-4 w-4/6 rounded-lg" />
        </div>
        <div className="space-y-4">
          <div className="bg-gray-900 h-6 w-2/6 rounded-lg" />
          <div className="bg-gray-900 h-4 w-1/6 rounded-lg" />
          <div className="bg-gray-900 h-4 w-full rounded-lg" />
          <div className="bg-gray-900 h-4 w-4/6 rounded-lg" />
        </div>
      </div> */}
    </div>
  );
};

export default PreviewModalSkeleton;
