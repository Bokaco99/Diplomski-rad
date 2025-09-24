import { Router } from 'express';
import { validiraj } from '../../middleware/zodValidate';
import { authObavezno } from '../../middleware/auth';
import { shemaRegistracije, shemaLogina } from './auth.sheme';
import { registracija, login, ja, logout } from './auth.kontroler';

const r = Router();

r.post('/registracija', validiraj(shemaRegistracije), registracija);
r.post('/login', validiraj(shemaLogina), login);
r.get('/ja', authObavezno, ja);
r.post('/logout', authObavezno, logout);

export default r;
