// src/app/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';
import { RouterProvider } from 'react-router-dom';

// Auth / početne
import PrijavaStrana from '../pages/PrijavaStrana';
import PocetnaStrana from '../features/pregled/stranice/Pocetna';

// Prostori
import ProstorListaStrana from '../features/spaces/stranice/ProstoriLista';
import ProstorDetaljStrana from '../features/spaces/stranice/ProstorDetalj';
import PregledTab from '../features/spaces/stranice/PregledTab';
import PlanTab from '../features/spaces/stranice/PlanTab';
import KalkulacijaTab from '../features/spaces/stranice/KalkulacijaTab';
import PonudeTab from '../features/spaces/stranice/PonudeTab';

// Usluge
import ZatraziUsluguStrana from '../features/usluge/stranice/ZatraziUslugu';

// ⬇️ NOVO: Katalog (radovi/materijali)
import RadoviLista from '../features/katalog/radovi/stranice/RadoviLista';
import MaterijaliLista from '../features/katalog/materijali/stranice/MaterijaliLista';

export function RouterAplikacije() {             // ⬅ DODAJ OVO
  return <RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/pocetna" replace /> },
      { path: '/prijava', element: <PrijavaStrana /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: '/pocetna', element: <PocetnaStrana /> },
          { path: '/usluge/zatrazi', element: <ZatraziUsluguStrana /> },

          // Prostori
          { path: '/prostori', element: <ProstorListaStrana /> },
          {
            path: '/prostori/:id',
            element: <ProstorDetaljStrana />,
            children: [
              { index: true, element: <PregledTab /> },
              { path: 'plan', element: <PlanTab /> },
              { path: 'kalkulacije', element: <KalkulacijaTab /> },
              { path: 'ponude', element: <PonudeTab /> },
            ],
          },

          // ⬇️ NOVO: Katalog – klijentske read-mostly liste
          {
            path: '/katalog',
            children: [
              { index: true, element: <RadoviLista /> },          // /katalog
              { path: 'radovi', element: <RadoviLista /> },       // /katalog/radovi
              { path: 'materijali', element: <MaterijaliLista /> } // /katalog/materijali
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
