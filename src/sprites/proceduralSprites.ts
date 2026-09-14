import { sheetFromGrid, type SpriteSheetRef } from './SpriteSheet';

/** Sprites gerados por código, só para a demo rodar sem depender de assets externos. */
export function makePlaceholderCharacterSheet(): SpriteSheetRef {
  const frameW = 16;
  const frameH = 24;
  const frames = 2;
  const canvas = document.createElement('canvas');
  canvas.width = frameW * frames;
  canvas.height = frameH;
  const ctx = canvas.getContext('2d')!;

  for (let i = 0; i < frames; i++) {
    const ox = i * frameW;
    ctx.fillStyle = '#e63946';
    ctx.fillRect(ox + 3, 0, 10, 12);
    ctx.fillStyle = '#f1c27d';
    ctx.fillRect(ox + 4, 0, 8, 6);
    ctx.fillStyle = '#1d3557';
    const legOffset = i % 2 === 0 ? 0 : 3;
    ctx.fillRect(ox + 3 + legOffset, 12, 4, 10);
    ctx.fillRect(ox + 9 - legOffset, 12, 4, 10);
  }

  return sheetFromGrid(canvas, frameW, frameH);
}

export function makePlaceholderChestSheet(): SpriteSheetRef {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#8d5524';
  ctx.fillRect(1, 6, 14, 9);
  ctx.fillStyle = '#c68a3e';
  ctx.fillRect(1, 6, 14, 3);
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(7, 9, 2, 3);
  return sheetFromGrid(canvas, 16, 16);
}
