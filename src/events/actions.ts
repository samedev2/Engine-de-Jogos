import type { EventContext } from './types';
import type { World } from '../core/ecs/World';

/** Equivalente a "Set [propriedade]" — grava um valor num componente de uma entidade. */
export function setComponentValue<T>(
  world: World,
  entity: number,
  componentType: string,
  updater: (current: T) => void
) {
  return (_ctx: EventContext) => {
    const data = world.get<T>(entity, componentType);
    if (data) updater(data);
  };
}

export function log(text: string) {
  return (_ctx: EventContext) => console.log(text);
}

export function callback(fn: () => void) {
  return (_ctx: EventContext) => fn();
}
