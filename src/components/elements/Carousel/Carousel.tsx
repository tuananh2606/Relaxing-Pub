'use client';
import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRightIcon, ChevronLeftIcon } from '@radix-ui/react-icons';
import { EmblaOptionsType, EmblaPluginType, EmblaCarouselType, EmblaEventType } from 'embla-carousel';

import styles from './carousel.module.scss';
import { cn } from '~/utils/misc';

type CarouselProps = {
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: EmblaOptionsType) => void;
};

interface Carousel {
  className?: string;
  options?: EmblaOptionsType;
  children: React.ReactNode;
  slidePerView?: string;
}

type CarouselSlide = Pick<Carousel, 'className' | 'children'>;

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = 'horizontal', options, setApi, plugins, className, children, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...options,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    );

    const logSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
      console.log(emblaApi);
    }, []);

    useEffect(() => {
      if (emblaApi) emblaApi.on('slidesInView', logSlidesInView);
    }, [emblaApi, logSlidesInView]);

    return (
      <div className={cn('relative', className)} ref={ref}>
        <div className="h-full overflow-hidden" ref={emblaRef} {...props}>
          {children}
        </div>
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex snap-x snap-mandatory scroll-px-6', styles.embla__container, className)}
        {...props}
      />
    );
  },
);
CarouselContent.displayName = 'CarouselContent';

const CarouselSlide = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn('min-w-0 shrink-0 grow-0 basis-full snap-start pl-2', className)}
        {...props}
      />
    );
  },
);

CarouselSlide.displayName = 'CarouselSlide';

export { Carousel, CarouselSlide, CarouselContent };
