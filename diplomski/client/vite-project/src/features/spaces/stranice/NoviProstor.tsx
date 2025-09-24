import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Unos } from '../../../components/ui/Input';
import { Dugme } from '../../../components/ui/Button'; 
import { Kartica } from '../../../components/ui/Card';
import { http } from '../../../lib/axios';
import { useNavigate } from 'react-router-dom';

const shema = z.object({
  naziv: z.string().min(3).max(60),
  kvadratura: z.coerce.number().positive(),
  tip: z.enum(['APARTMENT', 'OFFICE']),
  budzet: z.coerce.number().min(0).optional().nullable()
});

type Forma = z.infer<typeof shema>;

export default function NoviProstorStrana() {
  const navi = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<Forma>({
    resolver: zodResolver(shema), 
    defaultValues: { naziv: '', kvadratura: 0, tip: 'APARTMENT', budzet: null }
  });

  const sacuvaj: SubmitHandler<Forma> = async (v) => {
    await http.post('/spaces', v);
    navi('/spaces');
  };

  return (
    <div className="max-w-xl">
      <Kartica naslov="Novi prostor">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(sacuvaj)}>
          <Unos
            label="Naziv"
            {...register('naziv')}
            greska={errors.naziv?.message}
          />

          <Unos
            label="Kvadratura (m²)"
            type="number"
            step="0.1"
            {...register('kvadratura', { valueAsNumber: true })}
            greska={errors.kvadratura?.message}
          />

          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">Tip</div>
            <select className="input" {...register('tip')}>
              <option value="APARTMENT">Stan</option>
              <option value="OFFICE">Kancelarija</option>
            </select>
            {errors.tip?.message && (
              <div className="mt-1 text-xs text-error">{errors.tip.message}</div>
            )}
          </label>

          <Unos
            label="Budžet (RSD, opcionalno)"
            type="number"
            {...register('budzet', { valueAsNumber: true })} 
            greska={errors.budzet?.message}
          />

          <div className="flex gap-2">
            <Dugme type="submit">Sačuvaj</Dugme>
          </div>
        </form>
      </Kartica>
    </div>
  );
}

