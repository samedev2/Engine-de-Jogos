import { TileMap, TileType } from '../physics/Terrain';
import { World } from '../core/ecs/World';
import { Components } from '../core/components';
import { makePlaceholderCharacterSheet, makePlaceholderChestSheet } from '../sprites/proceduralSprites';

export const TILE_SIZE = 16;
export const LEVEL_ROWS = 20;
const LEVEL_COLS = 60;

const SECRET_WALL_COL = 42;
const END_WALL_COL = 50;

/**
 * Nível de demonstração: plataforma no ar, poça d'água (testa flutuação),
 * trecho de gelo (testa atrito baixo), parede secreta (liberada pelo baú)
 * e parede final marcando o limite da demo.
 */
export function buildDemoLevel(): TileMap {
  const terrain = new TileMap(TILE_SIZE, LEVEL_COLS, LEVEL_ROWS);

  for (let x = 0; x < LEVEL_COLS; x++) {
    terrain.set(x, LEVEL_ROWS - 1, TileType.Solid);
    terrain.set(x, LEVEL_ROWS - 2, TileType.Solid);
  }

  for (let x = 10; x < 16; x++) terrain.set(x, LEVEL_ROWS - 6, TileType.Solid);

  for (let x = 20; x < 26; x++) {
    terrain.set(x, LEVEL_ROWS - 1, TileType.Water);
    terrain.set(x, LEVEL_ROWS - 2, TileType.Water);
  }

  for (let x = 30; x < 38; x++) terrain.set(x, LEVEL_ROWS - 3, TileType.Ice);

  for (let y = LEVEL_ROWS - 5; y < LEVEL_ROWS - 2; y++) {
    terrain.set(SECRET_WALL_COL, y, TileType.Solid);
  }

  for (let y = LEVEL_ROWS - 8; y < LEVEL_ROWS - 2; y++) {
    terrain.set(END_WALL_COL, y, TileType.Solid);
  }

  return terrain;
}

export function openSecretPassage(terrain: TileMap): void {
  for (let y = LEVEL_ROWS - 5; y < LEVEL_ROWS - 2; y++) {
    terrain.set(SECRET_WALL_COL, y, TileType.Empty);
  }
}

export function spawnPlayer(world: World, x: number, y: number) {
  const id = world.createEntity();
  world.add(id, Components.Transform, { x, y });
  world.add(id, Components.Velocity, { x: 0, y: 0 });
  world.add(id, Components.Gravity, { value: 1 });
  world.add(id, Components.Collider, { width: 12, height: 22 });
  world.add(id, Components.PlayerControlled, { speed: 110, jumpForce: 260 });
  world.add(id, Components.Buoyant, { lift: 550 });
  world.add(id, Components.Sprite, { sheet: makePlaceholderCharacterSheet(), frame: 0 });
  return id;
}

export function spawnChest(world: World, x: number, y: number, itemKeyId: string) {
  const id = world.createEntity();
  world.add(id, Components.Transform, { x, y });
  world.add(id, Components.Chest, { itemKeyId, opened: false });
  world.add(id, Components.Sprite, { sheet: makePlaceholderChestSheet(), frame: 0 });
  return id;
}
