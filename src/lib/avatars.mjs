export const avatars = [
  { id: 'koala', name: 'Koala tranquilo', short: 'Koala', color: '#dceda8' },
  { id: 'fox', name: 'Zorro curioso', short: 'Zorro', color: '#f6d9b6' },
  { id: 'cat', name: 'Gato soñador', short: 'Gato', color: '#dedcf4' },
  { id: 'tiger', name: 'Tigre blanco de Bengala', short: 'Tigre blanco', color: '#383b40' },
  { id: 'rabbit', name: 'Conejo alegre', short: 'Conejo', color: '#f3d9de' },
  { id: 'bear', name: 'Oso aventurero', short: 'Oso', color: '#eadfc2' },
];

export const validAvatar = value => typeof value === 'string' && avatars.some(avatar => avatar.id === value);
