export type Step = { id: string; title: string; blurb: string };

export const processSteps: Record<string, Step[]> = {
  en: [
    { id: 'target', title: 'Target Selection', blurb: 'Select resistant pathogen target or viral capsid goal informed by unmet clinical need.' },
    { id: 'in-silico', title: 'In‑silico Design', blurb: 'AI & physics-guided sequence / structure generation, filtering by stability & novelty metrics.' },
    { id: 'expression', title: 'Expression & Purification', blurb: 'Produce candidates, assess solubility, folding and purity by chromatography & SDS‑PAGE.' },
    { id: 'assay', title: 'Functional Assays', blurb: 'Measure antimicrobial activity or transduction efficiency; capture quantitative potency.' },
    { id: 'learn', title: 'Model Feedback', blurb: 'Feed assay metrics back to design heuristics to bias next iteration toward improved efficacy.' }
  ],
  es: [
    { id: 'target', title: 'Selección de Dianas', blurb: 'Elegir diana patógena resistente o objetivo de cápside viral según necesidad clínica.' },
    { id: 'in-silico', title: 'Diseño In‑silico', blurb: 'Generación de secuencias y estructuras guiada por IA y física, filtrando estabilidad y novedad.' },
    { id: 'expression', title: 'Expresión & Purificación', blurb: 'Producir candidatos y evaluar solubilidad, plegamiento y pureza.' },
    { id: 'assay', title: 'Ensayos Funcionales', blurb: 'Medir actividad antimicrobiana o eficiencia de transducción con métricas cuantitativas.' },
    { id: 'learn', title: 'Retroalimentación', blurb: 'Los datos de los ensayos ajustan los heurísticos de diseño para la siguiente iteración.' }
  ],
  ca: [
    { id: 'target', title: 'Selecció de Dianes', blurb: 'Escollir diana patògena resistent o objectiu de càpside segons necessitat clínica.' },
    { id: 'in-silico', title: 'Disseny In‑silico', blurb: 'Generació de seqüències / estructures guiada per IA i física, filtrant estabilitat i novetat.' },
    { id: 'expression', title: 'Expressió & Purificació', blurb: 'Produir candidats i avaluar solubilitat, plegament i puresa.' },
    { id: 'assay', title: 'Assaigs Funcionals', blurb: 'Mesurar activitat antimicrobiana o eficiència de transducció amb mètriques quantitatives.' },
    { id: 'learn', title: 'Aprenentatge', blurb: 'Les mètriques alimenten els heurístics per refinar la següent iteració.' }
  ]
};
