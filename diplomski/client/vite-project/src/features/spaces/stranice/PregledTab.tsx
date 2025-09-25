import { Link, useParams } from 'react-router-dom';

export default function PregledTab() {
  const { id } = useParams();
  const prostorId = Number(id);

  return (
    <div className="plan-panel">
      <p>Ovaj tab daje brz pregled meta podataka i kratke akcije.</p>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <Link className="btn" to={`/prostori/${prostorId}/plan`}>Kreiraj plan</Link>
        <Link className="btn" to={`/prostori/${prostorId}/ponude`}>Pregled ponuda</Link>
      </div>
    </div>
  );
}
