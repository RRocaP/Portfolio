export type Feature = {
  id: string;
  icon: string; // could be emoji or inline svg path id
  title: string;
  description: string;
};

export const featureSets: Record<string, Feature[]> = {
  en: [
    {
      id: 'computational-design',
      icon: '🧬',
      title: 'Computational Protein Design',
      description: 'Structure-guided and AI-assisted engineering of antimicrobial proteins and viral capsids.'
    },
    {
      id: 'experimental-validation',
      icon: '🧪',
      title: 'Rapid Experimental Validation',
      description: 'Tight build–measure cycles using expression, purification and functional assays.'
    },
    {
      id: 'vectorology',
      icon: '🚀',
      title: 'Vector Engineering',
      description: 'Optimization of AAV & delivery systems to translate designs into therapeutic platforms.'
    },
    {
      id: 'data-loop',
      icon: '♻️',
      title: 'Closed Data Loop',
      description: 'Experimental results feed model priors to continuously refine sequence/structure proposals.'
    }
  ],
  es: [
    {
      id: 'computational-design',
      icon: '🧬',
      title: 'Diseño Computacional de Proteínas',
      description: 'Ingeniería guiada por estructura y asistida por IA de proteínas antimicrobianas y cápsides virales.'
    },
    {
      id: 'experimental-validation',
      icon: '🧪',
      title: 'Validación Experimental Rápida',
      description: 'Ciclos construir–medir con expresión, purificación y ensayos funcionales.'
    },
    {
      id: 'vectorology',
      icon: '🚀',
      title: 'Ingeniería de Vectores',
      description: 'Optimización de AAV y sistemas de entrega para traducir diseños en plataformas terapéuticas.'
    },
    {
      id: 'data-loop',
      icon: '♻️',
      title: 'Bucle Cerrado de Datos',
      description: 'Los resultados experimentales retroalimentan a los modelos para refinar propuestas.'
    }
  ],
  ca: [
    {
      id: 'computational-design',
      icon: '🧬',
      title: 'Disseny Computacional de Proteïnes',
      description: 'Enginyeria guiada per estructura i assistida per IA de proteïnes antimicrobianes i càpsides virals.'
    },
    {
      id: 'experimental-validation',
      icon: '🧪',
      title: 'Validació Experimental Ràpida',
      description: 'Cicles construir–mesurar amb expressió, purificació i assajos funcionals.'
    },
    {
      id: 'vectorology',
      icon: '🚀',
      title: 'Enginyeria de Vectors',
      description: 'Optimització d’AAV i sistemes de lliurament per portar dissenys a plataformes terapèutiques.'
    },
    {
      id: 'data-loop',
      icon: '♻️',
      title: 'Bucle de Dades Tancat',
      description: 'Els resultats experimentals alimenten els models per refinar contínuament les propostes.'
    }
  ]
};
