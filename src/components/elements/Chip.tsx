import { Chip as ChipNextUI } from '@nextui-org/react';

const Chip = () => {
  return (
    <ChipNextUI
      variant="shadow"
      classNames={{
        base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
        content: 'drop-shadow shadow-black text-white',
      }}
    >
      New
    </ChipNextUI>
  );
};
export default Chip;
