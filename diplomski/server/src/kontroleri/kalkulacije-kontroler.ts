import type { Request, Response } from 'express';
import prisma from '../prisma';
import { izracunajIKreirajKalkulaciju, listaKalkulacija } from '../servisi/kalkulacije-servis';

export class KalkulacijeKontroler {
  static async kreiraj(req: Request, res: Response) {
    try {
      if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });

      const { prostorId } = req.params as unknown as { prostorId: number };
      const korisnikId = req.identitet.korisnikId;

      // Provera 
      const p = await prisma.prostor.findUnique({ where: { id: prostorId }, select: {korisnikId:true}});

       if (!p) return res.status(404).json({ greska: 'Prostor nije pronađen.' });
      if (p.korisnikId !== req.identitet.korisnikId) {
        return res.status(403).json({ greska: 'Nemate pristup ovom prostoru.' });
      }

      const rezultat = await izracunajIKreirajKalkulaciju(prostorId);
      return res.status(201).json(rezultat);
    } catch (e: any) {
      return res.status(400).json({ greska: e?.message ?? 'Neuspešna kalkulacija.'});
    }
  }

  static async lista(req: Request, res: Response) {
    if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });

    const { prostorId } = req.params as unknown as { prostorId: number };

    if (!Number.isInteger(prostorId) || prostorId <= 0) {
    return res.status(400).json({ greska: 'Nevažeći prostorId.' });
  }
    const korisnikId = req.identitet!.korisnikId;
    // Dozvole
    const p = await prisma.prostor.findUnique({ where: { id: prostorId },select: { korisnikId: true } });
     if (!p) return res.status(404).json({ greska: 'Prostor nije pronađen.' });
      if (p.korisnikId !== req.identitet.korisnikId) {
        return res.status(403).json({ greska: 'Nemate pristup ovom prostoru.' });
      }
    const lista = await listaKalkulacija(prostorId);
    return res.json(lista);
  } 
}
