export const BANK_GROUPS = [
  { label: 'Bancos principales', options: [
    ['BCP', 'BCP'], ['BBVA', 'BBVA'], ['Interbank', 'Interbank'], ['Scotiabank', 'Scotiabank'],
  ] },
  { label: 'Bancos y cajas digitales', options: [
    ['BanBif', 'BanBif'], ['Banco Pichincha', 'Banco Pichincha'], ['Banco Falabella', 'Banco Falabella'],
    ['Banco Ripley', 'Banco Ripley'], ['Caja Arequipa', 'Caja Arequipa'], ['Mibanco', 'Mibanco'],
  ] },
];
export const BANK_CODES = new Set(BANK_GROUPS.flatMap(group => group.options.map(([code]) => code)));
