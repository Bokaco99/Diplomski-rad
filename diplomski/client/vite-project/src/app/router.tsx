// src/app/router.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

// Zaštita ruta
import { ZasticenaRuta } from '../components/routes/ProtectedRoute';

// Javno
import PrijavaStrana from '../features/auth/stranice/Prijava';

// Početna (za ulogovane)
import PocetnaStrana from '../features/pregled/stranice/Pocetna';

// Prostori
import ProstoriListaStrana from '../features/spaces/stranice/ProstoriLista';
import NoviProstorStrana from '../features/spaces/stranice/NoviProstor';
import ProstorDetaljStrana from '../features/spaces/stranice/ProstorDetalj';

// Tabovi (nested u /prostori/:id)
import PregledTab from '../features/spaces/stranice/PregledTab';
import PlanTab from '../features/spaces/stranice/PlanTab';
import KalkulacijaTab from '../features/spaces/stranice/KalkulacijaTab';
import PonudeTab from '../features/spaces/stranice/PonudeTab';

// Usluge
import ZatraziUsluguStrana from '../features/usluge/stranice/ZatraziUslugu';

// (opciono – stubovi dok ne nastanu prave stranice)
function Katalog() {
  return <div>Katalog radova i materijala (uskoro)</div>;
}
function Ponude() {
  return <div>Ponude izvođača (uskoro)</div>;
}

export function RouterAplikacije() {
  return (
    <Routes>
      {/* Javno */}
      <Route path="/prijava" element={<PrijavaStrana />} />

      {/* Preusmerenja */}
      <Route path="/" element={<Navigate to="/pocetna" replace />} />

      {/* Zaštićeno */}
      <Route element={<ZasticenaRuta />}>
        <Route path="/pocetna" element={<PocetnaStrana />} />

        {/* Usluge */}
        <Route path="/usluge/zatrazi" element={<ZatraziUsluguStrana />} />

        {/* Prostori */}
        <Route path="/prostori" element={<ProstoriListaStrana />} />
        <Route path="/prostori/novi" element={<NoviProstorStrana />} />

        {/* Detalj prostora + NESTED TABOVI */}
        <Route path="/prostori/:id" element={<ProstorDetaljStrana />}>
          <Route index element={<PregledTab />} />
          <Route path="plan" element={<PlanTab />} />
          <Route path="kalkulacije" element={<KalkulacijaTab />} />
          <Route path="ponude" element={<PonudeTab />} />
        </Route>

        {/* Ostalo */}
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/ponude" element={<Ponude />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/pocetna" replace />} />
    </Routes>
  );
}


