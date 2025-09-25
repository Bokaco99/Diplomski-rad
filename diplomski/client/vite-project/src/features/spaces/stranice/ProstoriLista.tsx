import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dohvatiProstore, Prostor, obrisiProstor } from '../api';
import { Tabela } from '../../../components/ui/Table';
import { Kostur } from '../../../components/ui/Skeleton';
import { Dugme } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Kartica } from '../../../components/ui/Card';
import { prikaziGresku } from '../../../components/ui/Toast';

export default function ProstoriListaStrana() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['prostori', 'list'],
    queryFn: dohvatiProstore,
  });

  const mutBrisanje = useMutation({
    mutationFn: (id: number) => obrisiProstor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prostori', 'list'] }),
    onError: () => prikaziGresku('Brisanje nije uspelo'),
  });

  function potvrdiBrisanje(p: Prostor) {
    if (confirm(`Obrisati prostor "${p.naziv}"?`)) {
      mutBrisanje.mutate(p.id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Prostori</h1>
        <div className="flex gap-2">
          <Link to="/usluge/zatrazi">
            <Dugme rezim="secondary">Zatraži uslugu</Dugme>
          </Link>
          <Link to="/prostori/novi">
            <Dugme>Dodaj prostor</Dugme>
          </Link>
        </div>
      </div>

      <Kartica>
        {isLoading ? (
          <div className="space-y-2">
            <Kostur className="h-4 w-full" />
            <Kostur className="h-4 w-11/12" />
            <Kostur className="h-4 w-10/12" />
          </div>
        ) : Array.isArray(data) && data.length > 0 ? (
          <Tabela kolone={['Naziv', 'Kvadratura (m²)', 'Tip', 'Budžet', 'Akcije']}>
            {data!.map((p: Prostor) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{p.naziv}</td>
                <td className="px-4 py-3">{p.kvadratura}</td>
                <td className="px-4 py-3">{p.tip}</td>
                <td className="px-4 py-3">{p.budzet ?? '—'}</td>
                <td className="px-4 py-3 flex gap-3">
                  <Link to={`/prostori/${p.id}`} className="text-primary hover:underline">
                    Detalji
                  </Link>
                  <button
                    className="text-error hover:underline"
                    onClick={() => potvrdiBrisanje(p)}
                    disabled={mutBrisanje.isPending}
                  >
                    {mutBrisanje.isPending ? 'Brisanje…' : 'Obriši'}
                  </button>
                </td>
              </tr>
            ))}
          </Tabela>
        ) : (
          <div className="text-sm text-slate-600">
            Nema prostora.{' '}
            <Link to="/prostori/novi" className="text-primary hover:underline">
              Kreiraj prvi prostor
            </Link>
            .
          </div>
        )}
      </Kartica>
    </div>
  );
}
