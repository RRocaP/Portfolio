# Rust Build Plugin (Planned)

This directory will contain a Rust crate compiled to WebAssembly to perform:
- Critical CSS extraction refinement (comparing Astro output bundle)
- Content hashing & lightweight semantic embedding (upgrade over JS hash)
- Potential approximate nearest neighbor index construction

## Planned Steps
1. Initialize cargo crate: `cargo new perf_tools --lib`
2. Add dependencies (e.g., `serde`, `wasm-bindgen`, optional `xxhash-rust`).
3. Implement functions:
   - `fn hash_ngrams(input: &str) -> Vec<f32>` (semantic embedding)
   - `fn score_candidates(query: &str, docs: Vec<&str>) -> Vec<f32>`
4. Compile with `wasm-pack build --target web` and place artifacts under `public/wasm/`.
5. Create Vite plugin to load and cache the WASM module during dev & build.

## Vite Integration Sketch
```ts
// vite.plugins.push(rustWasmPlugin())
function rustWasmPlugin() {
  return {
    name: 'rust-wasm-loader',
    enforce: 'pre',
    resolveId(id) { if (id === 'rust-wasm') return id; },
    load(id) {
      if (id === 'rust-wasm') {
        return `export async function load() { return await WebAssembly.instantiateStreaming(fetch('/wasm/perf_tools_bg.wasm')); }`;
      }
    }
  };
}
```

## Roadmap
- Phase 1: JS prototype (done)
- Phase 2: WASM parity
- Phase 3: WASM optimization & SIMD (if available)
- Phase 4: Off-main-thread worker integration
