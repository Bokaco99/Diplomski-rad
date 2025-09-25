import { Request, Response } from 'express';
import { prisma } from '../../prisma';


// Kreiranje prostora (vezan za prijavljenog klijenta)
export async function kreirajProstor(req: Request, res: Response) {
  const { naziv, kvadratura, tip, budzet } = req.body as {
    naziv: string;
    kvadratura: number;
    tip: 'STAN' | 'KANCELARIJA';
    budzet: number;
  };

  const korisnikId = req.korisnik!.id; // authObavezno popunjava

  const prostor = await prisma.prostor.create({
    data: {
      naziv,
      kvadraturaM2: kvadratura, 
      tip, 
      budzetRsd: budzet,      
      korisnikId,              
    },
  });

  return res.status(201).json({ prostor });
}

// Lista samo mojih prostora (ako je klijent)
export async function mojiProstori(req: Request, res: Response) {
  const korisnikId = req.korisnik!.id;

  const prostori = await prisma.prostor.findMany({
    where: { korisnikId },      
    orderBy: { id: 'desc' },
    include: {
      radovi: { include: { rad: true } },
    },
  });

  return res.json({ prostori });
}

// Postavljanje radova za prostor (zamenjuje celu listu)
export async function postaviRadoveZaProstor(req: Request, res: Response) {
  const prostorId = Number(req.params.id);
  const { radIds } = req.body as { radIds: number[] };

  const prostor = await prisma.prostor.findUnique({ where: { id: prostorId } });
  if (!prostor) return res.status(404).json({ greska: 'Prostor nije pronađen' });

  if (prostor.korisnikId !== req.korisnik!.id) { 
    return res.status(403).json({ greska: 'Nije vaš prostor' });
  }

  await prisma.$transaction([
    prisma.prostorRad.deleteMany({ where: { prostorId } }),
    prisma.prostorRad.createMany({
      data: radIds.map(radId => ({ prostorId, radId })),
      skipDuplicates: true,
    }),
  ]);

  const osvezen = await prisma.prostor.findUnique({
    where: { id: prostorId },
    include: { radovi: { include: { rad: true } } },
  });

  return res.json({ prostor: osvezen });
}

