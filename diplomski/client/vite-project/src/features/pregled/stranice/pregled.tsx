import { Kartica } from '../../../components/ui/Card';
import { Kostur } from '../../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { http } from '../../../lib/axios';

export default function DashboardStrana() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'recent'],
    queryFn: async () => {
      // Stub -- backend moZe kasnije dati recent kalkulacije/ponude
      const { data } = await http.get('/calculations?limit=5').catch(() => ({ data: [] }));
      return data;
    }
  });

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <Kartica naslov="Brzi sažetak">
          {isLoading ? (
            <div className="space-y-3">
              <Kostur className="h-6 w-1/3" />
              <Kostur className="h-4 w-2/3" />
              <Kostur className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="text-sm text-slate-700">
              {Array.isArray(data) && data.length > 0
                ? 'Prikaz poslednjih kalkulacija (stub).'
                : 'Nema podataka za prikaz.'}
            </div>
          )}
        </Kartica>
      </div>
      <div className="col-span-4">
        <Kartica naslov="Akcije">
          <div className="text-sm text-slate-700">
            • Kreiraj novi prostor<br />
            • Pogledaj ponude<br />
            • Uredi katalog
          </div>
        </Kartica>
      </div>
    </div>
  );
}
