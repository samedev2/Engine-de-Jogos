import { World } from './core/ecs/World';
import { Components, type Transform } from './core/components';
import { InputManager } from './core/input/InputManager';
import { GameLoop } from './core/loop/GameLoop';
import { Renderer } from './core/render/Renderer';
import { PhysicsSystem } from './physics/PhysicsSystem';
import { PlayerControlSystem } from './modules/arcade/PlayerControlSystem';
import { SecretsSystem } from './secrets/SecretsSystem';
import { EventSystem } from './events/EventSystem';
import { everyInterval } from './events/conditions';
import { callback } from './events/actions';
import { buildDemoLevel, spawnPlayer, spawnChest, openSecretPassage, TILE_SIZE, LEVEL_ROWS } from './demo/level';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const world = new World();
const input = new InputManager();
const terrain = buildDemoLevel();

const playerId = spawnPlayer(world, 32, 32);
spawnChest(world, 34 * TILE_SIZE, (LEVEL_ROWS - 4) * TILE_SIZE, 'chave-secreta-1');

const physics = new PhysicsSystem(world, terrain);
const playerControl = new PlayerControlSystem(world, input);
const secrets = new SecretsSystem(world, input, {
  onChestOpened: (_entity, itemKeyId) => {
    openSecretPassage(terrain);
    showMessage(`Você encontrou: ${itemKeyId}! A parede secreta desapareceu.`);
  },
});

const renderer = new Renderer(canvas, world, terrain);

// Exemplo de lógica declarativa "condição -> ação" (sem código específico do jogo):
// a cada 8s, se o jogador ainda não achou o baú, mostra uma dica.
const events = new EventSystem(world);
events.addRule({
  id: 'dica-bau',
  when: everyInterval(8),
  then: callback(() => {
    if (!secrets.hasItem('chave-secreta-1')) {
      showMessage('Dica: procure um baú escondido na área de gelo!');
    }
  }),
});

const loop = new GameLoop(
  (dt) => {
    playerControl.update(dt);
    physics.update(dt);
    secrets.update();
    events.update(dt);
  },
  () => {
    const t = world.get<Transform>(playerId, Components.Transform)!;
    renderer.followEntity(t);
    renderer.render();
  }
);

loop.start();

function showMessage(text: string): void {
  const el = document.getElementById('message')!;
  el.textContent = text;
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.opacity = '0';
  }, 3000);
}
