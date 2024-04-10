import styles from './header.module.scss';
import { NavBar } from '~/layouts';

const Header = () => {
  return (
    <div
      className={` fixed left-0 top-0 z-50 flex h-[var(--navbar-height)] max-h-[70px] w-full items-center bg-transparent`}
    >
      <NavBar />
    </div>
  );
};

export default Header;
