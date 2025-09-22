import { PrismaClient, TipKorisnika, TipProstora } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Ovaj seed:
 * - Kreira više klijenata i izvođača (sa istom lozinkom: "lozinka123")
 * - Dodaje bogat skup radova i materijala (sa normativima po m2)
 * - Kreira primere prostora (stan, kuća, kancelarija, dvorište)
 * - Povezuje konkretne radove sa prostorima (ProstorRad)
 *
 * Napomena:
 * - Sve cene su u RSD (int), kvadrature su u m2 (float), trajanja u danima (int)
 * - Normativi su ilustrativni i služe za prezentaciju (mogu se korigovati po potrebi)
 */

const prisma = new PrismaClient();
const ROUNDS = 10;

// Bcrypt hash za "lozinka123"
const HASH = await bcrypt.hash('lozinka123', ROUNDS);
const OLD_HASH = '$2a$10$Q3D/6m8YH7u9w5v7k1/bOe0g0N2xKf0ZCk8a2m1y6g4Vq2P5FfQ4K';

async function seedKorisnici() {

  // Klijenti
  const klijenti = [
    { ime: 'Ana Klijent', email: 'ana.klijent@primer.rs'},
    { ime: 'Milan Investitor', email: 'milan.investitor@primer.rs' },
    { ime: 'Jelena Vlasnik', email: 'jelena.vlasnik@primer.rs' }
  ];

  // Izvođači (naziv sugeriše specijalnosti radi prezentacije)
  const izvodjaci = [
    { ime: 'Marko Gips & Krečenje', email: 'marko.gips@primer.rs' },
    { ime: 'Stefan Vodoinstalater', email: 'stefan.voda@primer.rs' },
    { ime: 'Nikola Elektro', email: 'nikola.elektro@primer.rs' },
    { ime: 'Petar Krov & Beton', email: 'petar.krov@primer.rs' },
    { ime: 'Vladimir Stolarski Radovi', email: 'vladimir.namestaj@primer.rs' },
    { ime: 'Bazen Sistem', email: 'bazen.sistem@primer.rs' },
    { ime: 'Kapije & Ograde', email: 'kapije.ograde@primer.rs' }
  ];

  for (const k of klijenti) {
    await prisma.korisnik.upsert({
      where: { email: k.email },
      update: {},
      create: { ime: k.ime, email: k.email, lozinkaHash: HASH, tip: TipKorisnika.KLIJENT }
    });
  }

  for (const i of izvodjaci) {
    await prisma.korisnik.upsert({
      where: { email: i.email },
      update: {},
      create: { ime: i.ime, email: i.email, lozinkaHash: HASH, tip: TipKorisnika.IZVODJAC }
    });
  }

  console.log('✅ Seed: korisnici kreirani');
}

