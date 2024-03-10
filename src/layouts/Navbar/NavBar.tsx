'use client';
import styles from './navbar.module.scss';
import { useState } from 'react';
import { cn } from '~/utils/misc';
import Link from 'next/link';
import Lottie from 'lottie-react';
import likeAnimation from '~/lib/lotties/likeAnimation.json';

const NavBar = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const handleOpen = () => {
    setToggle((p) => !p);
  };
  return (
    <>
      <div className="inline-flex items-center align-middle">
        <div className="lg:hidden">
          <button onClick={handleOpen}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 24 25" fill="none">
              <path
                d="M16 18.3137V20.3137H5V18.3137H16ZM21 11.3137V13.3137H3V11.3137H21ZM19 4.31372V6.31372H8V4.31372H19Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center">
          <Lottie animationData={likeAnimation} loop={false} className="-mt-[10px] size-16" />
          <span className="font-semibold">FILMPUB</span>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 mt-14 h-full bg-black md:inset-[0_70%_0_0] lg:relative lg:left-0 lg:mt-0 lg:flex lg:w-full lg:translate-x-0 lg:items-center lg:bg-transparent',

          toggle ? 'animate-in slide-in-from-left' : '-translate-x-full',
        )}
      >
        <div className="primary-navigation mt-4 flex items-center lg:mt-0">
          <ul className="w-full px-4 lg:flex">
            <li className={styles.navTab}>
              <Link className="inline-flex align-middle" href="/">
                <svg
                  className="block lg:hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20C20 20.5523 19.5523 21 19 21ZM6 19H18V9.15745L12 3.7029L6 9.15745V19Z"></path>
                </svg>
                <span className="ml-3">Trang chủ</span>
              </Link>
            </li>
            <Link className="inline-flex align-middle" href="/movies">
              <li className={styles.navTab}>Phim</li>
            </Link>

            <li className={styles.navTab}>Mới & Phổ biến</li>
            <li className={styles.navTab}>Danh sách của tôi</li>
          </ul>
        </div>
        <div className="secondary-navigation flex flex-grow flex-col justify-end px-4 lg:flex-row lg:items-center">
          <div className={`${styles.navElement} hidden lg:block`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path
                d="M16.031 14.6168L20.3137 18.8995L18.8995 20.3137L14.6168 16.031C13.0769 17.263 11.124 18 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18 11.124 17.263 13.0769 16.031 14.6168ZM14.0247 13.8748C15.2475 12.6146 16 10.8956 16 9C16 5.1325 12.8675 2 9 2C5.1325 2 2 5.1325 2 9C2 12.8675 5.1325 16 9 16C10.8956 16 12.6146 15.2475 13.8748 14.0247L14.0247 13.8748Z"
                fill="white"
              />
            </svg>
          </div>
          <div className={styles.navElement}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 17H22V19H2V17H4V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V17ZM18 17V10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V17H18ZM9 21H15V23H9V21Z"
                fill="white"
              />
            </svg>
          </div>
          <div className={styles.navElement}>Người dùng</div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
