// src/features/spaces/stranice/ProstorDetalj.tsx
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dohvatiProstore } from '../api';

import '../../../styles/komponente/tabs.css';
import '../../../styles/feature/prostor.css';

export default function ProstorDetaljStrana() {
  const { id } = useParams();
  const prostorId = Number(id);

  const { data: prostori, isLoading, isError } = useQuery({
    queryKey: ['prostori'],
    queryFn: () => dohvatiProstore(),
  });

  if (!Number.isFinite(prostorId)) {
    return <div className="plan-panel">Neispravan ID prostora.</div>;
  }

  if (isLoading) return <div className="plan-panel">Učitavanje prostora…</div>;
  if (isError || !prostori) return <div className="plan-panel">Greška pri čitanju prostora.</div>;

  const prostor = prostori.find(p => p.id === prostorId);
  if (!prostor) return <div className="plan-panel">Prostor nije pronađen.</div>;

  return (
    <div className="page-space">
      <div className="space-header">
        <h1 className="space-title">{prostor.naziv}</h1>
      </div>

      <div className="space-meta">
        <div className="item">
          <span className="label">Kvadratura</span>
          <span className="value">{prostor.kvadratura} m²</span>
        </div>
        <div className="item">
          <span className="label">Tip</span>
          <span className="value">{prostor.tip}</span>
        </div>
        <div className="item">
          <span className="label">Budžet</span>
          <span className="value">
            {prostor.budzet ? `${prostor.budzet.toLocaleString('sr-RS')} RSD` : '—'}
          </span>
        </div>
        <div className="item">
          <span className="label">ID</span>
          <span className="value">#{prostor.id}</span>
        </div>
      </div>

      <div className="tabs">
        <NavLink
          end
          to={`/prostori/${prostorId}`}
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
        >
          Pregled
        </NavLink>
        <NavLink
          to={`/prostori/${prostorId}/plan`}
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
        >
          Plan
        </NavLink>
        <NavLink
          to={`/prostori/${prostorId}/kalkulacije`}
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
        >
          Kalkulacije
        </NavLink>
        <NavLink
          to={`/prostori/${prostorId}/ponude`}
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
        >
          Ponude
        </NavLink>
        <div className="tab-spacer" />
      </div>

      <Outlet />
    </div>
  );
}


