import React, { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getKalkulacijeByProstor, postKalkulacija } from '../api';

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function KalkulacijaTab() {
  const { id } = useParams();
  const prostorId = Number(id);
  const q = useQueryParams();

  const works = q.get('works');
  const materials = q.get('materials');

  const doCalc = useMutation({
    mutationFn: () =>
      postKalkulacija({
        prostorId,
        workIds: works ? works.split(',').map(Number) : [],
        materialIds: materials ? materials.split(',').map(Number) : [],
      }),
  });

  const { data: istorija, refetch, isFetching } = useQuery({
    queryKey: ['kalkulacije', prostorId],
    queryFn: () => getKalkulacijeByProstor(prostorId),
  });

  // Ako imamo plan u URL-u, odmah napravi kalkulaciju (jednom)
  const hasPlan = !!(works || materials);

  useEffect(() => {
    let cancelled = false;

    if (hasPlan) {
      doCalc.mutateAsync().then(() => {
        if (!cancelled) {
          // eksplicitno vrati Promise da tip bude OK
          return refetch();
        }
        // ili vrati void kad je otkazano
        return undefined;
      });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPlan]);

  const poslednja = istorija?.[0];

  return (
    <div className="plan-panel">
      <h3>Kalkulacija</h3>

      {(doCalc.isPending || isFetching) && <p>Računam…</p>}
      {doCalc.isError && <p>Greška pri računanju.</p>}

      {poslednja ? (
        <>
          <div className="calc-summary" style={{ marginTop: 8 }}>
            <div className="summary-card">
              <div className="label">Ukupni troškovi</div>
              <div className="value">
                {poslednja.ukupniTroskoviRsd.toLocaleString('sr-RS')} RSD
              </div>
            </div>
            <div className="summary-card">
              <div className="label">Vreme (dana)</div>
              <div className="value">{poslednja.procenjenoVremeDana}</div>
            </div>
          </div>

          {poslednja.detalji?.stavke?.length ? (
            <table className="table-like">
              <thead>
                <tr>
                  <th>Stavka</th>
                  <th>Količina</th>
                  <th>Cena (RSD)</th>
                  <th>Ukupno (RSD)</th>
                </tr>
              </thead>
              <tbody>
                {poslednja.detalji.stavke.map((s: any, i: number) => (
                  <tr key={i}>
                    <td>{s.naziv}</td>
                    <td>{s.kolicina ?? '—'}</td>
                    <td>{Number(s.cena).toLocaleString('sr-RS')}</td>
                    <td>{Number(s.ukupno).toLocaleString('sr-RS')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ marginTop: 8, color: '#6b7280' }}>
              Nema detaljnog prikaza stavki.
            </p>
          )}
        </>
      ) : (
        <p>Još uvek nema kalkulacija za ovaj prostor.</p>
      )}
    </div>
  );
}
