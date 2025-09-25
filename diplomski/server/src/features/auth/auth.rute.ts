import { Router } from 'express';
import { validiraj } from '../../middleware/zodValidate';
import { authObavezno } from '../../middleware/auth';
import { shemaRegistracije, shemaLogina } from './auth.sheme';
import { registracija, login, ja, logout } from './auth.kontroler';
import { normalizeLoginBody } from '../../middleware/normalizeLoginBody';

const r = Router();
r.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    if (req.body.password && !req.body.lozinka) {
      req.body.lozinka = req.body.password;
    }
  }
  next();
});
r.post(['/registracija', '/register'], validiraj(shemaRegistracije), registracija);
r.post(['/prijava', '/login'], normalizeLoginBody, validiraj(shemaLogina), login);
r.get('/ja', authObavezno, ja);
r.post(['/logout', '/signout'], authObavezno, logout);

export default r;
