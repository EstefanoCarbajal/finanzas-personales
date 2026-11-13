import { avatars } from '@/lib/avatars.mjs';

/** Original vector family: soft silhouettes, forest outlines and warm pastel backdrops. */
export default function AnimalAvatar({ id, className, width, height }: { id: string; className?: string; width?: number; height?: number }) {
  const avatar = avatars.find(item => item.id === id) || avatars[0];
  const ink = avatar.id === 'tiger' ? '#17191c' : '#23483c';
  return <svg viewBox="0 0 100 100" className={className} width={width} height={height} data-avatar={avatar.id} aria-hidden="true" fill="none">
    <rect width="100" height="100" rx="32" fill={avatar.color} />
    <circle cx="77" cy="21" r="14" fill="#fff" opacity=".25" />
    <path d="m17 23 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#fff" opacity=".7" />
    <g data-avatar-face="" stroke={ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      {avatar.id === 'koala' && <>
        <circle cx="25" cy="43" r="15" fill="#9ebaae" /><circle cx="75" cy="43" r="15" fill="#9ebaae" />
        <circle cx="25" cy="43" r="8" fill="#d5e2d6" stroke="none" /><circle cx="75" cy="43" r="8" fill="#d5e2d6" stroke="none" />
        <path d="M24 54c0-20 12-28 26-28s26 8 26 28v7c0 16-12 24-26 24S24 77 24 61Z" fill="#f4f7e9" />
        <ellipse cx="50" cy="58" rx="8" ry="12" fill={ink} />
      </>}
      {avatar.id === 'fox' && <>
        <path d="m23 48-4-28 24 13h14l24-13-4 28c13 25-11 37-27 37S10 73 23 48Z" fill="#df995c" />
        <path d="m25 29 3 17 11-9M75 29l-3 17-11-9" fill="#f6e7c9" stroke="none" />
        <path d="M24 54c13-3 20 3 26 14 6-11 13-17 26-14-1 18-12 28-26 28S25 72 24 54Z" fill="#fff6e5" stroke="none" />
        <path d="m45 64 5 5 5-5Z" fill={ink} />
      </>}
      {avatar.id === 'cat' && <>
        <path d="m24 47 1-26 20 14h10l20-14 1 26c16 24-3 38-26 38S8 71 24 47Z" fill="#b9b6df" />
        <path d="m31 32 1 12 10-5M69 32l-1 12-10-5" fill="#f0d9de" stroke="none" />
        <ellipse cx="50" cy="69" rx="17" ry="11" fill="#edeafb" stroke="none" />
        <path d="m46 62 4 4 4-4Z" fill={ink} /><path d="m24 62-10-2m11 9-9 3m60-10 10-2m-11 9 9 3" />
      </>}
      {avatar.id === 'tiger' && <>
        <circle cx="27" cy="34" r="12" fill="#e8ebee" /><circle cx="73" cy="34" r="12" fill="#e8ebee" />
        <circle cx="27" cy="34" r="6" fill="#d9dce1" /><circle cx="73" cy="34" r="6" fill="#d9dce1" />
        <path d="M20 53c0-18 13-26 30-26s30 8 30 26v8c0 16-14 25-30 25S20 77 20 61Z" fill="#f7f8fa" />
        <path d="M26 62c6-5 17-4 24 2 7-6 18-7 24-2-1 14-12 21-24 21S27 76 26 62Z" fill="#ffffff" stroke="none" />
        <g fill={ink} stroke="none">
          <path d="m45 28 5 17 5-17ZM32 32l9 12-3-14ZM68 32l-9 12 3-14Z" />
          <path d="m21 45 12 5-12 2ZM20 56l12 2-11 5ZM79 45l-12 5 12 2ZM80 56l-12 2 11 5Z" />
        </g>
        <path d="m45 63 5 5 5-5Z" fill={ink} /><path d="M50 68v5m-19-5-9-1m9 6-8 2m46-7 9-1m-9 6 8 2" strokeWidth="1.8" />
      </>}
      {avatar.id === 'rabbit' && <>
        <path d="M30 43C13-4 42 5 43 39M57 39C58 5 87-4 70 43" fill="#fff5e9" />
        <path d="m32 19 5 20m31-20-5 20" stroke="#dfabb6" strokeWidth="6" />
        <ellipse cx="50" cy="60" rx="29" ry="25" fill="#fff5e9" />
        <path d="m46 62 4 4 4-4Z" fill="#c67d90" stroke="#c67d90" />
        <path d="M47 73v6h6v-6" fill="#fff" strokeWidth="1.8" />
      </>}
      {avatar.id === 'bear' && <>
        <circle cx="28" cy="35" r="12" fill="#bda17b" /><circle cx="72" cy="35" r="12" fill="#bda17b" />
        <circle cx="28" cy="35" r="5" fill="#ebd5b4" stroke="none" /><circle cx="72" cy="35" r="5" fill="#ebd5b4" stroke="none" />
        <ellipse cx="50" cy="58" rx="29" ry="27" fill="#c6aa80" />
        <ellipse cx="50" cy="68" rx="15" ry="12" fill="#f5e9ce" stroke="none" />
        <ellipse cx="50" cy="63" rx="6" ry="4" fill={ink} />
      </>}
      <g data-avatar-eyes="" stroke={ink}>
        <path d="M37 53v3m26-3v3" strokeWidth="3.8" />
      </g>
      <path d="M44 72q6 6 12 0" />
      <g fill="#e9a79a" opacity=".65" stroke="none"><ellipse cx="30" cy="65" rx="5" ry="3" /><ellipse cx="70" cy="65" rx="5" ry="3" /></g>
    </g>
  </svg>;
}
