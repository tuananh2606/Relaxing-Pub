import React from 'react';

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="z-20 mt-auto flex items-center justify-center bg-secondary">
      <div className="px-6 py-6">
        <ul className="columns-2 md:columns-4">
          <li>
            <a href="#">FAQ</a>
          </li>
          <li>
            <a href="#">Investor Relations</a>
          </li>
          <li>
            <a href="#">Privacy</a>
          </li>
        </ul>
        {/* <div className={cn('list')}>
          <div className={cn('column')}>
            <a href="#">Account</a>
            <a href="#">Ways to Watch</a>
            <a href="#">Corporate Information</a>
            <a href="#">Only on Netflix</a>
          </div>
          <div className={cn('column')}>
            <a href="#">Media Center</a>
            <a href="#">Terms of Use</a>
            <a href="#">Contact Us</a>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
