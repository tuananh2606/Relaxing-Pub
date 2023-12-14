import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
  return (
    <div className="relative pt-[56.25%]">
      <div className="absolute left-0 top-0 h-full w-full">
        <Skeleton height="100%" width="100%" />
      </div>
    </div>
  );
}
