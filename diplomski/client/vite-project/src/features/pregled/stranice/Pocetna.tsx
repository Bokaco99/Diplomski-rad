
import { Dugme } from '../../../components/ui/Button';
import { Kartica } from '../../../components/ui/Card';
import { Kostur } from '../../../components/ui/Skeleton';
import { odjava, normalizujUlogu } from '../../../features/auth/api';
import { useJa } from '../../../features/auth/hooks';
import {
  PocetnaOkvir,
  Stack,
  TitleRow,
  RoleBadge,
  Description,
  Actions,
  SkelTitle,
  SkelWide,
  SkelHalf,
} from './PocetnaLayout';


export default function PocetnaStrana() {
  const { podaci, ucitava } = useJa();

  async function klikOdjava() {
    try {
      await odjava();
    } finally {
      window.location.href = '/prijava';
    }
  }

  if (ucitava) {
    return (
      <PocetnaOkvir>
        <Kartica naslov="Učitavanje početne strane">
          <Stack>
            <SkelTitle><Kostur /></SkelTitle>
            <SkelWide><Kostur /></SkelWide>
            <SkelHalf><Kostur /></SkelHalf>
          </Stack>
        </Kartica>
      </PocetnaOkvir>
    );
  }

  const ulRaw = podaci?.identitet?.uloga;
  const uloga = normalizujUlogu(ulRaw) ?? 'NEPOZNATO';

  let naslov = 'Dobrodošli';
  let opis = 'Početna strana sistema.';
  if (uloga === 'KLIJENT') {
    naslov = 'Dobrodošli, klijente';
    opis =
      'Ovde možete da kreirate i uređujete svoje prostore, izaberete radove i materijale i pokrenete kalkulaciju troškova.';
  } else if (uloga === 'IZVODJAC') {
    naslov = 'Dobrodošli, izvođaču';
    opis =
      'Ovde možete da pregledate zahteve klijenata, pripremite ponude i ažurirate status svojih ponuda.';
  } else if (uloga === 'ADMIN') {
    naslov = 'Dobrodošli, administratore';
    opis =
      'Ovde možete da održavate katalog radova i materijala, upravljate korisnicima i nadgledate sistemske aktivnosti.';
  }

  return (
    <PocetnaOkvir>
      <Stack>
        <Kartica
          naslov={
            <TitleRow>
              <span>{naslov}</span>
              <RoleBadge>
                Uloga: {uloga}
                {uloga === 'NEPOZNATO' && ulRaw ? ` (${ulRaw})` : ''}
              </RoleBadge>
            </TitleRow>
          }
        >
          <Description>{opis}</Description>
          <Actions>
            <Dugme rezim="secondary" onClick={klikOdjava}>
              Odjava
            </Dugme>
          </Actions>
        </Kartica>
      </Stack>
    </PocetnaOkvir>
  );
}


