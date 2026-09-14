export interface SpriteFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpriteSheetRef {
  image: HTMLImageElement | HTMLCanvasElement;
  frames: SpriteFrame[];
}

/** Fatia uma imagem em frames de tamanho fixo, varrendo da esquerda pra direita, cima pra baixo. */
export function sheetFromGrid(
  image: HTMLImageElement | HTMLCanvasElement,
  frameW: number,
  frameH: number
): SpriteSheetRef {
  const cols = Math.floor(image.width / frameW);
  const rows = Math.floor(image.height / frameH);
  const frames: SpriteFrame[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      frames.push({ x: c * frameW, y: r * frameH, w: frameW, h: frameH });
    }
  }
  return { image, frames };
}
