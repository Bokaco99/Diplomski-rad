import type { Request, Response } from 'express';
import prisma from '../prisma';

export class ProstoriKontroler {
  static async kreiraj(req: Request, res: Response) {
    try {
      if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
      const { naziv, kvadraturaM2, tip, budzetRsd } = req.body;
      const prostor = await prisma.prostor.create({
        data: {
          korisnikId: req.identitet.korisnikId,
          naziv, kvadraturaM2: Number(kvadraturaM2), tip, budzetRsd: Number(budzetRsd)
        }
      });
      return res.status(201).json(prostor);
    } catch (e: any) {
      return res.status(400).json({ greska: e.message });
    }
  }

  static async moji(req: Request, res: Response) {
    if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
    const prostori = await prisma.prostor.findMany({
      where: { korisnikId: req.identitet.korisnikId },
      orderBy: { kreiran: 'desc' }
    });
    return res.json(prostori);
  }

  static async postaviRadove(req: Request, res: Response) {
    try {
      if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
      const prostorId = Number(req.params.id);
      const { radIds } = req.body as { radIds: number[] };

      // Provera vlasništva
      const p = await prisma.prostor.findUnique({ where: { id: prostorId } });
      if (!p || p.korisnikId !== req.identitet.korisnikId) return res.status(404).json({ greska: 'Prostor nije pronađen.' });

      await prisma.prostorRad.deleteMany({ where: { prostorId } });
      if (Array.isArray(radIds) && radIds.length > 0) {
        await prisma.prostorRad.createMany({
          data: radIds.map((radId) => ({ prostorId, radId }))
        });
      }
      return res.json({ ok: true });
    } catch (e: any) {
      return res.status(400).json({ greska: e.message });
    }
  }
}
