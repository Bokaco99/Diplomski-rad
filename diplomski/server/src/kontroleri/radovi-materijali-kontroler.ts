import type { Request, Response } from 'express';
import prisma from '../prisma';


export class KatalogKontroler {
  static async radovi(_req: Request, res: Response) {
    const radovi = await prisma.rad.findMany({ orderBy: { naziv: 'asc' } });
    return res.json(radovi);
  }
  static async materijali(_req: Request, res: Response) {
    const materijali = await prisma.materijal.findMany({ orderBy: { naziv: 'asc' } });
    return res.json(materijali);
  }
  static async normativi(_req: Request, res: Response) {
    const normativi = await prisma.radMaterijal.findMany();
    return res.json(normativi);
  }
}
