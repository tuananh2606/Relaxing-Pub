import React from 'react';
import { cn } from '~/utils/misc';

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="flex items-center justify-center bg-primary">
      <div className="px-6 py-16">
        <a className="" href="#">
          Questions? Contact us.
        </a>
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
          <li>
            <a href="#">Speed Test</a>
          </li>
          <li>
            <a href="#">Help Center</a>
          </li>
          <li>
            <a href="#">Jobs</a>
          </li>
          <li>
            <a href="#">Cookies Preferences</a>
          </li>
          <li>
            <a href="#">Legal Notices</a>
          </li>
          <li>
            <a href="#">Account</a>
          </li>
          <li>
            <a href="#">Ways to Watch</a>
          </li>
          <li>
            <a href="#">Corporate Information</a>
          </li>
          <li>
            <a href="#">Only on Netflix</a>
          </li>
          <li>
            <a href="#">Media Center</a>
          </li>
          <li>
            <a href="#">Terms of Use</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
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
