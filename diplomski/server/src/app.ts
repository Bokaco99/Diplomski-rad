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
app.use(autentikacija); // parsira JWT iz cookie-a i puni req.identitet

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ---------- DEV pomoćne rute (uključene samo van produkcije) ----------
if (process.env.NODE_ENV !== 'production') {
  // 1) DEV-LOGIN: napravi test token i postavi HTTP-only cookie
  app.post('/api/auth/dev-login', (_req, res) => {
    const token = napraviToken({ korisnikId: 1, uloga: 'KLIJENT' as const });

    res.cookie(KONFIG.jwtCookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dana
      path: '/', // <-- dodato radi simetrije sa clearCookie
    });

    return res.json({ ok: true, napomena: 'Postavljen je JWT cookie za test korisnika.' });
  });

  // 2) DEBUG: vidi šta je middleware pročitao
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
app.use('/api/katalog', katalogRute);
app.use('/api/kalkulacije', kalkRute);
app.use('/api/ponude', ponudeRute);

app.listen(3001, () => console.log('API sluša na 3001'));

export default app;
