import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPonudeByProstor, postPonuda, putPonudaStatus } from '../api';
import { useParams } from 'react-router-dom';

export default function PonudeTab() {
  const { id } = useParams();
  const prostorId = Number(id);
  const qc = useQueryClient();

  const { data: ponude } = useQuery({
    queryKey: ['ponude', prostorId],
    queryFn: () => getPonudeByProstor(prostorId),
  });

  const cenaRef = useRef<HTMLInputElement>(null);
  const daniRef = useRef<HTMLInputElement>(null);

  const dodaj = useMutation({
    mutationFn: () =>
      postPonuda({
        prostorId,
        cenaRsd: Number(cenaRef.current?.value || 0),
        trajanjeDana: Number(daniRef.current?.value || 0),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ponude', prostorId] }),
  });

  const promeni = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'NOVO' | 'PRIHVACENO' | 'ODBIJENO' }) =>
      putPonudaStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ponude', prostorId] }),
  });

  function exportPdf(_ponudaId: number) {
    // Stub: ovde će ići jsPDF + autoTable
    alert('PDF eksport – biće u sledećem koraku.');
  }

  return (
    <div className="plan-panel">
      <h3>Ponude</h3>

      <div style={{ display: 'flex', gap: 8, margin: '8px 0 12px' }}>
        <input ref={cenaRef} type="number" className="input" placeholder="Cena (RSD)" min={0} />
        <input ref={daniRef} type="number" className="input" placeholder="Trajanje (dana)" min={0} />
        <button className="btn" onClick={() => dodaj.mutate()} disabled={dodaj.isPending}>
          {dodaj.isPending ? 'Čuvam…' : 'Dodaj ponudu'}
        </button>
      </div>

      <div>
        {(ponude ?? []).map(p => (
          <div key={p.id} className="offer-row">
            <div>
              <div style={{ fontWeight: 600 }}>#{p.id}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{new Date(p.datumKreiranja).toLocaleString('sr-RS')}</div>
            </div>
            <div>{p.cenaRsd.toLocaleString('sr-RS')} RSD</div>
            <div>{p.trajanjeDana} dana</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                className="input"
                value={p.status}
                onChange={(e) => promeni.mutate({ id: p.id, status: e.target.value as any })}
              >
                <option value="NOVO">NOVO</option>
                <option value="PRIHVACENO">PRIHVACENO</option>
                <option value="ODBIJENO">ODBIJENO</option>
              </select>
              <button className="btn" onClick={() => exportPdf(p.id)}>PDF</button>
            </div>
          </div>
        ))}
        {(!ponude || ponude.length === 0) && <p>Nema ponuda.</p>}
      </div>
    </div>
  );
}
