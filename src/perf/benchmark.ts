// Simple benchmarking utility for client components & data ops
export interface BenchResult { name: string; durationMs: number; iterations: number; }

export async function bench(name: string, fn: () => void | Promise<void>, iterations = 50): Promise<BenchResult> {
  const start = performance.now();
  for (let i=0;i<iterations;i++) await fn();
  const end = performance.now();
  return { name, durationMs: (end - start), iterations };
}

export async function benchGroup(cases: Array<{ name: string; fn: () => void | Promise<void>; iterations?: number }>) {
  const results: BenchResult[] = [];
  for (const c of cases) results.push(await bench(c.name, c.fn, c.iterations ?? 50));
  return results.sort((a,b) => a.durationMs - b.durationMs);
}
