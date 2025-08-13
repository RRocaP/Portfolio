export type FAQ = { category: string; q: string; a: string };

export const faqs: Record<string, FAQ[]> = {
  en: [
    { category: 'Research', q: 'What is your main scientific focus?', a: 'Engineering antimicrobial proteins and viral vectors using integrated computational + experimental workflows.' },
    { category: 'Methods', q: 'Do you use AI models?', a: 'Yes. I pair physics-based modeling with diffusion / language models for sequence & structure exploration.' },
    { category: 'Collaboration', q: 'How can collaborators engage?', a: 'Via co-development of assays, sharing target sequences, or joint grant / manuscript preparation.' }
  ],
  es: [
    { category: 'Investigación', q: '¿Cuál es tu foco científico principal?', a: 'Ingeniería de proteínas antimicrobianas y vectores virales con flujos computacionales + experimentales.' },
    { category: 'Métodos', q: '¿Usas modelos de IA?', a: 'Sí. Combino modelado basado en física con modelos de difusión / lenguaje para explorar secuencias y estructuras.' },
    { category: 'Colaboración', q: '¿Cómo colaborar?', a: 'A través de co-desarrollo de ensayos, compartiendo secuencias diana o preparación conjunta de artículos.' }
  ],
  ca: [
    { category: 'Recerca', q: 'Quin és el teu focus científic principal?', a: 'Enginyeria de proteïnes antimicrobianes i vectors virals amb fluxos computacionals + experimentals.' },
    { category: 'Mètodes', q: 'Utilitzes models d\'IA?', a: 'Sí. Combino modelatge basat en física amb models de difusió / llenguatge per explorar seqüències i estructures.' },
    { category: 'Col·laboració', q: 'Com es pot col·laborar?', a: 'Mitjançant co-desenvolupament d\'assaigs, compartint seqüències diana o preparació conjunta de manuscrits.' }
  ]
};
