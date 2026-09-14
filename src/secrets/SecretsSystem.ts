import { World } from '../core/ecs/World';
import { Components, type Transform, type Collider, type Chest } from '../core/components';
import { InputManager } from '../core/input/InputManager';

export interface SecretsEvents {
  onChestOpened?(entity: number, itemKeyId: string): void;
}

/**
 * Sistema de "surpresas ocultas": baús que, ao serem abertos (tecla de interação
 * perto do baú), liberam um item e disparam um evento — o jogo decide o que isso
 * desbloqueia (passagem secreta, porta, item de inventário, etc.).
 */
export class SecretsSystem {
  private inventory = new Set<string>();

  constructor(private world: World, private input: InputManager, private events: SecretsEvents = {}) {}

  update(): void {
    if (!this.input.isDown('KeyE')) return;

    const [player] = this.world.query(Components.PlayerControlled, Components.Transform, Components.Collider);
    if (player === undefined) return;
    const pt = this.world.get<Transform>(player, Components.Transform)!;
    const pc = this.world.get<Collider>(player, Components.Collider)!;

    for (const chestId of this.world.query(Components.Chest, Components.Transform)) {
      const chest = this.world.get<Chest>(chestId, Components.Chest)!;
      if (chest.opened) continue;
      const ct = this.world.get<Transform>(chestId, Components.Transform)!;
      if (this.isNear(pt, pc, ct)) {
        chest.opened = true;
        this.inventory.add(chest.itemKeyId);
        this.events.onChestOpened?.(chestId, chest.itemKeyId);
      }
    }
  }

  hasItem(id: string): boolean {
    return this.inventory.has(id);
  }

  private isNear(pt: Transform, pc: Collider, ot: Transform, radius = 20): boolean {
    const dx = pt.x + pc.width / 2 - ot.x;
    const dy = pt.y + pc.height / 2 - ot.y;
    return Math.hypot(dx, dy) < radius;
  }
}
