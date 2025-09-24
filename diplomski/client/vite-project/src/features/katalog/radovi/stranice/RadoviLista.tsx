import { Kartica } from '../../../../components/ui/Card';
import { Kostur } from '../../../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { http } from '../../../../lib/axios';

export default function RadoviStrana() {
  const { data, isLoading } = useQuery({
    queryKey: ['radovi', 'list'],
    queryFn: async () => {
      const { data } = await http.get('/works');
      return data ?? [];
    }
  });

  return (
    <Kartica naslov="Katalog radova">
      {isLoading ? (
        <div className="space-y-2">
          <Kostur className="h-4 w-2/3" />
          <Kostur className="h-4 w-1/2" />
        </div>
      ) : (
        <div className="text-sm text-slate-700">
          {Array.isArray(data) && data.length > 0 ? 'Lista radova (stub prikaz).' : 'Nema radova.'}
        </div>
      )}
    </Kartica>
  );
}
