import prisma from '../prisma';

// Jednostavna kalkulacija: sabira cenu radova + cenu materijala, vreme = zbir dana
export async function izracunajIKreirajKalkulaciju(prostorId: number) {
  const prostor = await prisma.prostor.findUnique({
    where: { id: prostorId },
    include: {
      radovi: {
        include: {
          rad: {
            include: {
              radMaterijali: {
                include: { materijal: true }
              }
            }
          }
        }
      }
    }
  });
  if (!prostor) throw new Error('Prostor ne postoji.');

  const kv = Number(prostor.kvadraturaM2);
  let trosakRadovi = 0;
  let trosakMaterijali = 0;
  let vremeDana = 0;

  for (const pr of prostor.radovi) {
    const r = pr.rad;
    trosakRadovi += r.cenaPoM2Rsd * kv;
    vremeDana += r.prosecnoTrajanjeDana;

    for (const rm of r.radMaterijali) {
      const kolicina = rm.potrosnjaPoM2 * kv;
      trosakMaterijali += Math.round(kolicina * rm.materijal.cenaPoJediniciRsd);
    }
  }

  const ukupno = trosakRadovi + trosakMaterijali;

  const k = await prisma.kalkulacija.create({
    data: {
      prostorId,
      ukupniTroskoviRsd: ukupno,
      procenjenoVremeDana: vremeDana
    }
  });

  return { kalkulacija: k, trosakRadovi, trosakMaterijali, ukupno, vremeDana };
}

export async function listaKalkulacija(prostorId: number) {
  return prisma.kalkulacija.findMany({
    where: { prostorId },
    orderBy: { datumKreiranja: 'desc' }
  });
}
