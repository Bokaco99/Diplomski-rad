import { Request, Response } from 'express';
import { prisma } from '../../prisma';
import { Prisma } from '@prisma/client';
// racunanje iznosa radova i materijala
async function izracunaj(prostorId: number) {
  const prostor = await prisma.prostor.findUnique({
    where: { id: prostorId },
    include: {
      radovi: { include: { rad: { include: { radMaterijali: { include: { materijal: true } } } } } }, 
    },
  });

  if (!prostor) throw new Error('Prostor ne postoji');
  const m2 = prostor.kvadraturaM2;
  let sumaRadova = 0;
  let sumaMaterijala = 0;
  let ukupnoDana = 0;

  const stavke: any[] = [];

  for (const veza of prostor.radovi) {
    const r = veza.rad;
    const cenaRada = (r.cenaPoM2Rsd ?? 0) * m2;
    sumaRadova += cenaRada;
    ukupnoDana += (r.prosecnoTrajanjeDana ?? 0);

    const stavkeMaterijala: any[] = [];
    for (const n of r.radMaterijali) {
      const kolicina = (n.potrosnjaPoM2 ?? 0) * m2;
      const iznos = kolicina * (n.materijal.cenaPoJediniciRsd ?? 0);
      sumaMaterijala += iznos;
      stavkeMaterijala.push({
        materijalId: n.materijalId,
        materijal: n.materijal.naziv,
        kolicina,
        cenaJed: n.materijal.cenaPoJediniciRsd,
        iznos,
      });
    }

    stavke.push({
      radId: r.id,
      rad: r.naziv,
      cenaPoM2: r.cenaPoM2Rsd,
      dana: r.prosecnoTrajanjeDana,
      iznosRada: cenaRada,
      materijali: stavkeMaterijala,
    });
  }

  const ukupno = sumaRadova + sumaMaterijala;

  const detalji = {
    kvadratura: m2,
    stavke,
    zbir: {
      radovi: sumaRadova,
      materijali: sumaMaterijala,
      ukupno,
      ukupnoDana,
    },
  };

  return { detalji, ukupno, ukupnoDana };
}

// cuvanje rezultata
export async function kreirajKalkulaciju(req: Request, res: Response) {
  const { prostorId } = req.body as { prostorId: number };

  // provera
  const pr = await prisma.prostor.findUnique({ where: { id: prostorId } });
  if (!pr) return res.status(404).json({ greska: 'Prostor nije pronađen' });
  if (pr.korisnikId !== req.korisnik!.id) {
    return res.status(403).json({ greska: 'Nije vaš prostor' });
  }

  const { detalji, ukupno, ukupnoDana } = await izracunaj(prostorId);

  const kalk = await prisma.kalkulacija.create({
    data: {
      prostorId,
      ukupniTroskoviRsd: ukupno,
      procenjenoVremeDana: ukupnoDana,
      detalji: detalji as Prisma.InputJsonValue
    },
  });

  return res.status(201).json({ kalkulacija: kalk });
}


export async function listaKalkulacija(req: Request, res: Response) {
  const prostorId = Number(req.query.prostorId);
  if (!prostorId) return res.status(400).json({ greska: 'Nedostaje prostorId' });

  const pr = await prisma.prostor.findUnique({ where: { id: prostorId } });
  if (!pr) return res.status(404).json({ greska: 'Prostor nije pronađen' });
  if (pr.korisnikId !== req.korisnik!.id) {
    return res.status(403).json({ greska: 'Nije vaš prostor' });
  }

  const kalkulacije = await prisma.kalkulacija.findMany({
    where: { prostorId },
    orderBy: { id: 'desc' },
  });

  return res.json({ kalkulacije });
}

// Detalj kalkulacije
export async function detaljKalkulacije(req: Request, res: Response) {
  const id = Number(req.params.id);
  const kal = await prisma.kalkulacija.findUnique({ where: { id } });
  if (!kal) return res.status(404).json({ greska: 'Kalkulacija nije pronađena' });

  // autorizacija preko prostora
  const pr = await prisma.prostor.findUnique({ where: { id: kal.prostorId } });
  if (!pr) return res.status(404).json({ greska: 'Prostor nije pronađen' });
  if (pr.korisnikId !== req.korisnik!.id) {
    return res.status(403).json({ greska: 'Nije vaš prostor' });
  }

  return res.json({ kalkulacija: kal });
}