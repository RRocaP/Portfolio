// Dynamic component & feature plugin registry
// Lightweight micro-frontend style plugin system

export interface PluginContext {
  lang: 'en' | 'es' | 'ca';
  registerComponent: (slot: PluginSlot, component: LazyComponentAny) => void;
  provideData: <K extends string, T>(key: K, value: T) => void;
  getData: <T = unknown>(key: string) => T | undefined;
}

// Slots define extension points in layout/pages
export type PluginSlot =
  | 'research.overview.card'
  | 'research.publication.inline'
  | 'navigation.after'
  | 'footer.before'
  | `custom.${string}`;

export interface PluginMeta {
  id: string;
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  order?: number; // ordering inside a slot
  enable?: (env: { build: boolean; mode: 'dev' | 'prod' }) => boolean;
}

export interface PluginModule {
  meta: PluginMeta;
  setup?: (ctx: PluginContext) => void | Promise<void>;
  components?: Array<{ slot: PluginSlot; component: LazyComponentAny; order?: number }>;
}

// Lazy component loader contract
export type LazyComponentAny = () => Promise<any>;

interface InternalRegistryState {
  components: Map<PluginSlot, Array<{ id: string; load: LazyComponentAny; order: number }>>;
  data: Map<string, unknown>;
  plugins: PluginMeta[];
}

const state: InternalRegistryState = {
  components: new Map(),
  data: new Map(),
  plugins: []
};

export function definePlugin(plugin: PluginModule): PluginModule { return plugin; }

export function registerPlugin(mod: PluginModule, ctx: Omit<PluginContext, 'registerComponent'>) {
  state.plugins.push(mod.meta);
  const registerComponent: PluginContext['registerComponent'] = (slot, component) => {
    const list = state.components.get(slot) ?? [];
    list.push({ id: mod.meta.id, load: component, order: mod.meta.order ?? 0 });
    state.components.set(slot, list);
  };
  const provideData: PluginContext['provideData'] = (key, value) => { state.data.set(key, value); };
  const getData: PluginContext['getData'] = (key) => state.data.get(key) as any;
  mod.components?.forEach(c => registerComponent(c.slot, c.component));
  mod.setup?.({ ...(ctx as any), registerComponent, provideData, getData });
}

export function getComponents(slot: PluginSlot) {
  return (state.components.get(slot) || []).sort((a,b) => a.order - b.order).map(x => x.load);
}

export function listPlugins() { return [...state.plugins]; }

export function getProvidedData<T=unknown>(key: string): T | undefined { return state.data.get(key) as T | undefined; }

// Dynamic discovery using Vite glob import (only includes .plugin.(ts|js) by naming convention)
type GlobModule = { default?: PluginModule } | PluginModule;
let discovered = false;
export async function initPlugins(ctx: { lang: 'en' | 'es' | 'ca'; env?: { build: boolean; mode: 'dev' | 'prod' } }) {
  // In dev with HMR we allow re-init to reflect changes
  if (discovered && ctx.env?.mode !== 'dev') return; 
  if (ctx.env?.mode === 'dev') {
    // Clear previous (light reset)
    state.components.clear();
    state.plugins.length = 0;
  }
  const modules = import.meta.glob('./**/*plugin.{ts,js}', { eager: true }) as Record<string, GlobModule>;
  for (const mod of Object.values(modules)) {
    const plugin: PluginModule = (mod as any).default ?? (mod as any);
    if (!plugin?.meta?.id) continue;
    if (plugin.meta.enable && !plugin.meta.enable(ctx.env || { build: false, mode: 'dev' })) continue;
    registerPlugin(plugin, {
      lang: ctx.lang,
      provideData: (k: string, v: unknown) => { state.data.set(k, v); },
      getData: (k: string) => state.data.get(k)
    } as any);
  }
  discovered = true;
  if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
      // flag so that next init triggers reload
      discovered = false;
    });
  }
}
