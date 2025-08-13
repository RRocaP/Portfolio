// Placeholder for recommendation system logic
// Strategy: combine TF-IDF keyword vectors with optional future embedding provider

export interface PaperMeta { id: string; title: string; abstract?: string; year?: string; keywords?: string[]; }
export interface Recommendation { id: string; score: number; reasons: string[]; }

// Simple cosine similarity on keyword frequency vectors
function cosine(a: number[], b: number[]) { let dot=0, as=0, bs=0; for(let i=0;i<a.length;i++){ dot+=a[i]*b[i]; as+=a[i]*a[i]; bs+=b[i]*b[i]; } return dot / (Math.sqrt(as)*Math.sqrt(bs) || 1); }

export function recommend(papers: PaperMeta[], targetId: string, top = 5): Recommendation[] {
  const vocab = new Map<string, number>();
  papers.forEach(p => (p.keywords||[]).forEach(k => { if(!vocab.has(k)) vocab.set(k, vocab.size); }));
  const vectors = papers.map(p => {
    const vec = Array(vocab.size).fill(0);
    (p.keywords||[]).forEach(k => { const idx = vocab.get(k)!; vec[idx] += 1; });
    return { id: p.id, vec };
  });
  const target = vectors.find(v => v.id === targetId);
  if(!target) return [];
  return vectors.filter(v => v.id !== targetId)
    .map(v => ({ id: v.id, score: cosine(target.vec, v.vec), reasons: [] }))
    .sort((a,b) => b.score - a.score)
    .slice(0, top);
}
