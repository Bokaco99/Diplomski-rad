
import { Navigate, Outlet } from 'react-router-dom';
import { useJa } from '../features/auth/hooks';

export default function ProtectedRoute() {
  const { podaci, ucitava } = useJa();

  if (ucitava) return <div>Učitavanje…</div>;

  // ⬇︎ JEDINA PROMENA:
  const ulogovan = Boolean((podaci as any)?.identitet || (podaci as any)?.korisnik);

  if (!ulogovan) return <Navigate to="/prijava" replace />;
  return <Outlet />;
}
