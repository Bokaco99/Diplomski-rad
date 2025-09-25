
import { Menu, LogOut } from 'lucide-react';
import { Dugme } from '../../components/ui/Button';
import { useUiProdavnica } from '../../app/store';
import { useOdjava } from '../../features/auth/hooks';
import { useNavigate } from 'react-router-dom';

export function GornjaTraka() {
  const { sidebarSakrij, postaviSidebarSakrij } = useUiProdavnica();
  const navi = useNavigate();
  const odjavaMut = useOdjava();

  function klikOdjava() {
    odjavaMut.mutate(undefined, {
      onSuccess: () => navi('/prijava', { replace: true })
    });
  }

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <Dugme
          rezim="ghost"
          onClick={() => postaviSidebarSakrij(!sidebarSakrij)}
          aria-label="Meni"
        >
          <Menu className="h-5 w-5" />
        </Dugme>
        <div className="font-semibold text-slate-800">Renovation Planner</div>
      </div>

      <Dugme rezim="secondary" onClick={klikOdjava} disabled={odjavaMut.isPending}>
        <LogOut className="h-4 w-4" />
        {odjavaMut.isPending ? 'Odjavljivanje…' : 'Odjava'}
      </Dugme>
    </div>
  );
}

