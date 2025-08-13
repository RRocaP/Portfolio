use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn hash_ngrams(input: &str) -> Vec<f32> {
    let mut vec = vec![0f32; 256];
    let lower = input.to_lowercase();
    for gram in lower.as_bytes().windows(4) {
        let mut hash: u32 = 2166136261;
        for b in gram { hash = hash ^ (*b as u32); hash = hash.wrapping_mul(16777619); }
        let idx = (hash as usize) % 256;
        vec[idx] += 1.0;
    }
    // L2 normalize
    let sum: f32 = vec.iter().map(|v| v*v).sum::<f32>().sqrt();
    if sum > 0.0 { for v in &mut vec { *v /= sum; } }
    vec
}

#[wasm_bindgen]
pub fn cosine(a: &[f32], b: &[f32]) -> f32 {
    let mut dot = 0f32; let mut asq=0f32; let mut bsq=0f32;
    for i in 0..a.len().min(b.len()) { dot += a[i]*b[i]; asq += a[i]*a[i]; bsq += b[i]*b[i]; }
    if asq == 0.0 || bsq == 0.0 { return 0.0; }
    dot / (asq.sqrt()*bsq.sqrt())
}