async function seedRadoviIMaterijali() {
  // ---- RADOVI (osnovni + novi) ----
  const radovi = [
    // Postojeći
    { id: 1,  naziv: 'Krečenje', opis: 'Priprema zidova i krečenje u dve ruke.', prosecnoTrajanjeDana: 2,  cenaPoM2Rsd: 250 },
    { id: 2,  naziv: 'Zamena podova', opis: 'Uklanjanje starih i postavljanje novih podnih obloga.', prosecnoTrajanjeDana: 3,  cenaPoM2Rsd: 1200 },
    { id: 3,  naziv: 'Keramičarski radovi', opis: 'Postavljanje keramičkih pločica u kupatilu ili kuhinji.', prosecnoTrajanjeDana: 4,  cenaPoM2Rsd: 1800 },

    // Novi
    { id: 4,  naziv: 'Izrada nameštaja', opis: 'Mera, projektovanje i izrada pločastog i masivnog nameštaja po meri.', prosecnoTrajanjeDana: 7,  cenaPoM2Rsd: 3500 },
    { id: 5,  naziv: 'Montaža nameštaja', opis: 'Sklapanje i montaža gotovog nameštaja (npr. IKEA).', prosecnoTrajanjeDana: 1,  cenaPoM2Rsd: 700 },
    { id: 6,  naziv: 'Vodoinstalaterski radovi', opis: 'Sprovođenje vode, zamena i ugradnja cevi i sanitarija.', prosecnoTrajanjeDana: 3,  cenaPoM2Rsd: 1600 },
    { id: 7,  naziv: 'Elektroinstalaterski radovi', opis: 'Sprovođenje struje, kabliranje, osigurači i razvodne kutije.', prosecnoTrajanjeDana: 3,  cenaPoM2Rsd: 1500 },
    { id: 8,  naziv: 'Krovopokrivački radovi', opis: 'Renoviranje ili postavljanje krova (crep, letve, hidroizolacija).', prosecnoTrajanjeDana: 10, cenaPoM2Rsd: 4200 },
    { id: 9,  naziv: 'Betoniranje', opis: 'Priprema i izlivanje betona sa armaturom po potrebi.', prosecnoTrajanjeDana: 5,  cenaPoM2Rsd: 3000 },
    { id: 10, naziv: 'Ugradnja bazena u dvorištu', opis: 'Iskop, betoniranje, hidroizolacija i ugradnja bazenskog sistema.', prosecnoTrajanjeDana: 12, cenaPoM2Rsd: 8500 },
    { id: 11, naziv: 'Gipsani radovi', opis: 'Gips karton sistemi, pregradni zidovi i spušteni plafoni.', prosecnoTrajanjeDana: 4,  cenaPoM2Rsd: 2000 },
    { id: 12, naziv: 'Vrata i prozori', opis: 'Postavljanje i zamena vrata i prozora sa okovima.', prosecnoTrajanjeDana: 2,  cenaPoM2Rsd: 2800 },
    { id: 13, naziv: 'Kapije i ograde', opis: 'Izrada i postavljanje kapija/ograda, sa ili bez motora.', prosecnoTrajanjeDana: 6,  cenaPoM2Rsd: 3800 }
  ];

  await prisma.$transaction([
    prisma.radMaterijal.deleteMany(),
    prisma.prostorRad.deleteMany(),
    prisma.kalkulacija.deleteMany(),
    prisma.ponuda.deleteMany(),
    prisma.rad.deleteMany(),
    prisma.materijal.deleteMany()
  ]);

  await prisma.rad.createMany({ data: radovi });

  // ---- MATERIJALI ----
  const materijali = [
    // Krečenje / glet
    { id: 1,  naziv: 'Unutrašnja boja (10L)',           cenaPoJediniciRsd: 2800, preporucenaKolicinaPoM2: 0.12 },
    { id: 2,  naziv: 'Glet masa (25kg)',                cenaPoJediniciRsd: 1500, preporucenaKolicinaPoM2: 0.08 },

    // Podovi
    { id: 3,  naziv: 'Laminat (paket 2.5m²)',           cenaPoJediniciRsd: 2200, preporucenaKolicinaPoM2: 0.40 },
    { id: 4,  naziv: 'Podna podloga (rola 10m²)',       cenaPoJediniciRsd: 1200, preporucenaKolicinaPoM2: 0.10 },

    // Keramika
    { id: 5,  naziv: 'Lepak za pločice (25kg)',         cenaPoJediniciRsd: 900,  preporucenaKolicinaPoM2: 0.20 },
    { id: 6,  naziv: 'Keramičke pločice (1.5m²/kutija)',cenaPoJediniciRsd: 2600, preporucenaKolicinaPoM2: 0.67 },
    { id: 7,  naziv: 'Fug masa (5kg)',                  cenaPoJediniciRsd: 700,  preporucenaKolicinaPoM2: 0.10 },

    // Stolarski / nameštaj
    { id: 8,  naziv: 'Ploča iverica/MDF (2.5m²/kom)',   cenaPoJediniciRsd: 3100, preporucenaKolicinaPoM2: 0.30 },
    { id: 9,  naziv: 'Okov i šrafovi (set)',            cenaPoJediniciRsd: 800,  preporucenaKolicinaPoM2: 0.15 },

    // Vodoinstalacije
    { id: 10, naziv: 'PPR cevi (dužina po m)',          cenaPoJediniciRsd: 300,  preporucenaKolicinaPoM2: 1.20 },
    { id: 11, naziv: 'PPR fitinzi (set po m²)',         cenaPoJediniciRsd: 350,  preporucenaKolicinaPoM2: 0.50 },
    { id: 12, naziv: 'Sanitarije (set po m²)',          cenaPoJediniciRsd: 4500, preporucenaKolicinaPoM2: 0.05 },

    // Elektro
    { id: 13, naziv: 'Kablovi (dužina po m)',           cenaPoJediniciRsd: 120,  preporucenaKolicinaPoM2: 2.00 },
    { id: 14, naziv: 'Razvodne kutije (kom)',           cenaPoJediniciRsd: 300,  preporucenaKolicinaPoM2: 0.08 },
    { id: 15, naziv: 'Osigurači i tabla (set po m²)',   cenaPoJediniciRsd: 3200, preporucenaKolicinaPoM2: 0.03 },

    // Krov
    { id: 16, naziv: 'Crep (1m²)',                      cenaPoJediniciRsd: 900,  preporucenaKolicinaPoM2: 1.00 },
    { id: 17, naziv: 'Letve (dužina po m)',             cenaPoJediniciRsd: 200,  preporucenaKolicinaPoM2: 1.50 },
    { id: 18, naziv: 'Hidroizolacija (rola 10m²)',      cenaPoJediniciRsd: 3500, preporucenaKolicinaPoM2: 0.12 },

    // Beton
    { id: 19, naziv: 'Beton (m³)',                      cenaPoJediniciRsd: 11000, preporucenaKolicinaPoM2: 0.08 },
    { id: 20, naziv: 'Armatura (kg)',                   cenaPoJediniciRsd: 160,   preporucenaKolicinaPoM2: 3.00 },

    // Bazen
    { id: 21, naziv: 'Bazen folija/kalup (m²)',         cenaPoJediniciRsd: 4500,  preporucenaKolicinaPoM2: 1.00 },
    { id: 22, naziv: 'Pumpa i filter (set po m²)',      cenaPoJediniciRsd: 8000,  preporucenaKolicinaPoM2: 0.02 },
    { id: 23, naziv: 'Hemija za bazen (set po m²)',     cenaPoJediniciRsd: 1500,  preporucenaKolicinaPoM2: 0.03 },

    // Gips
    { id: 24, naziv: 'Gips ploče (3m²/ploča)',          cenaPoJediniciRsd: 1800,  preporucenaKolicinaPoM2: 0.34 },
    { id: 25, naziv: 'CD/UD profili (dužina po m)',     cenaPoJediniciRsd: 250,   preporucenaKolicinaPoM2: 1.20 },
    { id: 26, naziv: 'Tiple i šrafovi (set)',           cenaPoJediniciRsd: 600,   preporucenaKolicinaPoM2: 0.20 },

    // Stolarija
    { id: 27, naziv: 'Set vrata (komplet)',             cenaPoJediniciRsd: 17000, preporucenaKolicinaPoM2: 0.02 },
    { id: 28, naziv: 'Prozorski set (komplet)',         cenaPoJediniciRsd: 24000, preporucenaKolicinaPoM2: 0.015 },
    { id: 29, naziv: 'Pena i silikoni (set)',           cenaPoJediniciRsd: 900,   preporucenaKolicinaPoM2: 0.06 },

    // Kapije/ograde
    { id: 30, naziv: 'Metalni paneli (1m²)',            cenaPoJediniciRsd: 2600,  preporucenaKolicinaPoM2: 1.00 },
    { id: 31, naziv: 'Stubovi i šarke (set po m²)',     cenaPoJediniciRsd: 1800,  preporucenaKolicinaPoM2: 0.10 },
    { id: 32, naziv: 'Motor za kapiju (set po m²)',     cenaPoJediniciRsd: 22000, preporucenaKolicinaPoM2: 0.01 }
  ];

  await prisma.materijal.createMany({ data: materijali });

  // ---- NORMATIVI (rad ↔ materijal) ----
  const mById = new Map<number, typeof materijali[number]>(materijali.map(m => [m.id, m]));

  const normativi: { radId: number; materijalId: number; potrosnjaPoM2: number }[] = [
    // Krečenje
    { radId: 1, materijalId: 1, potrosnjaPoM2: mById.get(1)!.preporucenaKolicinaPoM2 },
    { radId: 1, materijalId: 2, potrosnjaPoM2: mById.get(2)!.preporucenaKolicinaPoM2 },

    // Zamena podova
    { radId: 2, materijalId: 3, potrosnjaPoM2: mById.get(3)!.preporucenaKolicinaPoM2 },
    { radId: 2, materijalId: 4, potrosnjaPoM2: mById.get(4)!.preporucenaKolicinaPoM2 },

    // Keramičarski radovi
    { radId: 3, materijalId: 5, potrosnjaPoM2: mById.get(5)!.preporucenaKolicinaPoM2 },
    { radId: 3, materijalId: 6, potrosnjaPoM2: mById.get(6)!.preporucenaKolicinaPoM2 },
    { radId: 3, materijalId: 7, potrosnjaPoM2: mById.get(7)!.preporucenaKolicinaPoM2 },

    // Izrada nameštaja
    { radId: 4, materijalId: 8, potrosnjaPoM2: mById.get(8)!.preporucenaKolicinaPoM2 },
    { radId: 4, materijalId: 9, potrosnjaPoM2: mById.get(9)!.preporucenaKolicinaPoM2 },

    // Montaža nameštaja
    { radId: 5, materijalId: 9, potrosnjaPoM2: Math.max(0.08, mById.get(9)!.preporucenaKolicinaPoM2 * 0.6) },

    // Voda
    { radId: 6, materijalId: 10, potrosnjaPoM2: mById.get(10)!.preporucenaKolicinaPoM2 },
    { radId: 6, materijalId: 11, potrosnjaPoM2: mById.get(11)!.preporucenaKolicinaPoM2 },
    { radId: 6, materijalId: 12, potrosnjaPoM2: mById.get(12)!.preporucenaKolicinaPoM2 },

    // Struja
    { radId: 7, materijalId: 13, potrosnjaPoM2: mById.get(13)!.preporucenaKolicinaPoM2 },
    { radId: 7, materijalId: 14, potrosnjaPoM2: mById.get(14)!.preporucenaKolicinaPoM2 },
    { radId: 7, materijalId: 15, potrosnjaPoM2: mById.get(15)!.preporucenaKolicinaPoM2 },

    // Krov
    { radId: 8, materijalId: 16, potrosnjaPoM2: mById.get(16)!.preporucenaKolicinaPoM2 },
    { radId: 8, materijalId: 17, potrosnjaPoM2: mById.get(17)!.preporucenaKolicinaPoM2 },
    { radId: 8, materijalId: 18, potrosnjaPoM2: mById.get(18)!.preporucenaKolicinaPoM2 },

    // Beton
    { radId: 9,  materijalId: 19, potrosnjaPoM2: mById.get(19)!.preporucenaKolicinaPoM2 },
    { radId: 9,  materijalId: 20, potrosnjaPoM2: mById.get(20)!.preporucenaKolicinaPoM2 },

    // Bazen
    { radId: 10, materijalId: 19, potrosnjaPoM2: Math.max(0.05, mById.get(19)!.preporucenaKolicinaPoM2 * 0.8) },
    { radId: 10, materijalId: 21, potrosnjaPoM2: mById.get(21)!.preporucenaKolicinaPoM2 },
    { radId: 10, materijalId: 22, potrosnjaPoM2: mById.get(22)!.preporucenaKolicinaPoM2 },
    { radId: 10, materijalId: 23, potrosnjaPoM2: mById.get(23)!.preporucenaKolicinaPoM2 },

    // Gips
    { radId: 11, materijalId: 24, potrosnjaPoM2: mById.get(24)!.preporucenaKolicinaPoM2 },
    { radId: 11, materijalId: 25, potrosnjaPoM2: mById.get(25)!.preporucenaKolicinaPoM2 },
    { radId: 11, materijalId: 26, potrosnjaPoM2: mById.get(26)!.preporucenaKolicinaPoM2 },

    // Vrata i prozori
    { radId: 12, materijalId: 27, potrosnjaPoM2: mById.get(27)!.preporucenaKolicinaPoM2 },
    { radId: 12, materijalId: 28, potrosnjaPoM2: mById.get(28)!.preporucenaKolicinaPoM2 },
    { radId: 12, materijalId: 29, potrosnjaPoM2: mById.get(29)!.preporucenaKolicinaPoM2 },

    // Kapije i ograde
    { radId: 13, materijalId: 30, potrosnjaPoM2: mById.get(30)!.preporucenaKolicinaPoM2 },
    { radId: 13, materijalId: 31, potrosnjaPoM2: mById.get(31)!.preporucenaKolicinaPoM2 },
    { radId: 13, materijalId: 32, potrosnjaPoM2: mById.get(32)!.preporucenaKolicinaPoM2 }
  ];

  await prisma.radMaterijal.createMany({ data: normativi, skipDuplicates: true });

  console.log('✅ Seed: radovi, materijali i normativi kreirani');
}

