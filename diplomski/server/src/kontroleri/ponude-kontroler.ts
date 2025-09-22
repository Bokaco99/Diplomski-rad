import type { Request, Response } from 'express';
import prisma from '../prisma';
import { samoUloga } from '../middleware/auth';

export class PonudeKontroler {
  static async kreiraj(req: Request, res: Response) {
    try {
      if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
      if (req.identitet.uloga !== 'IZVODJAC') return res.status(403).json({ greska: 'Samo izvođač može da kreira ponudu.' });

      const prostorId = Number(req.params.prostorId);
      const { ukupnaCenaRsd, predvidjenoTrajanjeDana } = req.body;

      const p = await prisma.prostor.findUnique({ where: { id: prostorId } });
      if (!p) return res.status(404).json({ greska: 'Prostor nije pronađen.' });

      const ponuda = await prisma.ponuda.create({
        data: {
          korisnikIzvodjacId: req.identitet.korisnikId,
          prostorId,
          ukupnaCenaRsd: Number(ukupnaCenaRsd),
          predvidjenoTrajanjeDana: Number(predvidjenoTrajanjeDana),
        }
      });

      return res.status(201).json(ponuda);
    } catch (e: any) {
      return res.status(400).json({ greska: e.message });
    }
  }

  static async listaZaProstor(req: Request, res: Response) {
    const prostorId = Number(req.params.prostorId);
    const ponude = await prisma.ponuda.findMany({
      where: { prostorId },
      orderBy: { datumKreiranja: 'desc' },
      include: { izvodjac: { select: { id: true, ime: true, email: true } } }
    });
    return res.json(ponude);
  }

  static async promeniStatus(req: Request, res: Response) {
    try {
      if (!req.identitet) return res.status(401).json({ greska: 'Niste ulogovani.' });
      const ponudaId = Number(req.params.ponudaId);
      const { status } = req.body as { status: 'POSLATO' | 'PRIHVACENO' | 'ODBIJENO' };

      const p = await prisma.ponuda.update({ where: { id: ponudaId }, data: { status } });
      return res.json(p);
    } catch (e: any) {
      return res.status(400).json({ greska: e.message });
    }
  }
}
