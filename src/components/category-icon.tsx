import { categoryIcons } from '@/lib/category-icons.mjs';
import type { ReactNode } from 'react';

const shapes: Record<string, ReactNode> = {
  food: <><path d="M5 3v6m3-6v6m-6-6v6c0 4 6 4 6 0M5 12v9M18 3c-4 3-5 8-1 9h2M19 3v18" /><circle cx="13" cy="14" r="6" fill="currentColor" opacity=".12" stroke="none" /></>,
  transport: <><path d="m4 9 2-5h12l2 5M3 9h18v9H3Zm2 9v3m14-3v3M7 13h1m8 0h1" /><path d="M4 10h16v5H4Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  home: <><path d="m2 11 10-8 10 8M5 9v12h14V9M10 21v-7h4v7" /><path d="m12 4 6 5v11H6V9Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  fun: <><path d="M7 7h10c5 0 7 14 3 14-2 0-4-5-6-5h-4c-2 0-4 5-6 5C0 21 2 7 7 7Zm1 3v5m-2-2h4m6-2h.01m2 3h.01" /><path d="M10 6V3h5" /><path d="M5 9h14v7H5Z" fill="currentColor" opacity=".12" stroke="none" /></>,
  health: <><rect x="3" y="6" width="18" height="15" rx="4" /><path d="M8 6V3h8v3m-4 4v7m-3-3h6" /><path d="M4 9h16v10H4Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  bag: <><path d="M5 7h14l2 14H3L5 7Zm3 2V6a4 4 0 0 1 8 0v3" /><path d="M6 10h12l1 9H5Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  education: <><path d="m2 8 10-5 10 5-10 5L2 8Zm4 3v6c4 4 8 4 12 0v-6m4-3v9" /><path d="m7 12 5 3 5-3v5H7Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  pet: <><path d="M6 21c-5-2 1-10 6-10s11 8 6 10c-2 1-4-1-6-1s-4 2-6 1Z" fill="currentColor" opacity=".14" /><path d="M6 21c-5-2 1-10 6-10s11 8 6 10c-2 1-4-1-6-1s-4 2-6 1Z" /><ellipse cx="4" cy="9" rx="2" ry="3" /><ellipse cx="9" cy="5" rx="2" ry="3" /><ellipse cx="15" cy="5" rx="2" ry="3" /><ellipse cx="20" cy="9" rx="2" ry="3" /></>,
  coffee: <><path d="M3 8h14v8c0 7-14 7-14 0V8Zm14 1h2c5 0 4 7-2 7M2 22h17M7 2v2m5-2v2" /><path d="M5 10h10v7H5Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  gift: <><path d="M3 8h18v5H3Zm2 5v8h14v-8M12 8v13M12 8C1 9 5-2 12 8Zm0 0C23 9 19-2 12 8Z" /><path d="M6 14h12v6H6Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  salary: <><rect x="2" y="6" width="20" height="14" rx="3" /><circle cx="12" cy="13" r="4" fill="currentColor" opacity=".15" /><path d="M12 10v6m-2-5h3m-3 4h3M5 10h.01M19 16h.01M6 3h12" /></>,
  work: <><rect x="2" y="7" width="20" height="14" rx="3" /><path d="M8 7V3h8v4M2 13c6 3 14 3 20 0m-10 0v4" /><path d="M4 9h16v5H4Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  growth: <><path d="M3 21V3m0 18h18M7 16l5-6 4 3 5-9m-6 0h6v6" /><path d="m7 19 5-6 4 3 5-6v9Z" fill="currentColor" opacity=".15" stroke="none" /></>,
  heart: <><path d="M12 21S1 14 2 7c1-5 7-5 10-1 3-4 9-4 10 1 1 7-10 14-10 14Z" fill="currentColor" opacity=".14" /><path d="M12 21S1 14 2 7c1-5 7-5 10-1 3-4 9-4 10 1 1 7-10 14-10 14Z" /></>,
  travel: <><path d="m2 11 8 2 3 8 8-19L2 11Zm8 2L21 2M3 17l3 1m1 3 1-3" /><path d="m10 13 3 6 6-15Z" fill="currentColor" opacity=".13" stroke="none" /></>,
  tag: <><path d="M3 3h9l9 9-9 9-9-9V3Z" fill="currentColor" opacity=".13" /><path d="M3 3h9l9 9-9 9-9-9V3Z" /><circle cx="8" cy="8" r="1.5" /></>,
};
export default function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const icon = categoryIcons.find(item => item.id === id) || categoryIcons[15];
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[icon.id]}</svg>;
}
