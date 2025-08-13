import React, { useState, useEffect, type FormEvent } from 'react';
import { publications } from '../data/publications.js';
// Worker is code-split; fallback to in-thread dynamic import if Worker unsupported

interface WorkerMessage {
  type: string;
  results?: any[];
  tags?: string[];
  query?: string;
  error?: string;
}

// Command handler interface
interface ChatContext { query: string; }
interface ChatResponse { type: 'text' | 'list'; content: string; items?: Array<{ title: string; url: string }>; }

type Command = (ctx: ChatContext) => Promise<ChatResponse | null>;

const helpText = 'Commands: pub <keywords>, cat <keyword-in-journal>, tags <abstract text>, help';

// Worker instance (lazy)
let vw: Worker | null = null;
function getWorker() {
  if (typeof window === 'undefined') return null;
  if (!vw) {
    try { vw = new Worker(new URL('../ai/vectorWorker.ts', import.meta.url), { type: 'module' }); } catch {}
  }
  return vw;
}

// Initialize worker with publication titles
function initWorker() {
  const w = getWorker();
  if (!w) return;
  w.postMessage({ type: 'init', documents: publications.map((p,i)=> ({ id: String(i), text: p.title, meta: p })) });
}

const publicationCommand: Command = async ({ query }) => {
  if (!query.startsWith('pub ')) return null;
  const q = query.slice(4);
  const w = getWorker();
  if (w) {
    return new Promise(res => {
      const handler = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.type === 'hybridResult' && e.data.query === q) {
          w.removeEventListener('message', handler);
          const results = e.data.results || [];
          res({ type: 'list', content: `Top matches for "${q}"`, items: results.map(r => ({ title: r.meta.title, url: r.meta.url })) });
        }
      };
      w.addEventListener('message', handler);
      w.postMessage({ type: 'hybrid', query: q, top: 5 });
    });
  } else {
    // Fallback: dynamic import search inline (rare)
    const { TfidfVectorStore } = await import('../ai/vectorStore');
    const s = new TfidfVectorStore();
    s.addDocuments(publications.map((p,i)=> ({ id: String(i), text: p.title, meta: p })));
    const results = s.hybridSearch(q, 5);
    return { type: 'list', content: `Top matches for "${q}"`, items: results.map(r => ({ title: (r.meta as any).title, url: (r.meta as any).url })) };
  }
};

// Category (journal) filter
const categoryCommand: Command = async ({ query }) => {
  if (!query.startsWith('cat ')) return null;
  const kw = query.slice(4).toLowerCase();
  const matches = publications.filter(p => p.journal?.toLowerCase().includes(kw));
  return { type: 'list', content: `Publications in journals matching "${kw}"`, items: matches.slice(0,8).map(p => ({ title: p.title, url: p.url })) };
};

// Tag extraction from arbitrary abstract text
const tagsCommand: Command = async ({ query }) => {
  if (!query.startsWith('tags ')) return null;
  const text = query.slice(5);
  const w = getWorker();
  if (w) {
    return new Promise(res => {
      const handler = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.type === 'tagsResult') {
          w.removeEventListener('message', handler);
          res({ type: 'text', content: 'Tags: ' + (e.data.tags || []).join(', ') });
        }
      };
      w.addEventListener('message', handler);
      w.postMessage({ type: 'tags', text });
    });
  } else {
    const { extractTags } = await import('../ai/tagging');
    return { type: 'text', content: 'Tags: ' + extractTags(text).join(', ') };
  }
};

const helpCommand: Command = async ({ query }) => query === 'help' ? { type: 'text', content: helpText } : null;

const commands: Command[] = [publicationCommand, categoryCommand, tagsCommand, helpCommand];

export const AIChat: React.FC = () => {
  const [history, setHistory] = useState<ChatResponse[]>([
    { type: 'text', content: 'Hi! Ask me about publications. Type `help` for commands.' }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => { initWorker(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    for (const cmd of commands) {
      const res = await cmd({ query: q });
      if (res) { setHistory(h => [...h, res]); return; }
    }
    setHistory(h => [...h, { type: 'text', content: `No handler for: ${q}` }]);
  }

  return (
    <div className="ai-chat">
      <div className="ai-chat-history">
        {history.map((h,i) => (
          <div key={i} className="ai-chat-msg">
            {h.type === 'text' && <p>{h.content}</p>}
            {h.type === 'list' && (
              <div>
                <p>{h.content}</p>
                <ul>{h.items?.map(it => <li key={it.url}><a href={it.url} target="_blank" rel="noreferrer">{it.title}</a></li>)}</ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="ai-chat-form">
  <input value={input} onChange={e=>setInput(e.target.value)} placeholder="pub liver | cat therapy | tags <abstract>" />
        <button type="submit">Send</button>
      </form>
  <style>{`
        .ai-chat { background: var(--background-elevated); border: 1px solid var(--border); padding: 1rem; border-radius: 8px; max-width: 420px; }
        .ai-chat-history { max-height: 240px; overflow-y: auto; font-size: 0.9rem; }
        .ai-chat-msg { margin-bottom: 0.75rem; }
        .ai-chat-form { display: flex; gap: 0.5rem; }
        .ai-chat-form input { flex: 1; background: var(--background-alt); border: 1px solid var(--border); color: var(--text-primary); padding: 0.5rem; border-radius: 4px; }
        .ai-chat-form button { background: var(--accent-red); border: none; color: #000; padding: 0.5rem 0.75rem; border-radius: 4px; cursor: pointer; }
        .ai-chat-form button:hover { background: var(--accent-red-hover); }
      `}</style>
    </div>
  );
};

export default AIChat;
