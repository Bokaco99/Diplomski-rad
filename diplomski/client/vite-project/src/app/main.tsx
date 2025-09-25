import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';                      
import { QueryClientProvider } from '@tanstack/react-query';
import { klijentUpita } from '../queryClient';       
import { TosterProvajder } from '../components/ui/Toast';
import { RouterAplikacije } from './router';         

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={klijentUpita}>
      <TosterProvajder>
          <RouterAplikacije />
      </TosterProvajder>
    </QueryClientProvider>
  </StrictMode>
);
