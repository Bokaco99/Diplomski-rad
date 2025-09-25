import { Outlet } from 'react-router-dom';
import { GornjaTraka } from './TopNav';
import { BocnaTraka } from './Sidebar';


export function RasporedAplikacije() {
  return (
    <div className="app-layout">
      <BocnaTraka />
      <div className="app-content">
        <GornjaTraka />
        <main className="container-ogr">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

