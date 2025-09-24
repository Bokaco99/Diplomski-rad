// src/components/ui/Table.tsx
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  kolone: ReactNode[];
  children?: ReactNode;           // <- standardno
  className?: string;
};

export function Tabela({ kolone, children, className }: Props) {
  return (
    <div className={twMerge('overflow-x-auto rounded-xl border border-slate-200', className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {kolone.map((k, i) => (
              <th key={i} className="px-4 py-2 font-medium">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">{children}</tbody>
      </table>
    </div>
  );
}

