export interface IsoConfig {
  tileWidth: number;
  tileHeight: number;
}

/** Converte coordenada de grade (col, row) em posição de tela isométrica. */
export function gridToScreen(col: number, row: number, cfg: IsoConfig): { x: number; y: number } {
  return {
    x: (col - row) * (cfg.tileWidth / 2),
    y: (col + row) * (cfg.tileHeight / 2),
  };
}

/** Inverso de gridToScreen — útil para detectar em qual tile o jogador clicou. */
export function screenToGrid(x: number, y: number, cfg: IsoConfig): { col: number; row: number } {
  const halfW = cfg.tileWidth / 2;
  const halfH = cfg.tileHeight / 2;
  return {
    col: (x / halfW + y / halfH) / 2,
    row: (y / halfH - x / halfW) / 2,
  };
}

/** Ordem de profundidade para desenhar sem erro de oclusão (menor primeiro). */
export function depthOrder(col: number, row: number): number {
  return col + row;
}
