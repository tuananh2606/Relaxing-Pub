'use client';
import React, { PropsWithChildren, useCallback, useEffect, useState, CSSProperties } from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType, EmblaPluginType, EmblaCarouselType, EmblaEventType } from 'embla-carousel';
import { SlotsToClasses } from '@nextui-org/react';
import styles from './carousel.module.scss';
import { cn } from '~/utils/misc';

// type CarouselProps = {
//   options?: EmblaOptionsType;
//   plugins?: EmblaPluginType[];
//   orientation?: 'horizontal' | 'vertical';
//   setApi?: (api: EmblaOptionsType) => void;
// };

interface Carousel {
  className?: string;
  options?: EmblaOptionsType;
  children: React.ReactNode;
  slidePerView?: string;
  title: string;
}

type CarouselSlide = Pick<Carousel, 'className' | 'children'>;

// const EmblaCarousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
//   ({ orientation = 'horizontal', options, setApi, plugins, className, children, ...props }, ref) => {
//     const [emblaRef, emblaApi] = useEmblaCarousel(
//       {
//         ...options,
//         axis: orientation === 'horizontal' ? 'x' : 'y',
//       },
//       plugins,
//     );
//     const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

//     return (
//       <>
//         <div className={cn('flex justify-end gap-2')}>
//           <CarouselPreviousButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
//           <CarouselNextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
//         </div>

//         <div className={cn('relative', className)} ref={ref}>
//           <div className="h-full" ref={emblaRef} {...props}>
//             {children}
//           </div>
//         </div>
//       </>
//     );
//   },
// );

// EmblaCarousel.displayName = 'EmblaCarousel';

// const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   ({ className, ...props }, ref) => {
//     return (
//       <div
//         ref={ref}
//         className={cn('flex snap-x snap-mandatory scroll-px-6', styles.embla__container, className)}
//         {...props}
//       />
//     );
//   },
// );
// CarouselContent.displayName = 'CarouselContent';

// const CarouselSlide = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//   ({ className, ...props }, ref) => {
//     return (
//       <div
//         ref={ref}
//         role="group"
//         aria-roledescription="slide"
//         className={cn('min-w-0 shrink-0 grow-0 basis-full snap-start pl-2', className)}
//         {...props}
//       />
//     );
//   },
// );

// CarouselSlide.displayName = 'CarouselSlide';

// type UsePrevNextButtonsType = {
//   prevBtnDisabled: boolean;
//   nextBtnDisabled: boolean;
//   onPrevButtonClick: () => void;
//   onNextButtonClick: () => void;
// };

// const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined): UsePrevNextButtonsType => {
//   const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
//   const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

//   const onPrevButtonClick = useCallback(() => {
//     if (!emblaApi) return;
//     emblaApi.scrollPrev();
//   }, [emblaApi]);

//   const onNextButtonClick = useCallback(() => {
//     if (!emblaApi) return;
//     emblaApi.scrollNext();
//   }, [emblaApi]);

//   const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
//     setPrevBtnDisabled(!emblaApi.canScrollPrev());
//     setNextBtnDisabled(!emblaApi.canScrollNext());
//   }, []);

//   useEffect(() => {
//     if (!emblaApi) return;

//     onSelect(emblaApi);
//     emblaApi.on('reInit', onSelect);
//     emblaApi.on('select', onSelect);
//   }, [emblaApi, onSelect]);

//   return {
//     prevBtnDisabled,
//     nextBtnDisabled,
//     onPrevButtonClick,
//     onNextButtonClick,
//   };
// };

// const CarouselPreviousButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
//   ({ className, ...props }, ref) => {
//     return (
//       <button ref={ref} className={cn(styles.embla__button, className)} {...props}>
//         <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
//           <path
//             fill="currentColor"
//             d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
//           />
//         </svg>
//         <span className="sr-only">Previous slide</span>
//       </button>
//     );
//   },
// );
// CarouselPreviousButton.displayName = 'CarouselPreviousButton';

// const CarouselNextButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
//   ({ className, ...props }, ref) => {
//     return (
//       <button ref={ref} className={cn(styles.embla__button, className)} {...props}>
//         <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
//           <path
//             fill="currentColor"
//             d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
//           />
//         </svg>
//         <span className="sr-only">Next slide</span>
//       </button>
//     );
//   },
// );
// CarouselNextButton.displayName = 'CarouselNextButton';

// const Carousel = ({ children, title }: Carousel) => {
//   useEffect(() => {
//     const content = document.querySelector('.carousel-content');
//     const prevBtn = document.querySelector('.prev-btn');
//     const nextBtn = document.querySelector('.next-btn');

//     if (content!.scrollLeft <= 0) {
//       prevBtn!.setAttribute('disabled', '');
//     }

//     if (content!.scrollLeft === content!.scrollWidth - content!.clientWidth) {
//       nextBtn!.setAttribute('disabled', '');
//     }

//     const handlePrev = () => {
//       if (content) {
//         nextBtn!.removeAttribute('disabled');
//         content.scrollTo({
//           left: content.scrollLeft - content.firstElementChild!.clientWidth,
//           behavior: 'smooth',
//         });
//       }
//     };

