import { IMediaList } from '~/services/tmdb/tmdb.types';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import Image from 'next/image';
import { Image as NextUIImage } from '@nextui-org/react';

type Props = {
  title: string;
  items: IMediaList | undefined;
};

const LatestMedia = ({ items, title }: Props) => {
  return (
    <section>
      <h1 className="m-6 pl-6 text-3xl">{title}</h1>
      <div className="grid grid-cols-[repeat(2,_minmax(200px,_1fr))] gap-2 md:grid-cols-[repeat(6,_minmax(200px,_1fr))]">
        {items?.results?.map((item, idx) => (
          <Card key={idx} className="w-full">
            <CardBody className="w-full overflow-visible p-0">
              <NextUIImage
                as={Image}
                alt="Card background"
                className="h-auto w-full rounded-xl"
                src={item.posterPath}
                priority
                width={0}
                height={0}
                sizes="100vw"
                classNames={{
                  wrapper: '!max-w-full',
                }}
              />
            </CardBody>
            <CardFooter>
              <p className="text-tiny font-bold uppercase">Daily Mix</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="text-large font-bold">Frontend Radio</h4>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LatestMedia;
