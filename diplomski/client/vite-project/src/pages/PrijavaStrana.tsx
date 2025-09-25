import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../lib/axios'; // <- tvoja axios instanca sa baseURL: '/api' i withCredentials: true

export default function PrijavaStrana() {
  const navi = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [greska, setGreska] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGreska(null);
    setLoading(true);
    try {
      // ↓↓↓ OVO ide ovde ↓↓↓
      await http.post('/auth/login', { email, password });
      // (opciono) odmah povuci ko je ulogovan
      const { data } = await http.get('/auth/ja');
      // možeš sačuvati korisnika u localStorage ili global state ako želiš
      localStorage.setItem('korisnik', JSON.stringify(data.korisnik ?? data.identitet ?? null));

      navi('/prostori'); // gde želiš da ode posle uspešnog logina
    } catch (err: any) {
      const msg = err?.response?.data?.greska || 'Prijava nije uspela.';
      setGreska(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow p-6 rounded-xl space-y-4">
        <h1 className="text-xl font-semibold">Prijava</h1>

        {greska && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {greska}
          </div>
        )}

        <label className="block">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            className="mt-1 w-full border rounded px-3 py-2 outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Lozinka</span>
          <input
            type="password"
            className="mt-1 w-full border rounded px-3 py-2 outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg px-4 py-2 bg-black text-white disabled:opacity-60"
        >
          {loading ? 'Prijavljivanje…' : 'Prijavi se'}
        </button>
      </form>
    </div>
  );
}
