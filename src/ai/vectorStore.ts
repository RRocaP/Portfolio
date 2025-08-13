// Local TF-IDF vector store placeholder for smart search
// Not persistent; built at runtime from provided corpus
import { semanticHash, loadWasmHash } from './wasm';
export interface Doc { id: string; text: string; meta?: Record<string, any>; }
export interface VectorDoc extends Doc { vector: number[]; }

export class TfidfVectorStore {
  private docs: VectorDoc[] = [];
  private vocab = new Map<string, number>();
  private idf: number[] = [];

  addDocuments(docs: Doc[]) {
    for (const d of docs) this.ingest(d);
    this.recomputeIdf();
  }

  private tokenize(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w => w.length > 2);
  }

  private ingest(doc: Doc) {
    const tokens = this.tokenize(doc.text);
    // term frequency
    const tf: Record<string, number> = {};
    for (const t of tokens) tf[t] = (tf[t]||0)+1;
    Object.keys(tf).forEach(term => { if(!this.vocab.has(term)) this.vocab.set(term, this.vocab.size); });
    const vec = Array(this.vocab.size).fill(0);
    for (const [term,count] of Object.entries(tf)) {
      const idx = this.vocab.get(term)!;
      vec[idx] = count; // raw count for now; IDF applied on query
    }
    this.docs.push({ ...doc, vector: vec });
  }

  private recomputeIdf() {
    const N = this.docs.length;
    this.idf = Array(this.vocab.size).fill(0);
    for (let term of this.vocab.keys()) {
      const idx = this.vocab.get(term)!;
      let df = 0;
      for (const d of this.docs) if (d.vector[idx] > 0) df++;
      this.idf[idx] = Math.log((N + 1) / (df + 1)) + 1; // smoothed
    }
    // expand existing doc vectors length if vocab expanded later
    for (const d of this.docs) {
      if (d.vector.length < this.vocab.size) d.vector.length = this.vocab.size; // zero-fill
    }
  }

  private vectorizeQuery(q: string) {
    const tokens = this.tokenize(q);
    const freq: Record<string, number> = {};
    for (const t of tokens) freq[t] = (freq[t]||0)+1;
    const vec = Array(this.vocab.size).fill(0);
    for (const [term,count] of Object.entries(freq)) {
      const idx = this.vocab.get(term);
      if (idx != null) vec[idx] = count * this.idf[idx];
    }
    return vec;
  }

  // Basic TF-IDF search
  search(query: string, top = 5) {
    const qv = this.vectorizeQuery(query);
    const results = this.docs.map(d => ({ id: d.id, score: cosine(qv, tfidfDoc(d, this.idf)), meta: d.meta }));
    return results.sort((a,b) => b.score - a.score).slice(0, top);
  }

  // Semantic hashing embedding (character n-gram hashing) to approximate semantic similarity
    semanticVector(text: string) { return semanticHash(text); }

  // Hybrid search combining TF-IDF and semantic hash vector
  hybridSearch(query: string, top = 5, alpha = 0.6) {
    const tfidfQ = this.vectorizeQuery(query);
  // Opportunistically load WASM (fire & forget) then compute semantic vector (may still be JS fallback on first call)
  loadWasmHash().catch(()=>{});
  const semanticQ = this.semanticVector(query);
    return this.docs.map(d => {
      const tfidfScore = cosine(tfidfQ, tfidfDoc(d, this.idf));
      const semScore = cosine(Array.from(semanticQ), Array.from(this.semanticVector(d.text)));
      return { id: d.id, score: alpha*tfidfScore + (1-alpha)*semScore, meta: d.meta, tfidfScore, semScore };
    }).sort((a,b)=> b.score - a.score).slice(0, top);
  }
}

function cosine(a: number[], b: number[]) { let dot=0, as=0, bs=0; for(let i=0;i<a.length;i++){ const av=a[i]||0, bv=b[i]||0; dot+=av*bv; as+=av*av; bs+=bv*bv; } return dot / (Math.sqrt(as)*Math.sqrt(bs) || 1); }
function tfidfDoc(d: VectorDoc, idf: number[]) { return d.vector.map((tf,i)=> tf * idf[i]); }
