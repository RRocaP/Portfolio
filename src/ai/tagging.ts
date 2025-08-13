// Automatic tag generation from abstracts (very naive baseline)
// Future: replace with embedding + keyword extraction

export function extractTags(text: string, max = 8): string[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g,' ');
  const words = cleaned.split(/\s+/).filter(w => w.length > 4);
  const stop = new Set(['their','there','which','these','those','within','between','while','where','after','before','could','would','about','being']);
  const freq: Record<string, number> = {};
  for(const w of words){ if(stop.has(w)) continue; freq[w] = (freq[w]||0)+1; }
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,max).map(([w])=>w);
}
