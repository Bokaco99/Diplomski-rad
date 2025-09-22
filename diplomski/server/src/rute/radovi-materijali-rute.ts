import { Router } from 'express';
import { KatalogKontroler } from '../kontroleri/radovi-materijali-kontroler';

const r = Router();
r.get('/radovi', KatalogKontroler.radovi);
r.get('/materijali', KatalogKontroler.materijali);
r.get('/normativi', KatalogKontroler.normativi);

export default r;
