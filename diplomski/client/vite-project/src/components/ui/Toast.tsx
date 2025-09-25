import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { X } from 'lucide-react';

export type Poruka = {
  id: string;
  tekst: string;
  tip: 'info' | 'uspeh' | 'greska';
};

type Kontekst = {
  dodaj: (p: Omit<Poruka, 'id'>) => void;
  show: (poruka: string, tip?: Poruka['tip']) => void;
  ukloni: (id: string) => void;
};

const TosterCtx = createContext<Kontekst | null>(null);

export function useToster() {
  const ctx = useContext(TosterCtx);
  if (!ctx) throw new Error('useToster mora biti korišćen unutar TosterProvajdera');
  return ctx;
}


export function prikaziGresku(msg: string) {
  window.dispatchEvent(
    new CustomEvent('toast:show', { detail: { message: msg, type: 'greska' as const } })
  );
}

export function TosterProvajder({ children }: { children: ReactNode }) {
  const [poruke, setPoruke] = useState<Poruka[]>([]);

  const ukloni = useCallback((id: string) => {
    setPoruke((s) => s.filter((p) => p.id !== id));
  }, []);

  const dodaj = useCallback((p: Omit<Poruka, 'id'>) => {
    const id = crypto.randomUUID();
    setPoruke((s) => [...s, { ...p, id }]);
    setTimeout(() => ukloni(id), 4000);
  }, [ukloni]);

  const show = useCallback(
    (poruka: string, tip: Poruka['tip'] = 'info') => dodaj({ tekst: poruka, tip }),
    [dodaj]
  );

  useEffect(() => {
    const onShow = (e: Event) => {
      const ce = e as CustomEvent<{ message: string; type?: Poruka['tip'] }>;
      show(ce.detail?.message ?? 'Obaveštenje', ce.detail?.type ?? 'info');
    };
    window.addEventListener('toast:show', onShow);
    return () => window.removeEventListener('toast:show', onShow);
  }, [show]);

  return (
    <TosterCtx.Provider value={{ dodaj, show, ukloni }}>
      {children}

      {/* UI sloj */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {poruke.map((p) => (
          <div
            key={p.id}
            className={`rounded-xl px-4 py-3 shadow-soft text-sm text-white ${
              p.tip === 'uspeh'
                ? 'bg-success'
                : p.tip === 'greska'
                ? 'bg-error'
                : 'bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{p.tekst}</span>
              <button
                className="ml-2 opacity-80 hover:opacity-100"
                onClick={() => ukloni(p.id)}
                aria-label="Zatvori obaveštenje"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </TosterCtx.Provider>
  );
}

export { TosterProvajder as TosterProvider };

export function useToast() {
  const { show } = useToster();
  return { show };
}
