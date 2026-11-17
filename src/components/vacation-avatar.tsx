'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { AvatarContext } from './selected-avatar';
import { avatars } from '@/lib/avatars.mjs';
import koala from '../../public/images/koala-vacation-3d.png';
import fox from '../../public/images/fox-vacation-3d.png';
import cat from '../../public/images/cat-vacation-3d.png';
import tiger from '../../public/images/tiger-vacation-3d.png';
import rabbit from '../../public/images/rabbit-vacation-3d.png';
import bear from '../../public/images/bear-vacation-3d.png';

const illustrations = { koala, fox, cat, tiger, rabbit, bear };

/** Uses the confirmed profile selection, leaving menu previews and form drafts independent. */
export default function VacationAvatar({ className, sizes = '(max-width: 760px) 88px, 205px' }: { className?: string; sizes?: string }) {
  const avatar = useContext(AvatarContext);
  const selected = avatars.find(item => item.id === avatar) || avatars[0];
  return <Image key={selected.id} src={illustrations[selected.id as keyof typeof illustrations]} alt={`${selected.short} de vacaciones en una tumbona bajo una sombrilla`} className={className} sizes={sizes} />;
}
