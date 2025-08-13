// Custom minimal reactive state using Proxy + subscription signals
// Provides fine-grained reactivity without heavy runtime

export type Subscriber<T> = (value: T) => void;

export interface Signal<T> {
  get(): T;
  set(v: T | ((prev: T) => T)): void;
  subscribe(fn: Subscriber<T>): () => void;
}

export function signal<T>(initial: T): Signal<T> {
  let value = initial;
  const subs = new Set<Subscriber<T>>();
  return {
    get: () => value,
    set: (v) => {
      value = typeof v === 'function' ? (v as any)(value) : v;
      subs.forEach(fn => fn(value));
    },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); }
  };
}

// Derive creates a read-only computed signal
export function derive<A, B>(source: Signal<A>, map: (v: A) => B): Signal<B> {
  let cached = map(source.get());
  const subs = new Set<Subscriber<B>>();
  source.subscribe(v => { const next = map(v); if (next !== cached) { cached = next; subs.forEach(fn => fn(cached)); } });
  return {
    get: () => cached,
    set: () => { throw new Error('Cannot set derived signal'); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); }
  } as Signal<B>;
}

// Store creator with typed shape and proxy access
export type Store<T extends object> = T & { $subscribe: (fn: Subscriber<T>) => () => void };

export function createStore<T extends object>(initial: T): Store<T> {
  const root = signal(initial);
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === '$subscribe') return (fn: Subscriber<T>) => root.subscribe(fn);
      return target[prop];
    },
    set(target, prop, value) {
      (target as any)[prop] = value;
      root.set({ ...(target as any) });
      return true;
    }
  };
  return new Proxy(initial, handler) as Store<T>;
}
