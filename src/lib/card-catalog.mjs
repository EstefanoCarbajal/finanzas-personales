// Selección de los catálogos peruanos consultados el 23/11/2026.
// Los nombres de producto se conservan como claves dentro de cada banco y red.
export const cardCatalog = [
  {
    bank: 'BCP', design: 'bcp', source: 'https://www.viabcp.com/tarjetas/tarjetas-credito',
    networks: [
      { network: 'Visa', models: ['Clásica Qore', 'Oro Qore', 'Platinum Qore', 'Signature Qore', 'Infinite Qore', 'Clásica LATAM Pass', 'Oro LATAM Pass', 'Platinum LATAM Pass', 'Signature LATAM Pass', 'Infinite Sapphire LATAM Pass', 'Infinite Iridium LATAM Pass', 'Clásica', 'Light', 'iO'] },
      { network: 'American Express', models: ['Clásica LATAM Pass', 'Oro LATAM Pass', 'Platinum LATAM Pass', 'Black LATAM Pass'] },
    ],
  },
  {
    bank: 'BBVA', design: 'bbva', source: 'https://www.bbva.pe/personas/productos/tarjetas/credito.html',
    networks: [
      { network: 'Visa', models: ['Cero', 'Básica', 'Bfree', 'Platinum', 'Signature', 'Infinite'] },
      { network: 'Mastercard', models: ['Bfree', 'Platinum', 'Black'] },
    ],
  },
  {
    bank: 'Interbank', design: 'interbank', source: 'https://interbank.pe/tarjetas/tarjetas-credito',
    networks: [
      { network: 'Visa', models: ['Clásica', 'Oro', 'Platinum', 'Signature', 'Infinite', 'Premia', 'Access'] },
      { network: 'American Express', models: ['Benefit', 'Green', 'Gold', 'Platinum', 'Black', 'The Platinum Card'] },
    ],
  },
  {
    bank: 'Scotiabank', design: 'scotia', source: 'https://www.scotiabank.com.pe/Personas/tarjetas/credito',
    networks: [
      { network: 'Visa', models: ['Smart', 'Sin Membresía', 'Clásica', 'Oro', 'Platinum', 'Infinite', 'Singular Signature', 'Singular Infinite', 'AAdvantage Gold', 'AAdvantage Platinum', 'AAdvantage Signature', 'AAdvantage Infinite'] },
      { network: 'Mastercard', models: ['Clásica', 'Oro', 'Platinum', 'Singular Black', 'AAdvantage Gold', 'AAdvantage Platinum', 'AAdvantage Black'] },
    ],
  },
  {
    bank: 'Banco Falabella', design: 'falabella', source: 'https://www.bancofalabella.pe/tarjetas-credito-cmr/comparador',
    networks: [{ network: 'Visa', models: ['CMR Básica', 'CMR', 'CMR Platinum', 'CMR Signature'] }],
  },
  {
    bank: 'Banco Ripley', design: 'ripley', source: 'https://www.bancoripley.com.pe/tarjetas/tarjeta-mastercard-ripley.html',
    networks: [{ network: 'Mastercard', models: ['Ripley'] }],
  },
];

export function catalogBank(bank) {
  return cardCatalog.find(entry => entry.bank === bank);
}

export function modelsFor(bank, network) {
  return catalogBank(bank)?.networks.find(entry => entry.network === network)?.models ?? [];
}

export function catalogCardName(bank, network, model, lastFour) {
  return `${bank} ${network} ${model}${lastFour ? ` · ${lastFour}` : ''}`;
}
