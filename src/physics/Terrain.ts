export const TileType = {
  Empty: 0,
  Solid: 1,
  Water: 2,
  Ice: 3,
  Mud: 4,
} as const;

export type TileTypeValue = (typeof TileType)[keyof typeof TileType];

/** Grade de tiles do nível. Fora dos limites conta como Solid (paredes do mundo). */
export class TileMap {
  private tiles: TileTypeValue[];

  constructor(
    public readonly tileSize: number,
    public readonly cols: number,
    public readonly rows: number
  ) {
    this.tiles = new Array(cols * rows).fill(TileType.Empty);
  }

  get(cx: number, cy: number): TileTypeValue {
    if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return TileType.Solid;
    return this.tiles[cy * this.cols + cx];
  }

  set(cx: number, cy: number, type: TileTypeValue): void {
    if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return;
    this.tiles[cy * this.cols + cx] = type;
  }

  /** Solid, Ice e Mud bloqueiam movimento (são "chão"); Water é atravessável (ativa flutuação). */
  isSolid(cx: number, cy: number): boolean {
    const t = this.get(cx, cy);
    return t === TileType.Solid || t === TileType.Ice || t === TileType.Mud;
  }
}
