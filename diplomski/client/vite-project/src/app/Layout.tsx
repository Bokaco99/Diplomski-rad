import { Link, NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 16 }}>
        <Link to="/" style={{ fontWeight: 700 }}>RenovaPlan</Link>
        <nav style={{ display: 'flex', gap: 12 }}>
          <NavLink to="/prostori">Prostori</NavLink>
          <NavLink to="/katalog">Katalog</NavLink>
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <NavLink to="/prijava">Prijava</NavLink>
          <span>·</span>
          <NavLink to="/registracija">Registracija</NavLink>
        </div>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}