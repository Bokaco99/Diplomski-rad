import { useQuery } from '@tanstack/react-query';
import { Kartica } from '../../../../components/ui/Card';
import { Kostur } from '../../../../components/ui/Skeleton';
import Table from '../../../../components/ui/Table'; // <-- default import
import { http } from '../../../../lib/axios';
import '../../../../styles/komponente/tabela.css';

type Materijal = {
  id: number;
  naziv: string;
  cena: number;
  potrosnjaPoM2: number;
};

function formatRsd(n: number | null | undefined) {
  if (n == null) return '—';
  return Number(n).toLocaleString('sr-RS') + ' RSD';
}

async function fetchMaterijali(): Promise<Materijal[]> {
  const { data } = await http.get('/materials');
  // podrži obe varijante: { materijali: [...] } ili direktno [...]
  return (data?.materijali ?? data ?? []) as Materijal[];
}

export default function MaterijaliLista() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['materijali', 'list'],
    queryFn: fetchMaterijali,
  });

  return (
    <Kartica naslov="Katalog materijala">
      {isLoading ? (
        <div className="space-y-2">
          <Kostur className="h-4 w-2/3" />
          <Kostur className="h-4 w-1/2" />
          <Kostur className="h-4 w-5/6" />
        </div>
      ) : isError ? (
        <div className="text-sm text-red-600">Greška pri učitavanju materijala.</div>
      ) : !data || data.length === 0 ? (
        <div className="text-sm text-slate-700">Nema materijala.</div>
      ) : (
        <Table<Materijal>
          data={data}
          searchableFields={['naziv']}
          initialSort={{ key: 'naziv', dir: 'asc' }}
          searchPlaceholder="Traži po nazivu…"
          columns={[
            { key: 'naziv', header: 'Naziv' },
            { key: 'potrosnjaPoM2', header: 'Normativ (po m²)' },
            { key: 'cena', header: 'Cena (RSD)', accessor: (m: Materijal) => formatRsd(m.cena) }, // <-- tipiran accessor
          ]}
        />
      )}
    </Kartica>
  );
}
