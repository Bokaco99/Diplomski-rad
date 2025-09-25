import { Request, Response } from 'express';
import { prisma } from '../../prisma';

// Svi radovi 
export async function listajRadove(_req: Request, res: Response) {
  const radovi = await prisma.rad.findMany({
    orderBy: { naziv: 'asc' },
    include: {
      radMaterijali: {
        include: { materijal: true },
      },
    },
  });

  const radoviDto = radovi.map(({ radMaterijali, ...rest }) => ({
    ...rest,
    normativi: radMaterijali.map(rm => ({
      materijal: rm.materijal,
      potrosnjaPoM2: rm.potrosnjaPoM2,
    })),
  }));

  res.json({ radovi: radoviDto });
}

// Svi materijali
export async function listajMaterijale(_req: Request, res: Response) {
  const materijali = await prisma.materijal.findMany({ orderBy: { naziv: 'asc' } });
  res.json({ materijali });
}
