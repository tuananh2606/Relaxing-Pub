import styles from './header.module.scss';
import NavBar from '~/components/ui/navbar/NavBar';

const Header = () => {
  return (
    <header>
      <div
        className={` ${styles.mainHeader} fixed left-0 top-0 z-20 flex h-16 max-h-[70px] w-full items-center bg-header-bg px-[4%] lg:h-16 lg:bg-transparent`}
      >
        <NavBar />
      </div>
    </header>
  );
};

export default Header;
