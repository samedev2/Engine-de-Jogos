import type { World } from '../core/ecs/World';

export interface EventContext {
  world: World;
  dt: number;
}

export type Condition = (ctx: EventContext) => boolean;
export type Action = (ctx: EventContext) => void;

export interface Rule {
  id: string;
  when: Condition;
  then: Action | Action[];
  /** Se true, a regra dispara só uma vez e depois fica inativa (tipo "On created"). */
  once?: boolean;
  _fired?: boolean;
}
