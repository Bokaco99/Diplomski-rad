import { Kartica } from '../../../../components/ui/Card';
import { Kostur } from '../../../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { http } from '../../../../lib/axios';

export default function MaterijaliStrana() {
  const { data, isLoading } = useQuery({
    queryKey: ['materijali', 'list'],
    queryFn: async () => {
      const { data } = await http.get('/materials');
      return data ?? [];
    }
  });

  return (
    <Kartica naslov="Katalog materijala">
      {isLoading ? (
        <div className="space-y-2">
          <Kostur className="h-4 w-2/3" />
          <Kostur className="h-4 w-1/2" />
        </div>
      ) : (
        <div className="text-sm text-slate-700">
          {Array.isArray(data) && data.length > 0 ? 'Lista materijala (stub prikaz).' : 'Nema materijala.'}
        </div>
      )}
    </Kartica>
  );
}
