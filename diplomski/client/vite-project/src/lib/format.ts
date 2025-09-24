export function formatirajValutuRSD(vrednost: number) {
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 0
  }).format(vrednost);
}
