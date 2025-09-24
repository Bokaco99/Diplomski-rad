import { Outlet } from 'react-router-dom';
import { GornjaTraka } from './TopNav';
import { BocnaTraka } from './Sidebar';

export function RasporedAplikacije() {
  return (
    <div className="flex h-screen">
      <BocnaTraka />
      <div className="flex min-w-0 flex-1 flex-col">
        <GornjaTraka />
        <main className="container-ogr py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
