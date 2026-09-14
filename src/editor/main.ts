const canvas = document.getElementById('editor') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;

let gridSize = 16;
let cellPx = canvas.width / gridSize;
let pixels: string[] = new Array(gridSize * gridSize).fill('transparent');

const defaultPalette = [
  '#000000', '#ffffff', '#e63946', '#f1c27d',
  '#1d3557', '#3a7ca5', '#8d5524', '#c68a3e',
  '#ffd700', '#2a9d8f', 'transparent',
];
const palette = [...defaultPalette];
let selectedColor = palette[2];

const paletteEl = document.getElementById('palette')!;

function renderPalette(): void {
  paletteEl.innerHTML = '';
  for (const color of palette) {
    const sw = document.createElement('div');
    sw.className = 'swatch' + (color === selectedColor ? ' selected' : '');
    sw.style.background =
      color === 'transparent'
        ? 'repeating-conic-gradient(#888 0% 25%, #ccc 0% 50%) 50% / 8px 8px'
        : color;
    sw.title = color;
    sw.onclick = () => {
      selectedColor = color;
      renderPalette();
    };
    paletteEl.appendChild(sw);
  }
}
renderPalette();

function idx(x: number, y: number): number {
  return y * gridSize + x;
}

function drawGrid(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const color = pixels[idx(x, y)];
      if (color !== 'transparent') {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellPx, y * cellPx, cellPx, cellPx);
      }
    }
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellPx, 0);
    ctx.lineTo(i * cellPx, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellPx);
    ctx.lineTo(canvas.width, i * cellPx);
    ctx.stroke();
  }
}
drawGrid();

let painting = false;
let erasing = false;

function paintAt(clientX: number, clientY: number): void {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((clientX - rect.left) / (rect.width / gridSize));
  const y = Math.floor((clientY - rect.top) / (rect.height / gridSize));
  if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return;
  pixels[idx(x, y)] = erasing ? 'transparent' : selectedColor;
  drawGrid();
}

canvas.addEventListener('mousedown', (e) => {
  painting = true;
  erasing = e.button === 2;
  paintAt(e.clientX, e.clientY);
});
window.addEventListener('mouseup', () => {
  painting = false;
});
canvas.addEventListener('mousemove', (e) => {
  if (painting) paintAt(e.clientX, e.clientY);
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

document.getElementById('addColor')!.addEventListener('click', () => {
  const input = document.getElementById('customColor') as HTMLInputElement;
  if (!palette.includes(input.value)) palette.splice(palette.length - 1, 0, input.value);
  selectedColor = input.value;
  renderPalette();
});

document.getElementById('clear')!.addEventListener('click', () => {
  pixels = new Array(gridSize * gridSize).fill('transparent');
  drawGrid();
});

document.getElementById('resize')!.addEventListener('click', () => {
  const input = document.getElementById('gridSize') as HTMLInputElement;
  gridSize = Math.max(4, Math.min(64, Number(input.value) || 16));
  cellPx = canvas.width / gridSize;
  pixels = new Array(gridSize * gridSize).fill('transparent');
  drawGrid();
});

document.getElementById('exportBtn')!.addEventListener('click', () => {
  const out = document.createElement('canvas');
  out.width = gridSize;
  out.height = gridSize;
  const octx = out.getContext('2d')!;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const color = pixels[idx(x, y)];
      if (color !== 'transparent') {
        octx.fillStyle = color;
        octx.fillRect(x, y, 1, 1);
      }
    }
  }
  const link = document.createElement('a');
  link.download = 'sprite.png';
  link.href = out.toDataURL('image/png');
  link.click();
});

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
document.getElementById('importBtn')!.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  gridSize = img.width;
  cellPx = canvas.width / gridSize;

  const sample = document.createElement('canvas');
  sample.width = img.width;
  sample.height = img.height;
  const sctx = sample.getContext('2d')!;
  sctx.drawImage(img, 0, 0);
  const data = sctx.getImageData(0, 0, img.width, img.height).data;

  pixels = new Array(gridSize * gridSize).fill('transparent');
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4;
      const a = data[i + 3];
      pixels[idx(x, y)] = a === 0 ? 'transparent' : `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
    }
  }
  drawGrid();
});
