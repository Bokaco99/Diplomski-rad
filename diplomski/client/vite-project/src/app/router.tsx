import { Routes, Route, Navigate } from 'react-router-dom';
import { ZasticenaRuta } from '../components/routes/ProtectedRoute';
import PrijavaStrana from '../features/auth/stranice/Prijava';
import PocetnaStrana from '../features/pregled/stranice/Pocetna';


function Prostori() {
  return <div>Lista prostora (uskoro)</div>;
}
function Katalog() {
  return <div>Katalog radova i materijala (uskoro)</div>;
}
function Ponude() {
  return <div>Ponude izvođača (uskoro)</div>;
}

export function RouterAplikacije() {
  return (
    <Routes>
      {/* javno */}
      <Route path="/prijava" element={<PrijavaStrana />} />

      {/* zaasticene rute */}
      <Route element={<ZasticenaRuta />}>
        <Route path="/" element={<PocetnaStrana />} />
        <Route path="/prostori" element={<Prostori />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/ponude" element={<Ponude />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
