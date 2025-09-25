import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMaterijali, getRadovi, Rad, Materijal } from '../api';

export default function PlanTab() {
  const { id } = useParams();
  const prostorId = Number(id);
  const nav = useNavigate();

  const { data: radovi } = useQuery({ queryKey: ['radovi'], queryFn: getRadovi });
  const { data: materijali } = useQuery({ queryKey: ['materijali'], queryFn: getMaterijali });

  const [selRadovi, setSelRadovi] = useState<number[]>([]);
  const [selMaterijali, setSelMaterijali] = useState<number[]>([]);
  const [kvadratura, setKvadratura] = useState<number>(0); // možeš proslediti iz route parent-a ako želiš

  useEffect(() => {
    // Ako imaš kvadraturu u localStorage-u ili kroz URL, učitaj je – ovde ostavljeno prazno.
  }, []);

  const suma = useMemo(() => {
    const r = (radovi ?? []).filter(x => selRadovi.includes(x.id));
    const m = (materijali ?? []).filter(x => selMaterijali.includes(x.id));
    const radSum = r.reduce((acc, x) => acc + x.cenaPoM2 * (kvadratura || 1), 0);
    const matSum = m.reduce((acc, x) => acc + x.cena * (x.potrosnjaPoM2 * (kvadratura || 1)), 0);
    return { radSum, matSum, total: radSum + matSum };
  }, [radovi, materijali, selRadovi, selMaterijali, kvadratura]);

  function toggle<T extends { id: number }>(id: number, arr: number[], setArr: (x: number[]) => void) {
    if (arr.includes(id)) setArr(arr.filter(i => i !== id));
    else setArr([...arr, id]);
  }

  function idiNaKalkulaciju() {
    if (selRadovi.length + selMaterijali.length === 0) {
      alert('Izaberi bar jedan rad ili materijal.');
      return;
    }
    const q = new URLSearchParams();
    if (selRadovi.length) q.set('works', selRadovi.join(','));
    if (selMaterijali.length) q.set('materials', selMaterijali.join(','));
    nav(`/prostori/${prostorId}/kalkulacije?${q.toString()}`);
  }

  return (
    <div className="plan-grid">
      <div className="plan-panel">
        <h3 style={{ marginBottom: 8 }}>Izbor</h3>

        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <div style={{ maxWidth: 240 }}>
            <label className="label">Kvadratura (m²)</label>
            <input
              type="number"
              min={0}
              value={kvadratura || ''}
              onChange={e => setKvadratura(Number(e.target.value))}
              className="input"
              placeholder="npr. 55"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <h4>Radovi</h4>
            <div className="list-scroll">
              {(radovi ?? []).map((r: Rad) => (
                <label key={r.id} className="list-item">
                  <input
                    type="checkbox"
                    checked={selRadovi.includes(r.id)}
                    onChange={() => toggle(r.id, selRadovi, setSelRadovi)}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.naziv}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {r.cenaPoM2.toLocaleString('sr-RS')} RSD/m²
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4>Materijali</h4>
            <div className="list-scroll">
              {(materijali ?? []).map((m: Materijal) => (
                <label key={m.id} className="list-item">
                  <input
                    type="checkbox"
                    checked={selMaterijali.includes(m.id)}
                    onChange={() => toggle(m.id, selMaterijali, setSelMaterijali)}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.naziv}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {m.cena.toLocaleString('sr-RS')} RSD · {m.potrosnjaPoM2} /m²
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn" onClick={idiNaKalkulaciju}>Idi na kalkulaciju</button>
        </div>
      </div>

      <div className="result-panel">
        <h3 style={{ marginBottom: 8 }}>Brza suma (klijentski proračun)</h3>
        <div className="calc-summary">
          <div className="summary-card">
            <div className="label">Radovi</div>
            <div className="value">{suma.radSum.toLocaleString('sr-RS')} RSD</div>
          </div>
          <div className="summary-card">
            <div className="label">Materijali</div>
            <div className="value">{suma.matSum.toLocaleString('sr-RS')} RSD</div>
          </div>
          <div className="summary-card" style={{ gridColumn: '1 / span 2' }}>
            <div className="label">Ukupno</div>
            <div className="value" style={{ fontSize: 18 }}>
              {suma.total.toLocaleString('sr-RS')} RSD
            </div>
          </div>
        </div>
        <p style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
          Napomena: konačan obračun radi server (sledeći tab “Kalkulacija”).
        </p>
      </div>
    </div>
  );
}

