export const categoryIcons = [
  { id: 'food', label: 'Alimentación', tone: 'sun' },
  { id: 'transport', label: 'Transporte', tone: 'blue' },
  { id: 'home', label: 'Hogar', tone: 'violet' },
  { id: 'fun', label: 'Ocio', tone: 'pink' },
  { id: 'health', label: 'Salud', tone: 'leaf' },
  { id: 'bag', label: 'Compras', tone: 'pink' },
  { id: 'education', label: 'Educación', tone: 'blue' },
  { id: 'pet', label: 'Mascotas', tone: 'sun' },
  { id: 'coffee', label: 'Café', tone: 'sand' },
  { id: 'gift', label: 'Regalos', tone: 'violet' },
  { id: 'salary', label: 'Sueldo', tone: 'leaf' },
  { id: 'work', label: 'Trabajo', tone: 'sand' },
  { id: 'growth', label: 'Inversiones', tone: 'leaf' },
  { id: 'heart', label: 'Bienestar', tone: 'pink' },
  { id: 'travel', label: 'Viajes', tone: 'blue' },
  { id: 'tag', label: 'Otros', tone: 'violet' },
];
export const validCategoryIcon = value => typeof value === 'string' && categoryIcons.some(icon => icon.id === value);

export const categoryColors = [
  { id: 'sun', label: 'Ámbar' }, { id: 'leaf', label: 'Verde' },
  { id: 'blue', label: 'Azul' }, { id: 'violet', label: 'Violeta' },
  { id: 'pink', label: 'Rosa' }, { id: 'sand', label: 'Arena' },
];
export const validCategoryColor = value => categoryColors.some(color => color.id === value);

export function categoryToneFor(category) {
  if (validCategoryColor(category.color)) return category.color;
  const iconId = categoryIconFor(category);
  return categoryIcons.find(icon => icon.id === iconId).tone;
}

export function categoryIconFor(category) {
  if (validCategoryIcon(category.icon)) return category.icon;
  const name = String(category.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const guesses = [['aliment|comida|mercado', 'food'], ['transport|taxi|bus', 'transport'], ['vivienda|hogar|alquiler', 'home'], ['ocio|cine|juego', 'fun'], ['salud|medic|farmacia', 'health'], ['mascota|veterin', 'pet'], ['cafe', 'coffee'], ['educa|estudio|curso', 'education'], ['regalo', 'gift'], ['compra|ropa', 'bag'], ['sueldo|salario|ingreso', 'salary'], ['trabajo|negocio|freelance', 'work'], ['invers|ahorro', 'growth'], ['viaje|vacacion', 'travel']];
  return guesses.find(([pattern]) => new RegExp(pattern).test(name))?.[1] || 'tag';
}