async function seedProstoriISelektovaniRadovi() {
  // Uzmemo neke klijente
  const ana = await prisma.korisnik.findUnique({ where: { email: 'ana.klijent@primer.rs' } });
  const milan = await prisma.korisnik.findUnique({ where: { email: 'milan.investitor@primer.rs' } });
  const jelena = await prisma.korisnik.findUnique({ where: { email: 'jelena.vlasnik@primer.rs' } });

  if (!ana || !milan || !jelena) throw new Error('Nedostaju klijenti za seed');

  // Kreiramo prostore (stan, kuća, kancelarija, dvorište)
  const prostori = await prisma.$transaction([
    prisma.prostor.create({
      data: {
        korisnikId: ana.id,
        naziv: 'Stan - Vračar',
        kvadraturaM2: 55,
        tip: TipProstora.STAN,
        budzetRsd: 900_000
      }
    }),
    prisma.prostor.create({
      data: {
        korisnikId: milan.id,
        naziv: 'Kuća - Zemun',
        kvadraturaM2: 120,
        tip: TipProstora.KUCA,
        budzetRsd: 2_500_000
      }
    }),
    prisma.prostor.create({
      data: {
        korisnikId: milan.id,
        naziv: 'Kancelarija - Novi Beograd',
        kvadraturaM2: 90,
        tip: TipProstora.KANCELARIJA,
        budzetRsd: 1_800_000
      }
    }),
    prisma.prostor.create({
      data: {
        korisnikId: jelena.id,
        naziv: 'Dvorište - Voždovac',
        kvadraturaM2: 80,
        tip: TipProstora.DVORISTE,
        budzetRsd: 1_600_000
      }
    })
  ]);

  // Povežemo odabrane radove po prostoru
  const [stan, kuca, kancelarija, dvoriste] = prostori;

  const parovi: Array<{ prostorId: number; radId: number }> = [
    // Stan
    { prostorId: stan.id, radId: 1 },  // Krečenje
    { prostorId: stan.id, radId: 11 }, // Gips
    { prostorId: stan.id, radId: 2 },  // Zamena podova

    // Kuća
    { prostorId: kuca.id, radId: 8 },  // Krov
    { prostorId: kuca.id, radId: 7 },  // Struja
    { prostorId: kuca.id, radId: 6 },  // Voda
    { prostorId: kuca.id, radId: 9 },  // Beton

    // Kancelarija
    { prostorId: kancelarija.id, radId: 11 }, // Gips
    { prostorId: kancelarija.id, radId: 3 },  // Keramika
    { prostorId: kancelarija.id, radId: 12 }, // Vrata i prozori

    // Dvorište
    { prostorId: dvoriste.id, radId: 10 }, // Bazen
    { prostorId: dvoriste.id, radId: 13 }, // Kapije i ograde
    { prostorId: dvoriste.id, radId: 9 }   // Beton
  ];

  await prisma.prostorRad.createMany({ data: parovi, skipDuplicates: true });

  console.log('✅ Seed: prostori i izbor radova povezani');
}

async function main() {
  await seedKorisnici();
  await seedRadoviIMaterijali();
  await seedProstoriISelektovaniRadovi();
  console.log('🎉 Seed kompletiran.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
