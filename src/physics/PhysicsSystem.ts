import { World } from '../core/ecs/World';
import { Components, type Transform, type Velocity, type Gravity, type Collider, type Buoyant } from '../core/components';
import { TileMap, TileType } from './Terrain';

const GRAVITY_ACCEL = 900; // px/s^2

/** Gravidade, flutuação em água, atrito por material de terreno e colisão com paredes/chão. */
export class PhysicsSystem {
  constructor(private world: World, private terrain: TileMap) {}

  update(dt: number): void {
    const entities = this.world.query(Components.Transform, Components.Velocity, Components.Collider);
    for (const id of entities) {
      const t = this.world.get<Transform>(id, Components.Transform)!;
      const v = this.world.get<Velocity>(id, Components.Velocity)!;
      const c = this.world.get<Collider>(id, Components.Collider)!;
      const g = this.world.get<Gravity>(id, Components.Gravity);
      const b = this.world.get<Buoyant>(id, Components.Buoyant);

      const centerTileX = Math.floor((t.x + c.width / 2) / this.terrain.tileSize);
      const centerTileY = Math.floor((t.y + c.height / 2) / this.terrain.tileSize);
      const inWater = this.terrain.get(centerTileX, centerTileY) === TileType.Water;
      c.inLiquid = inWater;

      if (g) {
        const accel = inWater && b ? GRAVITY_ACCEL - b.lift : GRAVITY_ACCEL;
        v.y += accel * g.value * dt;
        if (inWater) v.y *= 0.94; // arrasto da água
      }

      if (c.onGround) {
        const groundTileY = Math.floor((t.y + c.height + 1) / this.terrain.tileSize);
        const groundTileX = Math.floor((t.x + c.width / 2) / this.terrain.tileSize);
        const groundTile = this.terrain.get(groundTileX, groundTileY);
        const friction = groundTile === TileType.Ice ? 0.98 : groundTile === TileType.Mud ? 0.75 : 0.85;
        v.x *= friction;
      }

      this.moveAndCollide(t, v, c, dt);
    }
  }

  private moveAndCollide(t: Transform, v: Velocity, c: Collider, dt: number): void {
    const ts = this.terrain.tileSize;

    // eixo X
    t.x += v.x * dt;
    if (v.x !== 0) {
      const dir = v.x > 0 ? 1 : -1;
      const edgeX = dir > 0 ? t.x + c.width : t.x;
      const tileX = Math.floor(edgeX / ts);
      const topTileY = Math.floor(t.y / ts);
      const bottomTileY = Math.floor((t.y + c.height - 1) / ts);
      for (let ty = topTileY; ty <= bottomTileY; ty++) {
        if (this.terrain.isSolid(tileX, ty)) {
          t.x = dir > 0 ? tileX * ts - c.width : (tileX + 1) * ts;
          v.x = 0;
          break;
        }
      }
    }

    // eixo Y
    t.y += v.y * dt;
    c.onGround = false;
    if (v.y !== 0) {
      const dir = v.y > 0 ? 1 : -1;
      const edgeY = dir > 0 ? t.y + c.height : t.y;
      const tileY = Math.floor(edgeY / ts);
      const leftTileX = Math.floor(t.x / ts);
      const rightTileX = Math.floor((t.x + c.width - 1) / ts);
      for (let tx = leftTileX; tx <= rightTileX; tx++) {
        if (this.terrain.isSolid(tx, tileY)) {
          t.y = dir > 0 ? tileY * ts - c.height : (tileY + 1) * ts;
          v.y = 0;
          if (dir > 0) c.onGround = true;
          break;
        }
      }
    }
  }
}
