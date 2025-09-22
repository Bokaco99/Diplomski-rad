import type { Request, Response } from 'express';
import prisma from '../prisma';
import { izracunajIKreirajKalkulaciju, listaKalkulacija } from '../servisi/kalkulacije-servis';

export class KalkulacijeKontroler {
  static async kreiraj(req: Request, res: Response) {
    try {
      if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
      const prostorId = Number(req.params.prostorId);

      // Provera vlasništva (klijent)
      const p = await prisma.prostor.findUnique({ where: { id: prostorId } });
      if (!p || p.korisnikId !== req.identitet.korisnikId) return res.status(404).json({ greska: 'Prostor nije pronađen.' });

      const rezultat = await izracunajIKreirajKalkulaciju(prostorId);
      return res.status(201).json(rezultat);
    } catch (e: any) {
      return res.status(400).json({ greska: e.message });
    }
  }

  static async lista(req: Request, res: Response) {
    if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
    const prostorId = Number(req.params.prostorId);

    // Dozvoli vlasniku da vidi svoje kalkulacije
    const p = await prisma.prostor.findUnique({ where: { id: prostorId } });
    if (!p || p.korisnikId !== req.identitet.korisnikId) return res.status(404).json({ greska: 'Prostor nije pronađen.' });

    const lista = await listaKalkulacija(prostorId);
    return res.json(lista);
  }
}
