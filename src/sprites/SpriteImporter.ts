import { type SpriteFrame, type SpriteSheetRef, sheetFromGrid } from './SpriteSheet';

interface AtlasJSON {
  frames: Record<string, { frame: { x: number; y: number; w: number; h: number } }>;
}

export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Importa um spritesheet a partir de uma URL/arquivo de imagem.
 * - Se `atlasUrl` for passado, lê um atlas JSON estilo TexturePacker (frames nomeados).
 * - Se `gridFrameSize` for passado, fatia a imagem em grade de tamanho fixo.
 * - Sem nenhum dos dois, trata a imagem inteira como um único frame.
 */
export async function importSpriteSheet(
  imageUrl: string,
  gridFrameSize?: { w: number; h: number },
  atlasUrl?: string
): Promise<SpriteSheetRef> {
  const image = await loadImage(imageUrl);

  if (atlasUrl) {
    const atlas: AtlasJSON = await fetch(atlasUrl).then((r) => r.json());
    const frames: SpriteFrame[] = Object.values(atlas.frames).map((f) => ({
      x: f.frame.x,
      y: f.frame.y,
      w: f.frame.w,
      h: f.frame.h,
    }));
    return { image, frames };
  }

  if (gridFrameSize) {
    return sheetFromGrid(image, gridFrameSize.w, gridFrameSize.h);
  }

  return { image, frames: [{ x: 0, y: 0, w: image.width, h: image.height }] };
}

/** Importa a partir de um File (ex.: input type="file" ou drag-and-drop). */
export async function importFromFile(
  file: File,
  gridFrameSize?: { w: number; h: number }
): Promise<SpriteSheetRef> {
  const url = URL.createObjectURL(file);
  return importSpriteSheet(url, gridFrameSize);
}
