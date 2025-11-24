import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      mesh: any;
      group: any;
      sphereGeometry: any;
      boxGeometry: any;
      capsuleGeometry: any;
      cylinderGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      spotLight: any;
      directionalLight: any;
    }
  }
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export enum CharacterId {
  FIRE = 'FIRE',
  WATER = 'WATER',
  WIND = 'WIND',
  EARTH = 'EARTH',
  LIGHTNING = 'LIGHTNING',
}

export interface Character {
  id: CharacterId;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  bladeColor: string;
  trailColor: string;
}

export type FruitType = 'melon' | 'apple' | 'banana' | 'orange';

export interface FruitData {
  id: number;
  x: number; // Starting X
  vx: number; // Velocity X
  vy: number; // Velocity Y
  scale: number;
  rotationSpeed: number;
  type: FruitType;
  points: number;
}

export interface DebrisData {
  id: number;
  x: number;
  y: number;
  skinColor: string;
  fleshColor: string;
  velocity: [number, number, number];
}