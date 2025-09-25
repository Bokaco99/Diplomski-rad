import { useQuery, useMutation } from '@tanstack/react-query';
import { dohvatiProstore, Prostor } from '../../../features/spaces/api';
import { http } from '../../../lib/axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Kartica } from '../../../components/ui/Card';
import { Unos } from '../../../components/ui/Input';
import { Dugme } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { prikaziGresku } from '../../../components/ui/Toast';

const shema = z.object({
  prostorId: z.coerce.number().positive(),
  napomena: z.string().max(500).optional().or(z.literal(''))
});
type Forma = z.infer<typeof shema>;

export default function ZatraziUsluguStrana() {
  const navi = useNavigate();
  const { data: prostori } = useQuery({
    queryKey: ['prostori', 'list'],
    queryFn: dohvatiProstore
  });

  const mutZahtev = useMutation({
    mutationFn: (payload: { spaceId: number; note?: string }) =>
      http.post('/offers', payload).then(r => r.data),
    onSuccess: () => navi('/prostori'),
    onError: () => prikaziGresku('Slanje zahteva nije uspelo')
  });

  const { register, handleSubmit, formState: { errors } } = useForm<Forma>({
    resolver: zodResolver(shema)
  });

  function posalji(v: Forma) {
    mutZahtev.mutate({ spaceId: v.prostorId, note: v.napomena || undefined });
  }

  return (
    <div className="max-w-xl">
      <Kartica naslov="Zatraži uslugu za prostor">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(posalji)}>
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">Prostor</div>
            <select className="input" {...register('prostorId')}>
              <option value="">— Izaberite prostor —</option>
              {(prostori ?? []).map((p: Prostor) => (
                <option key={p.id} value={p.id}>
                  {p.naziv} — {p.kvadratura} m²
                </option>
              ))}
            </select>
            {errors.prostorId?.message && (
              <div className="mt-1 text-xs text-error">{errors.prostorId.message}</div>
            )}
          </label>

          <Unos
            label="Napomena (opciono)"
            placeholder="Dodatne informacije za izvođača"
            {...register('napomena')}
            greska={errors.napomena?.message}
          />

          <div className="flex gap-2">
            <Dugme type="submit" disabled={mutZahtev.isPending}>
              {mutZahtev.isPending ? 'Slanje...' : 'Zatraži'}
            </Dugme>
          </div>
        </form>
      </Kartica>
    </div>
  );
}
