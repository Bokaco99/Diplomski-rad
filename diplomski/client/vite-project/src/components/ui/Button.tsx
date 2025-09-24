import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type DugmeRezim = 'primary' | 'secondary' | 'ghost';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  rezim?: DugmeRezim;
  puneSirine?: boolean;
};

export function Dugme({ rezim = 'primary', className, puneSirine, ...rest }: Props) {
  const stil =
    rezim === 'primary'
      ? 'bg-primary text-white hover:bg-blue-700'
      : rezim === 'secondary'
      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
      : 'bg-transparent text-slate-700 hover:bg-slate-100';

  return (
    <button
      className={twMerge('btn rounded-xl', stil, puneSirine ? 'w-full' : '', className)}
      {...rest}
    />
  );
}
