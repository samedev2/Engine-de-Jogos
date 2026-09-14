import type { SpriteSheetRef } from '../sprites/SpriteSheet';

/** Chaves dos tipos de componente — usadas como identificador nas queries do World. */
export const Components = {
  Transform: 'transform',
  Velocity: 'velocity',
  Gravity: 'gravity',
  Collider: 'collider',
  Sprite: 'sprite',
  PlayerControlled: 'playerControlled',
  Buoyant: 'buoyant',
  Chest: 'chest',
} as const;

export interface Transform {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

/** Multiplicador de gravidade; 1 = padrão do mundo, 0 = flutua livre, negativo = anti-gravidade. */
export interface Gravity {
  value: number;
}

export interface Collider {
  width: number;
  height: number;
  onGround?: boolean;
  inLiquid?: boolean;
}

export interface Sprite {
  sheet: SpriteSheetRef;
  frame: number;
  flipX?: boolean;
}

export interface PlayerControlled {
  speed: number;
  jumpForce: number;
}

/** Força de empuxo aplicada quando o collider está em água (ver Terrain/TileType.Water). */
export interface Buoyant {
  lift: number;
}

export interface Chest {
  itemKeyId: string;
  opened: boolean;
}
