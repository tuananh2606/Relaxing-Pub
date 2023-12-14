import { useEffect, useRef, type CSSProperties } from 'react';
import Artplayer from 'artplayer';

interface IPlayerProps {
  option: any;
  getInstance: (art: Artplayer) => void;
  className?: string;
  style?: CSSProperties | undefined;
}

export default function ArtPlayer({ option, getInstance, ...rest }: IPlayerProps) {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
    });

    if (getInstance && typeof getInstance === 'function') {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, []);

  return <div ref={artRef} {...rest}></div>;
}
