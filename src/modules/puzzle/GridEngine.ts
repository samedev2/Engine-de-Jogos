export type Cell<T> = T | null;

/**
 * Grade genérica para puzzles: match-3, blocos, cartas ou tabuleiro — todos são
 * "uma grade de células com valor" com troca e detecção de sequências.
 */
export class GridEngine<T> {
  private cells: Cell<T>[];

  constructor(
    public readonly cols: number,
    public readonly rows: number,
    fill: () => Cell<T>
  ) {
    this.cells = Array.from({ length: cols * rows }, fill);
  }

  private idx(x: number, y: number): number {
    return y * this.cols + x;
  }

  get(x: number, y: number): Cell<T> {
    if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) return null;
    return this.cells[this.idx(x, y)];
  }

  set(x: number, y: number, value: Cell<T>): void {
    if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) return;
    this.cells[this.idx(x, y)] = value;
  }

  swap(x1: number, y1: number, x2: number, y2: number): void {
    const a = this.get(x1, y1);
    const b = this.get(x2, y2);
    this.set(x1, y1, b);
    this.set(x2, y2, a);
  }

  /** Encontra sequências horizontais/verticais de `minRun` ou mais células iguais. */
  findMatches(equals: (a: T, b: T) => boolean, minRun = 3): Array<[number, number]> {
    const matched = new Set<string>();

    const scan = (dx: number, dy: number) => {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const start = this.get(x, y);
          if (start === null) continue;
          let run = 1;
          while (true) {
            const cell = this.get(x + dx * run, y + dy * run);
            if (cell !== null && equals(cell, start)) run++;
            else break;
          }
          if (run >= minRun) {
            for (let i = 0; i < run; i++) matched.add(`${x + dx * i},${y + dy * i}`);
          }
        }
      }
    };

    scan(1, 0);
    scan(0, 1);

    return [...matched].map((key) => {
      const [x, y] = key.split(',').map(Number);
      return [x, y] as [number, number];
    });
  }

  clear(cells: Array<[number, number]>): void {
    for (const [x, y] of cells) this.set(x, y, null);
  }
}
