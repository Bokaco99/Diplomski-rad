import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dohvatiProstore, Prostor } from '../api';
import { Tabela } from '../../../components/ui/Table';
import { Kostur } from '../../../components/ui/Skeleton';
import { Dugme } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Kartica } from '../../../components/ui/Card';
import { prikaziGresku } from '../../../components/ui/Toast';

// export default function ProstoriListaStrana() {
//   const qc = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ['prostori', 'list'],
//     queryFn: dohvatiProstore,
//   });

//   const mutBrisanje = useMutation({
//     mutationFn: (id: number) => obrisiProstor(id),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['prostori', 'list'] }),
//     onError: () => prikaziGresku('Brisanje nije uspelo'),
//   });

//   function potvrdiBrisanje(p: Prostor) {
//     if (confirm(`Obrisati prostor "${p.naziv}"?`)) {
//       mutBrisanje.mutate(p.id);
//     }
//   }
// }


export default function ListaProstora() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['prostori'],
    queryFn: dohvatiProstore,
  });

  // const mutBrisanje = useMutation({
  //   mutationFn: (id: number) => obrisiProstor(id),
  //   onSuccess: () => qc.invalidateQueries({ queryKey: ['prostori'] }),
  // });

  // function potvrdiBrisanje(p: Prostor) {
  //   const ok = window.confirm(`Obrisati prostor "${p.naziv}"?`);
  //   if (!ok) return;
  //   mutBrisanje.mutate(p.id);
  // }

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
          <Tabela<Prostor>
            data={data}
            searchableFields={['naziv', 'tip']}
            initialSort={{ key: 'naziv', dir: 'asc' }}
            columns={[
              { key: 'naziv', header: 'Naziv', sortable: true },
              { key: 'kvadratura', header: 'Kvadratura (m²)', sortable: true },
              { key: 'tip', header: 'Tip', sortable: true },
              {
                key: 'budzet',
                header: 'Budžet',
                sortable: true,
                accessor: (p) => (p.budzet ?? '—'),
              },
              {
                key: 'akcije',
                header: 'Akcije',
                sortable: false,
                accessor: (p) => (
                  <div className="flex gap-3">
                    <Link
                      to={`/prostori/${p.id}`}
                      className="text-primary hover:underline"
                    >
                      Detalji
                    </Link>
                    {/* <button
                      className="text-error hover:underline"
                      onClick={() => potvrdiBrisanje(p)}
                      disabled={mutBrisanje.isPending}
                    >
                      {mutBrisanje.isPending ? 'Brisanje…' : 'Obriši'}
                    </button> */}
                  </div>
                ),
              },
            ]}
            pageSizeOptions={[5, 10, 20]}
            defaultPageSize={10}
            searchPlaceholder="Pretraga…"
          />
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