import styles from './header.module.scss';

const Header = () => {
  return (
    <header>
      <div
        className={` ${styles.mainHeader} fixed left-0 top-0 z-10 flex h-14 min-h-[70px] w-full items-center bg-header-bg px-[4%] lg:h-16 lg:bg-transparent`}
      >
        <a>Logo</a>
        <ul className="primary-navigation flex items-center">
          <li className={styles.navTab}>Trang chủ</li>
          <li className={styles.navTab}>Phim</li>
          <li className={styles.navTab}>Mới & Phổ biến</li>
          <li className={styles.navTab}>Danh sách của tôi</li>
        </ul>
        <div className="secondary-navigation flex flex-grow items-center justify-end">
          <div className={styles.navElement}>
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
          <div className={styles.navElement}>User</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
