import { NavLink } from 'react-router-dom';
import { Home, Layers, ClipboardList, Package } from 'lucide-react';
import { useUiProdavnica } from '../../app/store';
import { useJa } from '../../features/auth/hooks';
import '../../styles/layout/sidebar.css';

export default function Sidebar() {
  const { sidebarSakrij } = useUiProdavnica();

  // ⬇️ prilagođeno tvom hook-u: ulogovan + isKlijent/isIzvodjac/isAdmin
  const { ulogovan, isKlijent, isIzvodjac, isAdmin } = useJa();

  if (!ulogovan) return null;

  return (
    <aside className={`side ${sidebarSakrij ? 'side--collapsed' : ''}`}>
      <nav className="side__nav">
        <div className="side__section">
          <div className="side__title">Glavno</div>

          {isKlijent && (
            <>
              <NavItem to="/dashboard" label="Pregled" icon={Home} collapsed={sidebarSakrij} />
              <NavItem to="/spaces" label="Prostori" icon={Layers} collapsed={sidebarSakrij} />
              <NavItem to="/offers" label="Zatraži uslugu" icon={ClipboardList} collapsed={sidebarSakrij} />
            </>
          )}

          {isIzvodjac && (
            <>
              <NavItem to="/offers" label="Moje ponude" icon={ClipboardList} collapsed={sidebarSakrij} />
              <NavItem to="/catalog/works" label="Radovi" icon={ClipboardList} collapsed={sidebarSakrij} />
              <NavItem to="/catalog/materials" label="Materijali" icon={Package} collapsed={sidebarSakrij} />
            </>
          )}

          {isAdmin && (
            <>
              <NavItem to="/admin/korisnici" label="Korisnici" icon={Home} collapsed={sidebarSakrij} />
              <NavItem to="/admin/sifarnici" label="Šifrarnici" icon={Layers} collapsed={sidebarSakrij} />
            </>
          )}
        </div>
      </nav>
    </aside>
  );
}

type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;
function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
}: {
  to: string;
  label: string;
  icon: IconCmp;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `side__link ${isActive ? 'is-active' : ''}`}
      aria-label={label}
      title={collapsed ? label : undefined}
    >
      <Icon className="side__icon" width={16} height={16} aria-hidden />
      <span className="side__label">{label}</span>
    </NavLink>
  );
}

