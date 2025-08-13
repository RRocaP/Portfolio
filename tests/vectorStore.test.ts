import { describe, it, expect } from 'vitest';
import { TfidfVectorStore } from '../src/ai/vectorStore';

describe('TfidfVectorStore', () => {
  it('indexes and retrieves documents', () => {
    const store = new TfidfVectorStore();
    store.addDocuments([
      { id: '1', text: 'antimicrobial peptide engineering' },
      { id: '2', text: 'vector design and liver targeting' }
    ]);
    const res = store.search('peptide');
    expect(res[0].id).toBe('1');
  });

  it('hybrid search returns results', () => {
    const store = new TfidfVectorStore();
    store.addDocuments([
      { id: 'a', text: 'protein stability optimization' },
      { id: 'b', text: 'nanoparticle delivery system' }
    ]);
    const res = store.hybridSearch('delivery');
    expect(res[0]).toBeTruthy();
  });
});
