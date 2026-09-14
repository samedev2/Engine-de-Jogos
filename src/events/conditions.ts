import { Components, type Transform } from '../core/components';
import type { EventContext } from './types';
import type { InputManager } from '../core/input/InputManager';

/** Equivalente a "Keyboard: Key is down" do Construct. */
export function onKeyPressed(input: InputManager, code: string) {
  return (_ctx: EventContext) => input.isDown(code);
}

/** Equivalente a "System: Every X seconds". */
export function everyInterval(seconds: number) {
  let elapsed = 0;
  return (ctx: EventContext) => {
    elapsed += ctx.dt;
    if (elapsed >= seconds) {
      elapsed = 0;
      return true;
    }
    return false;
  };
}

/** Equivalente a "On collision with" — verdadeiro se algum par dos dois grupos se sobrepõe. */
export function onOverlap(componentA: string, componentB: string, radius = 16) {
  return (ctx: EventContext) => {
    const as = ctx.world.query(componentA, Components.Transform);
    const bs = ctx.world.query(componentB, Components.Transform);
    for (const a of as) {
      const at = ctx.world.get<Transform>(a, Components.Transform)!;
      for (const b of bs) {
        if (a === b) continue;
        const bt = ctx.world.get<Transform>(b, Components.Transform)!;
        if (Math.hypot(at.x - bt.x, at.y - bt.y) < radius) return true;
      }
    }
    return false;
  };
}

/** Equivalente a comparar uma expressão tipo "Square.X < Map.map_edge_x". */
export function compare<T>(getValue: () => T, op: '<' | '<=' | '>' | '>=' | '==' | '!=', target: T) {
  return (_ctx: EventContext) => {
    const v = getValue();
    switch (op) {
      case '<': return v < target;
      case '<=': return v <= target;
      case '>': return v > target;
      case '>=': return v >= target;
      case '==': return v === target;
      case '!=': return v !== target;
    }
  };
}
