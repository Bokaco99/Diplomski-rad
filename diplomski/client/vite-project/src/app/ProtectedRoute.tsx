// components/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useJa } from '../features/auth/hooks';

export function ZasticenaRuta() {
  const { podaci, ucitava } = useJa();

  if (ucitava) return <div>Učitavanje…</div>;
  if (!podaci?.identitet) return <Navigate to="/prijava" replace />;

  return <Outlet />; // <- bez ovoga neće prikazati decu ruta
}
