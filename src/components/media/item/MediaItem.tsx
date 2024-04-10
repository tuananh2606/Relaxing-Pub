import { useMediaQuery } from '@react-hookz/web';
import { useRouter } from 'next-nprogress-bar';
import { Card, CardBody, CardFooter, Image as NextImage } from '@nextui-org/react';
import Image from 'next/image';
import { tv } from 'tailwind-variants';

import { IMedia } from '~/types/media';
import { useFilmPubSettings } from '~/hooks/useLocalStorage';
import { cn } from '~/lib/utils';
import { ScrollArea, ScrollBar, ScrollCorner, ScrollViewport } from '~/components/ui/scroll-area';

interface IMediaItem {
  item: IMedia;
}

const cardItemStyles = tv({
  slots: {
    base: '!w-[164px] data-[hover=true]:ring-2 data-[hover=true]:ring-focus',
    body: '',
    imageContainer: '',
    image: 'w-full h-auto',
    content: '',
    footer: '',
  },
  variants: {
    listViewType: {
      card: {
        base: '!w-full',
        body: 'w-full overflow-hidden p-0 flex-none',
        imageContainer: '!max-w-none h-full focus:outline-none',
        content: 'hidden',
        image: 'z-0 rounded-xl aspect-[3/2]',
        footer: '3xl:text-2xl justify-center px-2 py-2 xl:text-xl',
      },
      detail: {
        base: '!w-full',
        body: 'flex !h-[174px] w-full !flex-row !overflow-hidden p-0 sm:aspect-[5/3] sm:!h-[auto]',
        imageContainer: 'w-[116px] focus:outline-none sm:w-2/5 !max-w-none h-full',
        image: 'z-0 !h-[174px] !min-h-[auto] !min-w-[116px] sm:aspect-[2/3] sm:!h-[auto]',
        content: 'flex grow flex-col gap-y-4 p-3 sm:w-3/5',
        footer:
          'absolute bottom-0 flex !w-[116px] justify-center border-t border-divider backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-focus sm:!w-2/5',
      },
      table: {
        base: '!w-full',
        body: 'flex !h-[174px] w-full !flex-row !overflow-hidden p-0',
        imageContainer: 'w-[116px] focus:outline-none',
        image: 'z-0 !h-[174px] !min-h-[auto] !min-w-[116px]',
        content: 'flex grow flex-col gap-y-4 p-3',
        footer: 'hidden',
      },
      coverCard: {
        base: '!w-[280px] sm:!w-[480px]',
        body: 'aspect-[16/9] w-full overflow-hidden p-0',
        image: 'z-0 aspect-[16/9] !min-h-[auto] !min-w-[auto] overflow-hidden !transition-[transform,_opacity]',
        footer: 'absolute bottom-0 flex justify-center border-t border-divider backdrop-blur-md',
      },
      people: {
        base: '!w-[164px]',
        body: 'aspect-[2/3] w-full overflow-hidden p-0',
        imageContainer: 'h-full w-full focus:outline-none',
        image: 'z-0 aspect-[2/3] !min-h-[auto] !min-w-[auto] overflow-hidden !transition-[transform,_opacity]',
        footer:
          'flex min-h-[5.25rem] max-w-[164px] flex-col items-start justify-start focus:outline-none focus:ring-2 focus:ring-inset focus:ring-focus',
      },
    },
  },
  compoundVariants: [],
  compoundSlots: [],
});

const MediaItem = ({ item }: IMediaItem) => {
  const { listViewType } = useFilmPubSettings();
  const router = useRouter();
  const isSm = useMediaQuery('(max-width: 768px)', { initializeWithValue: false });
  const { base, body, imageContainer, image, content, footer } = cardItemStyles({
    listViewType:
      listViewType?.value === 'card'
        ? 'card'
        : listViewType?.value === 'detail'
          ? 'detail'
          : listViewType?.value === 'table'
            ? 'table'
            : 'card',
  });
  const imageCard = listViewType?.value === 'card' ? item.backdropPath : item.posterPath;

  return (
    //<Link href={`/${item.mediaType}/${item.id}`}>
    <Card
      isHoverable
      isFooterBlurred
      isPressable
      className={base()}
      onPress={() => {
        router.replace(`/${item.mediaType}/${item.id}`);
      }}
    >
      <CardBody className={cn('overflow-visible p-0', body())}>
        <NextImage
          as={Image}
          alt="Card background"
          height={0}
          width={0}
          sizes="100vw"
          fallbackSrc="/placeholder-gray.jpg"
          className={cn(image())}
          src={imageCard || '/'}
          classNames={{
            wrapper: `${imageContainer()}`,
          }}
        />
        <div className={cn(content())}>
          <div>
            <h6 className="text-base lg:text-xl">{`${item.title || item.name}`}</h6>
            <h6 className="text-xs lg:text-sm xl:text-base">{`${item.releaseDate}`}</h6>
          </div>
          <ScrollArea
            scrollHideDelay={400}
            style={{
              height: 'calc(100% - 5rem)',
              width: '100%',
            }}
          >
            <ScrollViewport>
              <p className="text-sm">{item.overview}</p>
              <ScrollBar />
              <ScrollCorner />
            </ScrollViewport>
          </ScrollArea>
        </div>
      </CardBody>
      <CardFooter className={cn(footer())}>
        <h4 className="line-clamp-2 text-center">{item.title as string}</h4>
      </CardFooter>
    </Card>
    //</Link>
  );
};

export default MediaItem;
