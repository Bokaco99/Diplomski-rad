import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dugme } from '../../../components/ui/Button';
import { Unos } from '../../../components/ui/Input';
import { Kartica } from '../../../components/ui/Card';
import { useMe, usePrijava } from '../hooks';
import { Navigate, useNavigate } from 'react-router-dom';

const shema = z.object({
  email: z.string().email('Unesite ispravan e-mail'),
  lozinka: z.string().min(6, 'Lozinka mora imati bar 6 karaktera')
});
type Forma = z.infer<typeof shema>;

export default function LoginStrana() {
  const navi = useNavigate();
  const { podaci } = useMe();
  const mut = usePrijava();

  const { register, handleSubmit, formState: { errors } } = useForm<Forma>({
    resolver: zodResolver(shema)
  });

  useEffect(() => {
    if (podaci?.ulogovan) navi('/dashboard', { replace: true });
  }, [podaci, navi]);

  if (podaci?.ulogovan) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto mt-20 w-[420px]">
      <Kartica naslov="Prijava na sistem">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((v) => mut.mutate(v, {
            onSuccess: () => navi('/dashboard', { replace: true })
          }))}
        >
          <Unos
            label="E-mail"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            greska={errors.email?.message}
          />
          <Unos
            label="Lozinka"
            type="password"
            placeholder="********"
            {...register('lozinka')}
            greska={errors.lozinka?.message}
          />
          <Dugme type="submit" disabled={mut.isPending}>
            {mut.isPending ? 'Prijavljivanje...' : 'Prijavi se'}
          </Dugme>
        </form>
      </Kartica>
    </div>
  );
}
