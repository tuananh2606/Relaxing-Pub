'use client';
import { useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRightIcon, ChevronLeftIcon } from '@radix-ui/react-icons';
import { EmblaOptionsType, EmblaCarouselType, EmblaEventType } from 'embla-carousel';

import styles from './carousel.module.scss';
import { cn } from '~/utils/misc';

interface Carousel {
  className?: string;
  options?: EmblaOptionsType;
  children: React.ReactNode;
  slidePerView?: number;
}

type CarouselSlide = Pick<Carousel, 'className' | 'children' | 'slidePerView'>;
const Carousel = ({ className, options, children, ...props }: Carousel) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={cn('relative', className)}>
      <button
        className="absolute left-0 top-[50%] z-10 hidden rounded-full bg-gray-950 p-1 md:block"
        onClick={scrollPrev}
      >
        <ChevronLeftIcon width={30} height={30} />
      </button>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={cn(styles.embla__container)} {...props}>
          {children}
        </div>
      </div>
      <button
        className="absolute right-0 top-[50%] z-10 hidden rounded-full bg-gray-950 p-1 md:block "
        onClick={scrollNext}
      >
        <ChevronRightIcon width={30} height={30} />
      </button>
    </div>
  );
};

const CarouselParallax = ({ className, options, children, ...props }: Carousel) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const TWEEN_FACTOR_BASE = 0.2;

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  //Parallax
  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__parallax__layer') as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
        const tweenNode = tweenNodes!.current[slideIndex];
        if (tweenNode) {
          tweenNode!.style.transform = `translateX(${translate}%)`;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax);
  }, [emblaApi, tweenParallax]);

  return (
    <div className="relative">
      <button className="absolute left-0 top-[50%] z-10 rounded-full bg-gray-950 p-1" onClick={scrollPrev}>
        <ChevronLeftIcon width={30} height={30} />
      </button>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={cn(styles.embla__container, className)} {...props}>
          {children}
        </div>
      </div>
      <button className="absolute right-0 top-[50%] z-10 rounded-full bg-gray-950 p-1 " onClick={scrollNext}>
        <ChevronRightIcon width={30} height={30} />
      </button>
    </div>
  );
};

const CarouselSlide = ({ className, children, slidePerView }: CarouselSlide) => {
  let slide = `flex-[0_0_calc(100%_/_${slidePerView})]`;
  return <div className={cn(styles.embla__slide, className)}>{children}</div>;
};
export { Carousel, CarouselSlide, CarouselParallax };
