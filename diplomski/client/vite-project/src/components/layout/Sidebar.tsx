import { NavLink } from 'react-router-dom';
import { Home, Layers, ClipboardList, Package } from 'lucide-react';
import { useUiProdavnica } from '../../app/store';

const linkKlase =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100';
const aktivan =
  'bg-slate-100 text-slate-900';

export function BocnaTraka() {
  const { sidebarSakrij } = useUiProdavnica();

  return (
    <aside
      className={`${
        sidebarSakrij ? 'w-14' : 'w-56'
      } transition-all duration-200 border-r border-slate-200 bg-white p-3`}
    >
      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={({ isActive }) => `${linkKlase} ${isActive ? aktivan : ''}`}>
          <Home className="h-4 w-4" />
          {!sidebarSakrij && <span>Pregled</span>}
        </NavLink>
        <NavLink to="/spaces" className={({ isActive }) => `${linkKlase} ${isActive ? aktivan : ''}`}>
          <Layers className="h-4 w-4" />
          {!sidebarSakrij && <span>Prostori</span>}
        </NavLink>
        <NavLink to="/catalog/works" className={({ isActive }) => `${linkKlase} ${isActive ? aktivan : ''}`}>
          <ClipboardList className="h-4 w-4" />
          {!sidebarSakrij && <span>Radovi</span>}
        </NavLink>
        <NavLink to="/catalog/materials" className={({ isActive }) => `${linkKlase} ${isActive ? aktivan : ''}`}>
          <Package className="h-4 w-4" />
          {!sidebarSakrij && <span>Materijali</span>}
        </NavLink>
      </nav>
    </aside>
  );
}
