import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { KONFIG } from './config';
import { autentikacija } from './middleware/auth';

import authRute from './rute/auth-rute';
import prostoriRute from './rute/prostori-rute';
import katalogRute from './rute/radovi-materijali-rute';
import kalkRute from './rute/kalkulacije-rute';
import ponudeRute from './rute/ponude-rute';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: KONFIG.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(autentikacija); // parsira JWT iz cookie-a i puni req.identitet

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// API rute
app.use('/api/auth', authRute);
app.use('/api/prostori', prostoriRute);
app.use('/api/katalog', katalogRute);
app.use('/api/kalkulacije', kalkRute);
app.use('/api/ponude', ponudeRute);

export default app;
