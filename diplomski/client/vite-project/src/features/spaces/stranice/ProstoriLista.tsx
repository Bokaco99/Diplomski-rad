import { useQuery } from '@tanstack/react-query';
import { dohvatiProstore, Prostor } from '../api';
import { Tabela } from '../../../components/ui/Table';
import { Kostur } from '../../../components/ui/Skeleton';
import { Dugme } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Kartica } from '../../../components/ui/Card';

export default function ProstoriListaStrana() {
  const { data, isLoading } = useQuery({
    queryKey: ['spaces', 'list'],
    queryFn: dohvatiProstore
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Prostori</h1>
        <Link to="/spaces/new"><Dugme>Kreiraj prostor</Dugme></Link>
      </div>

      <Kartica>
        {isLoading ? (
          <div className="space-y-2">
            <Kostur className="h-4 w-full" />
            <Kostur className="h-4 w-11/12" />
            <Kostur className="h-4 w-10/12" />
          </div>
        ) : (Array.isArray(data) && data.length > 0) ? (
          <Tabela kolone={['Naziv', 'Kvadratura (m²)', 'Tip', 'Budžet', 'Akcije']}>
            {data!.map((p: Prostor) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{p.naziv}</td>
                <td className="px-4 py-3">{p.kvadratura}</td>
                <td className="px-4 py-3">{p.tip}</td>
                <td className="px-4 py-3">{p.budzet ?? '—'}</td>
                <td className="px-4 py-3">
                  <Link to={`/spaces/${p.id}`} className="text-primary hover:underline">Detalji</Link>
                </td>
              </tr>
            ))}
          </Tabela>
        ) : (
          <div className="text-sm text-slate-600">
            Nema prostora. <Link to="/spaces/new" className="text-primary hover:underline">Kreiraj prvi prostor</Link>.
          </div>
        )}
      </Kartica>
    </div>
  );
}
