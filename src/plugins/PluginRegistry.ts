/**
 * API de plugins: ponto de extensão para 3D (ex.: wrapper do Three.js), IA
 * (ex.: pathfinding, comportamento de NPC, chamadas a um provider de LLM) ou
 * qualquer outro recurso que precise se acoplar ao loop de update/render.
 */
export interface EnginePlugin {
  id: string;
  version: string;
  install(context: PluginContext): void;
  uninstall?(context: PluginContext): void;
}

export interface PluginContext {
  registerUpdateHook?(hook: (dt: number) => void): void;
  registerRenderHook?(hook: () => void): void;
  [key: string]: unknown;
}

export class PluginRegistry {
  private plugins = new Map<string, EnginePlugin>();

  constructor(private context: PluginContext) {}

  install(plugin: EnginePlugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin já instalado: ${plugin.id}`);
    }
    plugin.install(this.context);
    this.plugins.set(plugin.id, plugin);
  }

  uninstall(id: string): void {
    const plugin = this.plugins.get(id);
    if (!plugin) return;
    plugin.uninstall?.(this.context);
    this.plugins.delete(id);
  }

  list(): EnginePlugin[] {
    return [...this.plugins.values()];
  }
}
