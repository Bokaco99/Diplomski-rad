-- CreateEnum
CREATE TYPE "public"."TipKorisnika" AS ENUM ('KLIJENT', 'IZVODJAC');

-- CreateEnum
CREATE TYPE "public"."TipProstora" AS ENUM ('STAN', 'KANCELARIJA', 'KUCA', 'DVORISTE');

-- CreateEnum
CREATE TYPE "public"."StatusPonude" AS ENUM ('POSLATO', 'PRIHVACENO', 'ODBIJENO');

-- CreateTable
CREATE TABLE "public"."Korisnik" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lozinkaHash" TEXT NOT NULL,
    "tip" "public"."TipKorisnika" NOT NULL,
    "kreiran" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Korisnik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prostor" (
    "id" SERIAL NOT NULL,
    "korisnikId" INTEGER NOT NULL,
    "naziv" TEXT NOT NULL,
    "kvadraturaM2" DOUBLE PRECISION NOT NULL,
    "tip" "public"."TipProstora" NOT NULL,
    "budzetRsd" INTEGER NOT NULL,
    "kreiran" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prostor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rad" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "prosecnoTrajanjeDana" INTEGER NOT NULL,
    "cenaPoM2Rsd" INTEGER NOT NULL,

    CONSTRAINT "Rad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Materijal" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "cenaPoJediniciRsd" INTEGER NOT NULL,
    "preporucenaKolicinaPoM2" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Materijal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RadMaterijal" (
    "radId" INTEGER NOT NULL,
    "materijalId" INTEGER NOT NULL,
    "potrosnjaPoM2" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RadMaterijal_pkey" PRIMARY KEY ("radId","materijalId")
);

-- CreateTable
CREATE TABLE "public"."ProstorRad" (
    "id" SERIAL NOT NULL,
    "prostorId" INTEGER NOT NULL,
    "radId" INTEGER NOT NULL,

    CONSTRAINT "ProstorRad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kalkulacija" (
    "id" SERIAL NOT NULL,
    "prostorId" INTEGER NOT NULL,
    "ukupniTroskoviRsd" INTEGER NOT NULL,
    "procenjenoVremeDana" INTEGER NOT NULL,
    "datumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kalkulacija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ponuda" (
    "id" SERIAL NOT NULL,
    "korisnikIzvodjacId" INTEGER NOT NULL,
    "prostorId" INTEGER NOT NULL,
    "ukupnaCenaRsd" INTEGER NOT NULL,
    "predvidjenoTrajanjeDana" INTEGER NOT NULL,
    "status" "public"."StatusPonude" NOT NULL DEFAULT 'POSLATO',
    "datumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ponuda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Korisnik_email_key" ON "public"."Korisnik"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProstorRad_prostorId_radId_key" ON "public"."ProstorRad"("prostorId", "radId");

-- AddForeignKey
ALTER TABLE "public"."Prostor" ADD CONSTRAINT "Prostor_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "public"."Korisnik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RadMaterijal" ADD CONSTRAINT "RadMaterijal_radId_fkey" FOREIGN KEY ("radId") REFERENCES "public"."Rad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RadMaterijal" ADD CONSTRAINT "RadMaterijal_materijalId_fkey" FOREIGN KEY ("materijalId") REFERENCES "public"."Materijal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProstorRad" ADD CONSTRAINT "ProstorRad_prostorId_fkey" FOREIGN KEY ("prostorId") REFERENCES "public"."Prostor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProstorRad" ADD CONSTRAINT "ProstorRad_radId_fkey" FOREIGN KEY ("radId") REFERENCES "public"."Rad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kalkulacija" ADD CONSTRAINT "Kalkulacija_prostorId_fkey" FOREIGN KEY ("prostorId") REFERENCES "public"."Prostor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ponuda" ADD CONSTRAINT "Ponuda_korisnikIzvodjacId_fkey" FOREIGN KEY ("korisnikIzvodjacId") REFERENCES "public"."Korisnik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ponuda" ADD CONSTRAINT "Ponuda_prostorId_fkey" FOREIGN KEY ("prostorId") REFERENCES "public"."Prostor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
