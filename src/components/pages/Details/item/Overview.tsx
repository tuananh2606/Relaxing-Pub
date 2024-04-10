'use client';
import { useState } from 'react';
import { cn } from '~/lib/utils';

interface IOverview {
  overview: string | null | undefined;
}

const Overview = ({ overview }: IOverview) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  return (
    <div className="relative z-10 p-2 transition-all duration-200">
      <p className={(cn('break-words text-sm'), isExpand ? 'line-clamp-none' : 'line-clamp-3')}>{overview}</p>
      <button className="mt-2 block text-gray-100/50 md:hidden" onClick={() => setIsExpand((prev) => !prev)}>
        {isExpand ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
};
export default Overview;
