import { World } from '../../core/ecs/World';
import { Components, type Velocity, type Collider, type PlayerControlled } from '../../core/components';
import { InputManager } from '../../core/input/InputManager';

/** Controlador de movimento estilo arcade/plataforma: direção horizontal + pulo. */
export class PlayerControlSystem {
  constructor(private world: World, private input: InputManager) {}

  update(_dt: number): void {
    const entities = this.world.query(Components.PlayerControlled, Components.Velocity, Components.Collider);
    for (const id of entities) {
      const pc = this.world.get<PlayerControlled>(id, Components.PlayerControlled)!;
      const v = this.world.get<Velocity>(id, Components.Velocity)!;
      const c = this.world.get<Collider>(id, Components.Collider)!;

      let dirX = 0;
      if (this.input.isDown('ArrowLeft') || this.input.isDown('KeyA')) dirX -= 1;
      if (this.input.isDown('ArrowRight') || this.input.isDown('KeyD')) dirX += 1;
      v.x = dirX * pc.speed;

      const jumpPressed = this.input.isDown('Space') || this.input.isDown('ArrowUp') || this.input.isDown('KeyW');
      if (jumpPressed && (c.onGround || c.inLiquid)) {
        v.y = -pc.jumpForce * (c.inLiquid ? 0.6 : 1);
      }
    }
  }
}
