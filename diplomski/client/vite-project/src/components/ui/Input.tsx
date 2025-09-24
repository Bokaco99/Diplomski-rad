import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  opis?: string;
  greska?: string;
};

export const Unos = forwardRef<HTMLInputElement, Props>(function Unos(
  { label, opis, greska, className, ...rest },
  ref
) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-sm font-medium text-slate-700">{label}</div>}
      <input ref={ref} className={twMerge('input', className)} {...rest} />
      {opis && !greska && <div className="mt-1 text-xs text-slate-500">{opis}</div>}
      {greska && <div className="mt-1 text-xs text-error">{greska}</div>}
    </label>
  );
});
