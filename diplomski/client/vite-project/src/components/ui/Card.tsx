import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function Kartica({
  children,
  className,
  naslov
}: {
  children: ReactNode;
  className?: string;
  naslov?: ReactNode;
}) {
  return (
    <div className={twMerge('card p-5', className)}>
      {naslov && <div className="mb-4 text-lg font-semibold">{naslov}</div>}
      {children}
    </div>
  );
}
