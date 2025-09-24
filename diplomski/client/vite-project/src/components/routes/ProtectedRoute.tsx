import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../../features/auth/hooks';

export function ZasticenaRuta() {
  const { podaci, ucitava, greska } = useMe();

  if (ucitava) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-pulse text-slate-600">Provera sesije...</div>
      </div>
    );
  }

  if (greska || !podaci?.ulogovan) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
