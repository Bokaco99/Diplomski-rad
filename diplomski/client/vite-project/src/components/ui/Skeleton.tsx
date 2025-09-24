import { twMerge } from 'tailwind-merge';

export function Kostur({ className }: { className?: string }) {
  return <div className={twMerge('animate-pulse rounded-md bg-slate-200', className)} />;
}