//     const handleNext = () => {
//       if (content) {
//         prevBtn!.removeAttribute('disabled');
//         content.scrollTo({
//           left: content.scrollLeft + content.firstElementChild!.clientWidth,
//           behavior: 'smooth',
//         });
//       }
//     };

//     const handleCanScroll = () => {
//       if (content) {
//         const trackScrollWidth = content.scrollWidth;
//         const trackOuterWidth = content.clientWidth;

//         prevBtn!.removeAttribute('disabled');
//         nextBtn!.removeAttribute('disabled');

//         if (content.scrollLeft <= 24) {
//           prevBtn!.setAttribute('disabled', '');
//         }

//         if (Math.ceil(content!.scrollLeft) >= trackScrollWidth - trackOuterWidth) {
//           nextBtn!.setAttribute('disabled', '');
//         }
//       }
//     };

//     if (content) {
//       prevBtn!.addEventListener('click', handlePrev);
//       nextBtn!.addEventListener('click', handleNext);
//       content.addEventListener('scroll', handleCanScroll);
//     }

//     return () => {
//       prevBtn!.removeEventListener('click', handlePrev);
//       nextBtn!.removeEventListener('click', handleNext);
//       content!.removeEventListener('scroll', handleCanScroll);
//     };
//   }, []);
//   return (
//     <>
//       <div className="flex items-center justify-between py-5 ps-6">
//         <div>
//           <h3 className="text-3xl ">{title}</h3>
//         </div>
//         <div className="hidden gap-2 md:flex">
//           <CarouselPreviousButton className="prev-btn" />
//           <CarouselNextButton className="next-btn" />
//         </div>
//       </div>
//       {children}
//     </>
//   );
// };

// const styles = {
//   root: {},
//   scroll: {
//     position: 'relative',
//     display: 'flex',
//     overflow: 'auto',
//     scrollSnapType: 'x mandatory',
//   },
//   item: {
//     width: '250px',
//     height: '250px',
//     flexShrink: 0,
//   },
//   itemSnapPoint: {
//     scrollSnapAlign: 'start',
//   },
//   nextPrevButton: {},
//   nextPrevButtonDisabled: { opacity: 0.3 },
//   pagination: {
//     display: 'flex',
//   },
//   paginationButton: {
//     margin: '10px',
//   },
//   paginationButtonActive: { opacity: 0.3 },
//   pageIndicator: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
// } satisfies Record<string, CSSProperties>;

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
  pageIndicator?: boolean;
}

interface CarouselRenderItemProps<T> {
  readonly idx?: number;
  readonly item: T;
  readonly isSnapPoint: boolean;
}

const Carousel = <T extends any>({
  items,
  title,
  pagination = false,
  classNames,
  pageIndicator,
  renderItem,
}: CarouselProps<T>) => {
  const { scrollRef, pages, activePageIndex, prev, next, goTo, snapPointIndexes } = useSnapCarousel();
  return (
    <div className={cn(classNames?.wrapper)}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="ml-2 text-3xl font-bold">{title}</h1>
        <div className={cn('flex justify-end', classNames?.control)} aria-hidden>
          <button className={cn(styles.embla__button, activePageIndex <= 0 ? 'opacity-30' : '')} onClick={() => prev()}>
            <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
              <path
                fill="currentColor"
                d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
              />
            </svg>
          </button>

          <button
            className={cn('!ml-2', styles.embla__button, activePageIndex === pages.length - 1 ? 'opacity-30' : '')}
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
      </div>

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

// const ControlsGroup = ({}) => {
//   const { pages, activePageIndex, prev, next, goTo } = useSnapCarousel();
//   return (
//     <div style={styles.controls} aria-hidden>
//       <button
//         style={{
//           ...styles.nextPrevButton,
//           ...(activePageIndex <= 0 ? styles.nextPrevButtonDisabled : {}),
//         }}
//         onClick={() => prev()}
//       >
//         Prev
//       </button>
//       {pages.map((_, i) => (
//         <button
//           key={i}
//           style={{
//             ...styles.paginationButton,
//             ...(activePageIndex === i ? styles.paginationButtonActive : {}),
//           }}
//           onClick={() => goTo(i)}
//         >
//           {i + 1}
//         </button>
//       ))}
//       <button
//         style={{
//           ...styles.nextPrevButton,
//           ...(activePageIndex === pages.length - 1 ? styles.nextPrevButtonDisabled : {}),
//         }}
//         onClick={() => next()}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// const CarouselNextButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
//   ({ className, ...props }, ref) => {
//     return (
//       <button ref={ref} className={cn(styles.embla__button, className)} {...props}>
//         <svg className={styles.embla__button__svg} viewBox="0 0 532 532">
//           <path
//             fill="currentColor"
//             d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
//           />
//         </svg>
//         <span className="sr-only">Next slide</span>
//       </button>
//     );
//   },
// );

const CarouselItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement> & CarouselItemProps>(
  ({ isSnapPoint, children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn(' flex-shrink-0 snap-start', className, isSnapPoint ? 'snap-start' : '')} {...props}>
        {children}
      </li>
    );
  },
);
CarouselItem.displayName = 'CarouselItem';

export { Carousel, CarouselItem };
