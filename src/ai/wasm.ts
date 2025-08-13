// wasm.ts - optional loader for Rust WASM hash_ngrams function
// Gracefully degrades if WASM asset missing (e.g., during local dev without build)

let _hash: ((text: string) => Float32Array) | null = null;
let _loading: Promise<void> | null = null;

export function hasWasmHash() { return !!_hash; }

export async function loadWasmHash(): Promise<boolean> {
  if (_hash) return true;
  if (_loading) { await _loading; return !!_hash; }
  _loading = (async () => {
    try {
      const resp = await fetch('/wasm/perf_tools_bg.wasm');
      if (!resp.ok) return;
      const wasm = await WebAssembly.instantiateStreaming(resp, {} as any);
      const exp: any = wasm.instance.exports;
      if (typeof exp.hash_ngrams === 'function' && typeof exp.memory !== 'undefined') {
        _hash = (text: string) => {
          try {
            const arr = exp.hash_ngrams(text) as number[] | Float32Array;
            return arr instanceof Float32Array ? arr : Float32Array.from(arr);
          } catch {
            return jsFallback(text);
          }
        };
      }
    } catch {
      /* ignore */
    }
  })();
  await _loading;
  return !!_hash;
}

function jsFallback(text: string) {
  const vec = new Float32Array(256);
  const lower = text.toLowerCase();
  for (let i=0;i<lower.length-3;i++) {
    const gram = lower.slice(i, i+4);
    let hash = 2166136261;
    for (let j=0;j<gram.length;j++) hash = (hash ^ gram.charCodeAt(j)) * 16777619;
    const idx = Math.abs(hash) % 256;
    vec[idx] += 1;
  }
  let sum=0; for (let v of vec) sum+=v*v; sum=Math.sqrt(sum)||1; for (let i=0;i<vec.length;i++) vec[i]/=sum; return vec;
}

export function semanticHash(text: string) {
  if (_hash) return _hash(text);
  return jsFallback(text);
}
