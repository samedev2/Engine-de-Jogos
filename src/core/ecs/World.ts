export type Entity = number;

type ComponentStore<T> = Map<Entity, T>;

/**
 * ECS minimalista: entidades são só números; componentes são dados puros
 * guardados em mapas por tipo. Sistemas fazem query() e operam sobre o resultado.
 */
export class World {
  private nextId = 1;
  private entities = new Set<Entity>();
  private stores = new Map<string, ComponentStore<unknown>>();

  createEntity(): Entity {
    const id = this.nextId++;
    this.entities.add(id);
    return id;
  }

  destroyEntity(id: Entity): void {
    this.entities.delete(id);
    for (const store of this.stores.values()) store.delete(id);
  }

  private store<T>(type: string): ComponentStore<T> {
    let s = this.stores.get(type) as ComponentStore<T> | undefined;
    if (!s) {
      s = new Map();
      this.stores.set(type, s);
    }
    return s;
  }

  add<T>(entity: Entity, type: string, data: T): T {
    this.store<T>(type).set(entity, data);
    return data;
  }

  get<T>(entity: Entity, type: string): T | undefined {
    return this.store<T>(type).get(entity);
  }

  has(entity: Entity, type: string): boolean {
    return this.store(type).has(entity);
  }

  remove(entity: Entity, type: string): void {
    this.store(type).delete(entity);
  }

  /** Retorna entidades que possuem TODOS os tipos de componente passados. */
  query(...types: string[]): Entity[] {
    if (types.length === 0) return [...this.entities];
    const [first, ...rest] = types.map((t) => this.store(t));
    const result: Entity[] = [];
    for (const id of first.keys()) {
      if (rest.every((s) => s.has(id))) result.push(id);
    }
    return result;
  }
}
