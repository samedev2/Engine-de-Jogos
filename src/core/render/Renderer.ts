import { TileMap, TileType } from '../../physics/Terrain';
import { World } from '../ecs/World';
import { Components, type Transform, type Sprite } from '../components';

const TILE_COLORS: Partial<Record<number, string>> = {
  [TileType.Solid]: '#5b4636',
  [TileType.Water]: '#3a7ca5',
  [TileType.Ice]: '#bfe9ff',
  [TileType.Mud]: '#6b4f2a',
};

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  camera = { x: 0, y: 0 };

  constructor(
    private canvas: HTMLCanvasElement,
    private world: World,
    private terrain: TileMap
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
  }

  followEntity(t: Transform): void {
    this.camera.x = t.x - this.canvas.width / 2;
    this.camera.y = t.y - this.canvas.height / 2;
  }

  render(): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawTerrain();
    this.drawSprites();
  }

  private drawTerrain(): void {
    const ctx = this.ctx;
    const ts = this.terrain.tileSize;
    const startCol = Math.floor(this.camera.x / ts);
    const endCol = startCol + Math.ceil(this.canvas.width / ts) + 1;
    const startRow = Math.floor(this.camera.y / ts);
    const endRow = startRow + Math.ceil(this.canvas.height / ts) + 1;

    for (let cy = startRow; cy <= endRow; cy++) {
      for (let cx = startCol; cx <= endCol; cx++) {
        const tile = this.terrain.get(cx, cy);
        if (tile === TileType.Empty) continue;
        ctx.fillStyle = TILE_COLORS[tile] ?? '#888';
        ctx.fillRect(cx * ts - this.camera.x, cy * ts - this.camera.y, ts, ts);
      }
    }
  }

  private drawSprites(): void {
    const ctx = this.ctx;
    const entities = this.world.query(Components.Transform, Components.Sprite);
    for (const id of entities) {
      const t = this.world.get<Transform>(id, Components.Transform)!;
      const s = this.world.get<Sprite>(id, Components.Sprite)!;
      const sheet = s.sheet;
      const frame = sheet.frames[s.frame % sheet.frames.length];
      const dx = t.x - this.camera.x;
      const dy = t.y - this.camera.y;

      if (s.flipX) {
        ctx.save();
        ctx.translate(dx + frame.w, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(sheet.image, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
        ctx.restore();
      } else {
        ctx.drawImage(sheet.image, frame.x, frame.y, frame.w, frame.h, dx, dy, frame.w, frame.h);
      }
    }
  }
}
