import { Router } from 'express';
import { AuthKontroler } from '../kontroleri/auth-kontroler';
const r = Router();

r.post('/registracija', AuthKontroler.registracija);
r.post('/login', AuthKontroler.login);
r.post('/logout', AuthKontroler.logout);
r.get('/ja', AuthKontroler.ja);

export default r;
