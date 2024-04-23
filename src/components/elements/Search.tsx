'use client';
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Input,
  Divider,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Listbox,
  ListboxItem,
  useDisclosure,
  Card,
  CardBody,
} from '@nextui-org/react';
import { IoIosSearch } from 'react-icons/io';
import { PiTelevisionSimpleLight } from 'react-icons/pi';
import { MdLocalMovies } from 'react-icons/md';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useClickOutside, useMediaQuery } from '@react-hookz/web';
import { useRouter } from 'next-nprogress-bar';
import Link from 'next/link';

import Image from './Image';
import { getSearchAll, getSearchMovies, getSearchTv } from '~/services/tmdb/tmdb.server';
import { IMedia } from '~/types/media';
import useDebounce from '~/hooks/useDebounce';

const Search = () => {
  const [value, setValue] = useState<string>('all');
  const [open, setOpen] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchTerm, debouncedQuery, setSearchTerm] = useDebounce('', 300);
  const [data, setData] = useState<{ results: IMedia[] }>({
    results: [],
  });

  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useClickOutside(ref, () => {
    setOpen(false);
  });

  const isSm = useMediaQuery('(max-width: 426px)', { initializeWithValue: false });

  const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };
  const newItems = [
    ...data.results.slice(0, 6),
    ...(debouncedQuery
      ? [{ id: 'viewmore', title: `View all results for "${debouncedQuery}"`, mediaType: 'more' }]
      : []),
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedQuery !== '') {
        switch (value) {
          case 'all':
            const resAll = await getSearchAll(debouncedQuery);
            if (resAll) setData({ results: resAll.results as IMedia[] });
            break;
          case 'tv':
            const resTv = await getSearchTv(debouncedQuery);
            if (resTv) setData({ results: resTv.results as IMedia[] });
            break;
          case 'movie':
            const resMovie = await getSearchMovies(debouncedQuery);
            if (resMovie) setData({ results: resMovie.results as IMedia[] });
            break;
        }
      } else setData({ results: [] });
    };
    fetchData();
  }, [debouncedQuery, value]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(false);
    setSearchTerm('');
    if (value === 'all') router.push(`/search?q=${debouncedQuery}`);
    if (value === 'movie') router.push(`/search/movie?q=${debouncedQuery}`);
    if (value === 'tv') router.push(`/search/tv?q=${debouncedQuery}`);
  };

  const handleSubmit = (e: any) => {
    e.continuePropagation();
    if (e.keyCode === 13 && debouncedQuery !== '') {
      onSubmit(e);
    }
  };

  return (
    <>
      {isSm ? (
        <>
          <Button variant="light" isIconOnly aria-label="Search" onPress={onOpen}>
            <IoIosSearch size="1.5rem" />
          </Button>
          <Modal
            hideCloseButton
            className="mt-[var(--navbar-height)]"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: 'easeOut',
                  },
                },
                exit: {
                  y: -20,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                    ease: 'easeIn',
                  },
                },
              },
            }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="p-0 ">
                    <Input
                      isClearable
                      radius="none"
                      classNames={{
                        label: 'text-black/50 dark:text-white/90',
                        input: [
                          'bg-transparent',
                          'text-black/90 dark:text-white/90',
                          'placeholder:text-default-700/50 dark:placeholder:text-white/60',
                        ],

                        innerWrapper: 'bg-transparent',
                        inputWrapper: [
                          'bg-transparent',
                          'p-0',
                          'shadow-xl',
                          'backdrop-blur-xl',
                          'backdrop-saturate-200',
                          '!cursor-text',
                        ],
                      }}
                      placeholder="Type to search..."
                      startContent={
                        <Select
                          autoFocus={false}
                          selectedKeys={[value]}
                          onChange={handleSelectionChange}
                          aria-label="Select search type"
                          classNames={{
                            base: 'w-20 border-e-1 h-full border-solid',
                            mainWrapper: 'h-full',
                            popoverContent: 'w-36',
                            value: 'text-xs text-center',
                            trigger:
                              'h-full rounded-e-none rounded-s-[8px] px-0 bg-transparent min-h-9 py-1 group-data-[focus=true]:bg-transparent',
                            selectorIcon: 'right-[0.5rem]',
                          }}
                        >
                          <SelectItem className="text-sm" key="all" startContent={<IoIosSearch size="1.5em" />}>
                            All
                          </SelectItem>
                          <SelectItem className="text-sm" key="movie" startContent={<MdLocalMovies size="1.5em" />}>
                            Movies
                          </SelectItem>
                          <SelectItem key="tv" startContent={<PiTelevisionSimpleLight size="1.5em" />}>
                            TV
                          </SelectItem>
                        </Select>
                      }
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                  </ModalHeader>
                  <Divider />
                  <ModalBody className="px-0">
                    <Listbox
                      className="max-h-[70vh] overflow-y-auto"
                      disallowEmptySelection
                      aria-label="Suggestions"
                      items={newItems}
                      classNames={{
                        list: 'h-full [&_li]:h-full',
                      }}
                      emptyContent={
                        <div className="flex h-32 items-center justify-center">
                          <p>No recent searches</p>
                        </div>
                      }
                    >
                      {(item) => (
                        <ListboxItem
                          className="mt-1 p-0"
                          key={item.id as number}
                          textValue={item.title as string}
                          onPress={onClose}
                          href={`/${item.mediaType}/${item.id}`}
                        >
                          <Card isBlurred>
                            <CardBody className="w-full">
                              <div className="flex items-center ">
                                {(item as IMedia).posterPath! ? (
                                  <Image
                                    alt="Anh"
                                    src={(item as IMedia).posterPath!}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="aspect-[2/3] h-auto w-full rounded-none"
                                    classNames={{
                                      wrapper: 'w-8',
                                    }}
                                  />
                                ) : null}
                                <span className="ml-4 flex-1">{item.title as string}</span>
                              </div>
                            </CardBody>
                          </Card>
                        </ListboxItem>
                      )}
                    </Listbox>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <Autocomplete
            classNames={{
              listboxWrapper: 'max-h-[320px]',
              selectorButton: 'hidden',
            }}
            items={newItems}
            inputProps={{
              classNames: {
                input: 'ml-1 w-[70%]',
                inputWrapper: 'h-10 pl-0',
              },
            }}
            allowsEmptyCollection
            listboxProps={{
              hideSelectedIcon: true,
              itemClasses: {
                base: [
                  'rounded-medium',
                  'text-default-500',
                  'transition-opacity',
                  'data-[hover=true]:text-foreground',
                  'dark:data-[hover=true]:bg-default-50',
                  'data-[pressed=true]:opacity-70',
                  'data-[hover=true]:bg-default-200',
                  'data-[selectable=true]:focus:bg-default-100',
                  'data-[focus-visible=true]:ring-default-500',
                ],
              },
            }}
            aria-label="Search"
            placeholder="Type to search..."
            popoverProps={{
              offset: 10,
              classNames: {
                base: 'rounded-large',
                content: 'p-1 border-small border-default-100 bg-background',
              },
            }}
            startContent={
              <Select
                selectedKeys={[value]}
                onChange={handleSelectionChange}
                aria-label="Select search type"
                classNames={{
                  base: 'w-20 border-e-1 border-solid',
                  popoverContent: 'w-36',
                  value: 'text-xs text-center',
                  trigger:
                    'h-full rounded-e-none rounded-s-[8px] px-0 bg-transparent min-h-9 py-1 group-data-[focus=true]:bg-transparent',
                  selectorIcon: 'right-[0.5rem]',
                }}
              >
                <SelectItem className="text-sm" key="all" startContent={<IoIosSearch size="1.5em" />}>
                  All
                </SelectItem>
                <SelectItem className="text-sm" key="movie" startContent={<MdLocalMovies size="1.5em" />}>
                  Movies
                </SelectItem>
                <SelectItem key="tv" startContent={<PiTelevisionSimpleLight size="1.5em" />}>
                  TV
                </SelectItem>
              </Select>
            }
            endContent={<IoIosSearch size="1.5em" />}
            allowsCustomValue
            variant="bordered"
            isClearable
            onInputChange={setSearchTerm}
            onKeyDown={handleSubmit}
          >
            {(item) => (
              <AutocompleteItem
                key={item.id as string}
                startContent={<IoIosSearch size="1.25em" />}
                textValue={item.title as string}
              >
                <Link className="block w-full" href={`/${item.mediaType}/${item.id}`}>
                  <div className="flex items-center ">
                    {(item as IMedia).posterPath! ? (
                      <Image
                        alt="Anh"
                        src={(item as IMedia).posterPath!}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="aspect-[2/3] h-auto w-full rounded-none"
                        classNames={{
                          wrapper: 'w-8',
                        }}
                      />
                    ) : null}
                    <span className="ml-4 flex-1">{item.title as string}</span>
                  </div>
                </Link>
              </AutocompleteItem>
            )}
          </Autocomplete>
        </form>
      )}
    </>
  );
};
export default Search;
