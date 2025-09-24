import { Menu, LogOut } from 'lucide-react';
import { Dugme } from '../ui/Button';
import { useUiProdavnica } from '/Bogdan Stamenkovic Diplomski/diplomski/client/vite-project/src/app/store';
import { logout } from '/Bogdan Stamenkovic Diplomski/diplomski/client/vite-project/src/features/auth/api';

export function GornjaTraka() {
  const { sidebarSakrij, postaviSidebarSakrij } = useUiProdavnica();

  async function klikOdjava() {
    try {
      await logout();
      window.location.href = '/login';
    } catch {
      // interceptor već hendluje
    }
  }

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <Dugme rezim="ghost" onClick={() => postaviSidebarSakrij(!sidebarSakrij)} aria-label="Meni">
          <Menu className="h-5 w-5" />
        </Dugme>
        <div className="font-semibold text-slate-800">Renovation Planner</div>
      </div>
      <Dugme rezim="secondary" onClick={klikOdjava}>
        <LogOut className="h-4 w-4" />
        Odjava
      </Dugme>
    </div>
  );
}
