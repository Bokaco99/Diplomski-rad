import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { klijentUpita } from './queryClient';
import { TosterProvider } from '../src/components/ui/Toast';
import { RouterAplikacije } from './app/router'; // putanja gde si ga stavio
import '@styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={klijentUpita}>
      <TosterProvider>
        <BrowserRouter>
          <RouterAplikacije />
        </BrowserRouter>
      </TosterProvider>
    </QueryClientProvider>
  </StrictMode>
);
