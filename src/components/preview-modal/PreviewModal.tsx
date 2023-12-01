'use client';
import Image from 'next/image';
import styles from './preview-modal.module.scss';
import { Dispatch, SetStateAction } from 'react';

interface IPreviewModal {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

const PreviewModal = ({ setIsOpenModal }: IPreviewModal) => {
  return (
    <div className="animate-scale-in-center z-10 w-[850px] min-w-[850px] rounded-md bg-[#181818]">
      <div className="image-wrapper relative block w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_URL_IMAGES}/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg`}
          alt="Anh"
          width="0"
          height="0"
          sizes="100vw"
          className="h-auto w-full rounded-t-md"
          objectFit="contain"
        />
        <div className={`${styles.imageWrapper} absolute top-0 h-full w-full`}></div>
      </div>
      <div className="close-btn absolute right-0 top-0 m-[1em]">
        <button className="rounded-full bg-[#181818] p-[2px]" onClick={() => setIsOpenModal(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path
              d="M12.0007 10.9002L16.9504 5.95044L18.3646 7.36465L13.4149 12.3144L18.3646 17.2641L16.9504 18.6783L12.0007 13.7286L7.05093 18.6783L5.63672 17.2641L10.5865 12.3144L5.63672 7.36465L7.05093 5.95044L12.0007 10.9002Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      <div className="px-12 py-3">
        <div className="flex justify-between">
          <div className="flex-1">
            <span>2023</span>
            <span> ‧ Action/Sci-fi</span>
            <span> ‧ 2h 20m</span>
            <p>The continuing story of Miles Morales and the many other Spider-People from different realities.</p>
          </div>
          <div className="flex-1">
            <ul>
              <li>Dien vien</li>
              <li>The loai</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
