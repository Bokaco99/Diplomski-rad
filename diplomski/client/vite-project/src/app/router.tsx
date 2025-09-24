import { Routes, Route, Navigate } from 'react-router-dom'

function Pocetna() {
  return <div className="text-xl font-semibold">Dobrodošli 👋</div>
}
function Prostori() {
  return <div>Lista prostora (uskoro)</div>
}
function Katalog() {
  return <div>Katalog radova i materijala (uskoro)</div>
}
function Ponude() {
  return <div>Ponude izvođača (uskoro)</div>
}

export function RouterAplikacije() {
  return (
    <Routes>
      <Route path="/" element={<Pocetna />} />
      <Route path="/prostori" element={<Prostori />} />
      <Route path="/katalog" element={<Katalog />} />
      <Route path="/ponude" element={<Ponude />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
