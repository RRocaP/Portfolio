// Web Worker to offload vector store building & hybrid search + tagging
// This keeps the main UI thread responsive.
import { TfidfVectorStore, type Doc } from './vectorStore';
import { loadWasmHash } from './wasm';
import { extractTags } from './tagging';

interface InitMessage { type: 'init'; documents: Doc[]; }
interface SearchMessage { type: 'search'; query: string; top?: number; }
interface TagsMessage { type: 'tags'; text: string; max?: number; }
interface PingMessage { type: 'ping'; }
interface HybridMessage { type: 'hybrid'; query: string; top?: number; alpha?: number; }

type InMsg = InitMessage | SearchMessage | TagsMessage | PingMessage | HybridMessage;

let store: TfidfVectorStore | null = null;
loadWasmHash().catch(()=>{}); // kick off early

function ensureStore() { if(!store) store = new TfidfVectorStore(); return store; }

// Simple incremental init (can be called multiple times)
function handleInit(msg: InitMessage) {
  const s = ensureStore();
  s.addDocuments(msg.documents);
  (self as any).postMessage({ type: 'inited', count: msg.documents.length });
}

function handleSearch(msg: SearchMessage | HybridMessage) {
  if(!store) { (self as any).postMessage({ type: 'error', error: 'not_initialized' }); return; }
  if(msg.type === 'search') {
    const results = store.search(msg.query, msg.top || 5);
    (self as any).postMessage({ type: 'searchResult', query: msg.query, results });
  } else {
    const results = store.hybridSearch(msg.query, msg.top || 5, msg.alpha);
    (self as any).postMessage({ type: 'hybridResult', query: msg.query, results });
  }
}

function handleTags(msg: TagsMessage) {
  const tags = extractTags(msg.text, msg.max || 8);
  (self as any).postMessage({ type: 'tagsResult', tags });
}

(self as any).onmessage = (e: MessageEvent<InMsg>) => {
  const msg = e.data;
  try {
    switch(msg.type) {
      case 'init': return handleInit(msg);
      case 'search':
      case 'hybrid': return handleSearch(msg as any);
      case 'tags': return handleTags(msg);
      case 'ping': return (self as any).postMessage({ type: 'pong' });
    }
  } catch (err: any) {
    (self as any).postMessage({ type: 'error', error: String(err?.message || err) });
  }
};

export {}; // ensure module scope
