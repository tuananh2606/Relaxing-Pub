'use client';
import React from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import styles from './carousel.module.scss';
import { cn } from '~/lib/utils';

interface Carousel {
  className?: string;
  children: React.ReactNode;
  slidePerView?: string;
  title: string;
}

interface CarouselProps<T> {
  readonly items: T[] | undefined;
  readonly renderItem: (props: CarouselRenderItemProps<T>) => React.ReactElement<CarouselItemProps>;
  classNames?: {
    wrapper?: string;
    carouselWrapper?: string;
    control?: string;
  };
  title?: string;
  pagination?: boolean;
  to?: string;
  pageIndicator?: boolean;
  navigation?: boolean;
}

interface CarouselRenderItemProps<T> {
  readonly idx?: number;
  readonly item: T;
  readonly isSnapPoint: boolean;
}

const Carousel = <T extends any>({
  items,
  title,
  to,
  pagination = false,
  classNames,
  pageIndicator,
  navigation,
  renderItem,
}: CarouselProps<T>) => {
  const { scrollRef, pages, activePageIndex, prev, next, goTo, snapPointIndexes } = useSnapCarousel();
  return (
    <div className={cn(classNames?.wrapper)}>
      {navigation || title ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="ml-2 flex w-full items-center justify-between md:flex-col md:items-start">
              {title ? <h1 className="text-2xl font-bold md:text-3xl">{title}</h1> : null}
              <Link className="text-xs md:mt-2" href={to || '#'}>
                <Button size="sm" variant="ghost" radius="sm">
                  Xem thêm
                </Button>
              </Link>
            </div>

            {navigation ?? (
              <div className={cn('flex justify-end', classNames?.control)} aria-hidden>
                <button
                  className={cn(styles.embla__button, activePageIndex <= 0 ? 'opacity-30' : '')}
                  onClick={() => prev()}
                >
                  <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
                    <path
                      fill="currentColor"
                      d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                    />
                  </svg>
                </button>

                <button
                  className={cn(
                    '!ml-2',
                    styles.embla__button,
                    activePageIndex === pages.length - 1 ? 'opacity-30' : '',
                  )}
                  onClick={() => next()}
                >
                  <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
                    <path
                      fill="currentColor"
                      d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}
      <ul
        className={cn('relative flex snap-x snap-mandatory overflow-auto', classNames?.carouselWrapper)}
        ref={scrollRef}
      >
        {items?.map((item, i) =>
          renderItem({
            item,
            idx: i,
            isSnapPoint: snapPointIndexes.has(i),
          }),
        )}
      </ul>
      {pagination &&
        pages.map((_, i) => (
          <button
            key={i}
            // style={{
            //   ...styles.paginationButton,
            //   ...(activePageIndex === i ? styles.paginationButtonActive : {}),
            // }}
            onClick={() => goTo(i)}
          >
            {i + 1}
          </button>
        ))}
      {pageIndicator && (
        <div className="flex justify-center">
          {activePageIndex + 1} / {pages.length}
        </div>
      )}
    </div>
  );
};

interface CarouselItemProps {
  readonly isSnapPoint: boolean;
  readonly children?: React.ReactNode;
  className?: string;
}

const CarouselItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement> & CarouselItemProps>(
  ({ isSnapPoint, children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn('flex-shrink-0', className, isSnapPoint ? 'snap-start' : '')} {...props}>
        {children}
      </li>
    );
  },
);
CarouselItem.displayName = 'CarouselItem';

export { Carousel, CarouselItem };
