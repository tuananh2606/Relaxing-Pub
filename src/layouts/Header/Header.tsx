import styles from './header.module.scss';
import { NavBar } from '~/layouts';

const Header = () => {
  return (
    <header>
      <nav
        className={` ${styles.mainHeader} fixed left-0 top-0 z-20 flex h-16 max-h-[70px] w-full items-center bg-transparent px-[4%] lg:h-16`}
      >
        <NavBar />
      </nav>
    </header>
  );
};

export default Header;
