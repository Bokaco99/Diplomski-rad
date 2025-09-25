import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';                      
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { klijentUpita } from '../queryClient';       
import { TosterProvajder } from '../components/ui/Toast';
import { RouterAplikacije } from './router';         

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={klijentUpita}>
      <TosterProvajder>
        <BrowserRouter>
          <RouterAplikacije />
        </BrowserRouter>
      </TosterProvajder>
    </QueryClientProvider>
  </StrictMode>
);
