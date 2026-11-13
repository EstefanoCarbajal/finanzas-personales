'use client';

import { createContext, useContext } from 'react';
import AnimalAvatar from './animal-avatar';

export const AvatarContext = createContext('koala');

/** Every decorative character follows the same confirmed selection as the palette. */
export default function SelectedAvatar({ width, height }: { width?: number; height?: number }) {
  const avatar = useContext(AvatarContext);
  return <AnimalAvatar id={avatar} width={width} height={height} />;
}
