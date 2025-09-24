import { NavLink, Outlet, useParams } from 'react-router-dom';

export default function ProstorDetaljStrana() {
  const { id } = useParams();

  const base = `/spaces/${id}`;

  const link = 'rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100';
  const active = 'bg-slate-100 text-slate-900';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Prostor #{id}</h1>
        <div className="mt-3 flex gap-2">
          <NavLink to={`${base}`} end className={({ isActive }) => `${link} ${isActive ? active : ''}`}>Pregled</NavLink>
          <NavLink to={`${base}/plan`} className={({ isActive }) => `${link} ${isActive ? active : ''}`}>Plan</NavLink>
          <NavLink to={`${base}/calculation`} className={({ isActive }) => `${link} ${isActive ? active : ''}`}>Kalkulacija</NavLink>
          <NavLink to={`${base}/offers`} className={({ isActive }) => `${link} ${isActive ? active : ''}`}>Ponude</NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}


