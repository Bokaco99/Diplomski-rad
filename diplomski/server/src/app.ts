import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { KONFIG } from './config';
import { autentikacija } from './middleware/auth';
import { napraviToken } from './utils/jwt';

import authRute from './rute/auth-rute';
import prostoriRute from './rute/prostori-rute';
import katalogRute from './rute/radovi-materijali-rute';
import kalkRute from './rute/kalkulacije-rute';
import ponudeRute from './rute/ponude-rute';

const app = express();

app.use(express.json());                   
app.use(express.urlencoded({ extended: true })); 

// Middleware
app.use(helmet());
app.use(cors({ origin: KONFIG.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(autentikacija); 

// Health
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

//  DEV pomocne rute 
if (process.env.NODE_ENV !== 'production') {
  
  app.post('/api/auth/dev-login', (_req, res) => {
    const token = napraviToken({ korisnikId: 1, uloga: 'KLIJENT' as const });

    res.cookie(KONFIG.jwtCookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
      path: '/', 
    });

    return res.json({ ok: true, napomena: 'Postavljen je JWT cookie za test korisnika.' });
  });

  
  app.get('/api/debug/ko-sam', (req, res) => {
    res.json({
      jwtCookieName: KONFIG.jwtCookieName,
      rawCookieHeader: req.headers.cookie ?? null,
      cookiesParsed: req.cookies ?? null,
      identitet: req.identitet ?? null,
    });
  });
}

// ---------------------- API rute ----------------------
app.use('/api/auth', authRute);
app.use('/api/prostori', prostoriRute);
app.use('/api/spaces', prostoriRute);
app.use('/api/katalog', katalogRute);
app.use('/api/kalkulacije', kalkRute);
app.use('/api/ponude', ponudeRute);

app.listen(3001, () => console.log('API sluša na 3001'));

app.use((err:any, _req:any, res:any, _next:any) => {
  console.error(' API error:', err);
  res.status(err.status || 500).json({ greska: err.message || 'Server error' });
});

export default app;
