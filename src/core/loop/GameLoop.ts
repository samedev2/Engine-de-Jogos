/** Loop de jogo com passo fixo de simulação (evita física dependente de framerate). */
export class GameLoop {
  private accumulator = 0;
  private lastTime = 0;
  private running = false;
  private readonly step: number;

  constructor(
    private update: (dt: number) => void,
    private render: () => void,
    fixedStepHz = 60
  ) {
    this.step = 1 / fixedStepHz;
  }

  start(): void {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    const delta = Math.min((now - this.lastTime) / 1000, 0.25);
    this.lastTime = now;
    this.accumulator += delta;

    while (this.accumulator >= this.step) {
      this.update(this.step);
      this.accumulator -= this.step;
    }

    this.render();
    requestAnimationFrame(this.tick);
  };
}
