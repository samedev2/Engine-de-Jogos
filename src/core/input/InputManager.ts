export class InputManager {
  private down = new Set<string>();

  constructor(target: Window = window) {
    target.addEventListener('keydown', (e) => this.down.add(e.code));
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }
}
