import { Character, CharacterId, FruitType } from './types';

export const CHARACTERS: Character[] = [
  {
    id: CharacterId.FIRE,
    name: 'Blaze (烈火)',
    description: 'Passionate and intense. Slices with explosive power.',
    color: 'from-red-500 to-orange-500',
    accentColor: '#ef4444',
    bladeColor: '#ff4d4d',
    trailColor: '#ffaa00',
  },
  {
    id: CharacterId.WATER,
    name: 'Tide (流水)',
    description: 'Calm and fluid. Moves like a gentle stream.',
    color: 'from-blue-500 to-cyan-400',
    accentColor: '#3b82f6',
    bladeColor: '#00bfff',
    trailColor: '#00ffff',
  },
  {
    id: CharacterId.WIND,
    name: 'Zephyr (疾风)',
    description: 'Fast and unseen. Swift as the autumn breeze.',
    color: 'from-emerald-400 to-teal-300',
    accentColor: '#10b981',
    bladeColor: '#98fb98',
    trailColor: '#e0ffff',
  },
  {
    id: CharacterId.EARTH,
    name: 'Terra (岩心)',
    description: 'Solid and precise. Unshakable resolve.',
    color: 'from-amber-600 to-yellow-500',
    accentColor: '#d97706',
    bladeColor: '#daa520',
    trailColor: '#f4a460',
  },
  {
    id: CharacterId.LIGHTNING,
    name: 'Volt (雷霆)',
    description: 'Sudden and bright. Strikes in a flash.',
    color: 'from-purple-600 to-fuchsia-500',
    accentColor: '#9333ea',
    bladeColor: '#e6e6fa',
    trailColor: '#ff00ff',
  },
];

export const FRUIT_CONFIG: Record<FruitType, { points: number, color: string, fleshColor: string, radius: number, roughness: number }> = {
  melon: { points: 1, color: '#2d5a27', fleshColor: '#ff4d4d', radius: 1, roughness: 0.4 },
  apple: { points: 3, color: '#dc2626', fleshColor: '#fef3c7', radius: 0.65, roughness: 0.2 },
  orange: { points: 2, color: '#ea580c', fleshColor: '#fdba74', radius: 0.7, roughness: 0.8 },
  banana: { points: 5, color: '#facc15', fleshColor: '#fefce8', radius: 0.8, roughness: 0.3 },
};

export const GRAVITY = 15;
export const SPAWN_RATE_MS = 1000; // Slightly faster spawn rate for more variety
export const GAME_DURATION = 60; // seconds