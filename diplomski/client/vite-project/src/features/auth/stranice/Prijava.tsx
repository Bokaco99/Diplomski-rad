
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dugme } from '../../../components/ui/Button';
import { Unos } from '../../../components/ui/Input';
import { Kartica } from '../../../components/ui/Card';
import { useJa, usePrijava } from '../hooks';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const shema = z.object({
  email: z.string().email('Unesite ispravan e-mail'),
  lozinka: z.string().min(6, 'Lozinka mora imati bar 6 karaktera'),
});
type Forma = z.infer<typeof shema>;

export default function PrijavaStrana() {
  const navi = useNavigate();
  const lokacija = useLocation() as { state?: { from?: Location } };
  const { podaci } = useJa();
  const mut = usePrijava();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Forma>({
    resolver: zodResolver(shema),
  });

  // Ako je već ulogovan, odmah vodi dalje
  useEffect(() => {
    if (podaci?.ulogovan) {
      navi('/pregled', { replace: true });
    }
  }, [podaci, navi]);

  if (podaci?.ulogovan) {
    return <Navigate to="/pregled" replace />;
  }

  return (
    <div className="mx-auto mt-20 w-[420px]">
      <Kartica naslov="Prijava na sistem">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((v) =>
            mut.mutate(v, {
              onSuccess: () => {
                // Vrati korisnika gde je prvobitno hteo (ako je došao sa zaštićene rute)
                const povratak = lokacija.state?.from?.pathname ?? '/pregled';
                navi(povratak, { replace: true });
              },
            })
          )}
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

          {/* Prikaz server-side greške (npr. pogrešan email/lozinka) */}
          {mut.isError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {(mut.error as any)?.response?.data?.greska ??
                'Prijava nije uspela. Proverite kredencijale i pokušajte ponovo.'}
            </div>
          )}

          <Dugme type="submit" disabled={mut.isPending}>
            {mut.isPending ? 'Prijavljivanje...' : 'Prijavi se'}
          </Dugme>
        </form>
      </Kartica>
    </div>
  );
}
