import type { World } from '../core/ecs/World';
import type { Rule, EventContext } from './types';

/**
 * Motor de eventos "condição -> ação", inspirado no event sheet do Construct:
 * cada Rule descreve UMA condição e UMA (ou mais) ações, montadas a partir de
 * peças reutilizáveis (ver conditions.ts / actions.ts). É a camada de dados
 * que depois ganha uma UI visual de blocos arrastáveis, sem o usuário escrever
 * código — o objetivo é deixar a lógica de interação acessível pro leigo.
 */
export class EventSystem {
  private rules: Rule[] = [];

  constructor(private world: World) {}

  addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  removeRule(id: string): void {
    this.rules = this.rules.filter((r) => r.id !== id);
  }

  update(dt: number): void {
    const ctx: EventContext = { world: this.world, dt };
    for (const rule of this.rules) {
      if (rule.once && rule._fired) continue;
      if (rule.when(ctx)) {
        const actions = Array.isArray(rule.then) ? rule.then : [rule.then];
        for (const action of actions) action(ctx);
        rule._fired = true;
      }
    }
  }
}
