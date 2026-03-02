import { resolve } from "node:path";

export const PORTFOLIO_ROOT = resolve(import.meta.dir, "..");

export const REVAMP_URL = "http://localhost:4321/Portfolio/revamp/";

export const MAX_ITERATIONS = 3;
export const QA_PASS_THRESHOLD = 7;
export const TOTAL_BUDGET_USD = 100;

export const SECTIONS = [
  {
    id: "hero",
    selector: ".rv-hero",
    component: "src/components/revamp/HeroRevamp.astro",
  },
  {
    id: "research",
    selector: ".rv-clusters",
    component: "src/components/revamp/ResearchClusters.astro",
  },
  {
    id: "impact",
    selector: ".rv-bento",
    component: "src/components/revamp/BentoGrid.astro",
  },
  {
    id: "publications",
    selector: ".rv-pubgraph",
    component: "src/components/revamp/PublicationGraph.astro",
  },
  {
    id: "contact",
    selector: ".rv-contact",
    component: "src/components/revamp/ContactRevamp.astro",
  },
] as const;

export const ANADOL_PROMPT_PREFIX = `\
Rendered as fluid data sculpture. \
Vast particle systems, bioluminescent palette, Refik Anadol aesthetic. \
Cinematic, 4K, dark background (#040608), flowing light streams. \
Gold accent (#D4A84B) woven through organic forms.`;

export const DOMAIN_PROMPTS: Record<string, string> = {
  hero: "Antimicrobial peptide sequences dissolving into bioluminescent particle streams, DNA helix motifs flowing through dark space",
  research:
    "Protein folding ribbons morphing into data clouds, crystalline AAV capsid structures dissolving into light particles",
  impact:
    "Genomic data visualization as luminous bar sculptures, metrics floating in volumetric space",
  publications:
    "Citation network rendered as flowing constellations of light, interconnected nodes pulsing with energy",
  contact:
    "Mediterranean blue-gold ambient soundscape, Barcelona coastal data streams with warm bioluminescence",
};
