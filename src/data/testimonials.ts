/**
 * Testimonials Data
 * Research collaborators, supervisors, and professional feedback
 */

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar?: string;
  content: {
    en: string;
    es: string;
    ca: string;
  };
  rating?: number;
  collaboration?: string;
  expertise: string[];
  linkedIn?: string;
  researchGate?: string;
  featured?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 'supervisor-molecular-biology',
    name: 'Dr. Maria González',
    title: 'Principal Investigator',
    organization: 'Institute for Biomedical Research',
    avatar: '/Portfolio/testimonials/dr-gonzalez.jpg',
    content: {
      en: "Ramon's work on antimicrobial protein design represents a significant breakthrough in computational biology. His ability to bridge theoretical modeling with experimental validation is exceptional. The functional inclusion bodies project demonstrates his innovative approach to protein engineering.",
      es: "El trabajo de Ramon en el diseño de proteínas antimicrobianas representa un avance significativo en biología computacional. Su capacidad para conectar el modelado teórico con la validación experimental es excepcional. El proyecto de cuerpos de inclusión funcionales demuestra su enfoque innovador en ingeniería de proteínas.",
      ca: "La feina de Ramon en el disseny de proteïnes antimicrobianes representa un avenç significatiu en biologia computacional. La seva capacitat per connectar el modelatge teòric amb la validació experimental és excepcional. El projecte de cossos d'inclusió funcionals demostra el seu enfocament innovador en enginyeria de proteïnes."
    },
    rating: 5,
    collaboration: '2022-Present',
    expertise: ['Protein Engineering', 'Computational Biology', 'Antimicrobial Research'],
    linkedIn: 'https://linkedin.com/in/maria-gonzalez-research',
    researchGate: 'https://researchgate.net/profile/Maria_Gonzalez',
    featured: true
  },
  {
    id: 'collaborator-gene-therapy',
    name: 'Prof. James Anderson',
    title: 'Professor of Gene Therapy',
    organization: 'University Medical Center',
    avatar: '/Portfolio/testimonials/prof-anderson.jpg',
    content: {
      en: "Working with Ramon on AAV vector optimization has been incredibly productive. His systematic approach to capsid evolution and thorough experimental validation have advanced our CAR-T cell generation protocols significantly. His technical expertise and collaborative spirit make him an invaluable research partner.",
      es: "Trabajar con Ramon en la optimización de vectores AAV ha sido increíblemente productivo. Su enfoque sistemático para la evolución de cápsides y la validación experimental exhaustiva han avanzado significativamente nuestros protocolos de generación de células CAR-T. Su experiencia técnica y espíritu colaborativo lo convierten en un socio de investigación invaluable.",
      ca: "Treballar amb Ramon en l'optimització de vectors AAV ha estat increïblement productiu. El seu enfocament sistemàtic per a l'evolució de càpsides i la validació experimental exhaustiva han avançat significativament els nostres protocols de generació de cèl·lules CAR-T. La seva experiència tècnica i esperit col·laboratiu el converteixen en un soci de recerca inestimable."
    },
    rating: 5,
    collaboration: '2023-Present',
    expertise: ['Gene Therapy', 'AAV Vectors', 'CAR-T Cells'],
    linkedIn: 'https://linkedin.com/in/james-anderson-gene-therapy',
    featured: true
  },
  {
    id: 'industry-collaborator',
    name: 'Dr. Sarah Chen',
    title: 'Senior Scientist',
    organization: 'BioTech Innovations Ltd.',
    avatar: '/Portfolio/testimonials/dr-chen.jpg',
    content: {
      en: "Ramon's contribution to our liver perfusion studies has been outstanding. His meticulous approach to experimental design and data analysis, combined with his deep understanding of AAV vector biology, has elevated the quality of our preclinical evaluations. His work directly contributed to advancing three therapeutic candidates.",
      es: "La contribución de Ramon a nuestros estudios de perfusión hepática ha sido sobresaliente. Su enfoque meticuloso del diseño experimental y análisis de datos, combinado con su profundo entendimiento de la biología de vectores AAV, ha elevado la calidad de nuestras evaluaciones preclínicas. Su trabajo contribuyó directamente al avance de tres candidatos terapéuticos.",
      ca: "La contribució de Ramon als nostres estudis de perfusió hepàtica ha estat excel·lent. El seu enfocament meticulós del disseny experimental i anàlisi de dades, combinat amb la seva profunda comprensió de la biologia de vectors AAV, ha elevat la qualitat de les nostres avaluacions preclíniques. La seva feina va contribuir directament a l'avenç de tres candidats terapèutics."
    },
    rating: 5,
    collaboration: '2023',
    expertise: ['Preclinical Research', 'Liver Biology', 'Therapeutic Development'],
    linkedIn: 'https://linkedin.com/in/sarah-chen-biotech',
    featured: true
  },
  {
    id: 'computational-mentor',
    name: 'Dr. Michael Roberts',
    title: 'Computational Biology Lead',
    organization: 'European Bioinformatics Institute',
    avatar: '/Portfolio/testimonials/dr-roberts.jpg',
    content: {
      en: "Ramon demonstrates exceptional skill in computational protein design. His work integrating machine learning approaches with traditional molecular dynamics simulations has produced novel insights into antimicrobial mechanisms. His code is clean, well-documented, and his methodologies are rigorous.",
      es: "Ramon demuestra una habilidad excepcional en el diseño computacional de proteínas. Su trabajo integrando enfoques de aprendizaje automático con simulaciones tradicionales de dinámica molecular ha producido conocimientos novedosos sobre mecanismos antimicrobianos. Su código es limpio, bien documentado, y sus metodologías son rigurosas.",
      ca: "Ramon demostra una habilitat excepcional en el disseny computacional de proteïnes. La seva feina integrant enfocaments d'aprenentatge automàtic amb simulacions tradicionals de dinàmica molecular ha produït coneixements nous sobre mecanismes antimicrobians. El seu codi és net, ben documentat, i les seves metodologies són rigoroses."
    },
    rating: 5,
    collaboration: '2022-2023',
    expertise: ['Computational Biology', 'Machine Learning', 'Molecular Dynamics'],
    linkedIn: 'https://linkedin.com/in/michael-roberts-compbio'
  },
  {
    id: 'conference-reviewer',
    name: 'Prof. Elena Rossi',
    title: 'Conference Program Chair',
    organization: 'International Protein Engineering Society',
    avatar: '/Portfolio/testimonials/prof-rossi.jpg',
    content: {
      en: "Ramon's presentations at our conferences consistently demonstrate the highest scientific standards. His ability to communicate complex protein engineering concepts clearly and his innovative experimental approaches have made significant impacts in our field. His poster presentations are always among the most visited.",
      es: "Las presentaciones de Ramon en nuestras conferencias demuestran consistentemente los más altos estándares científicos. Su capacidad para comunicar conceptos complejos de ingeniería de proteínas claramente y sus enfoques experimentales innovadores han tenido impactos significativos en nuestro campo. Sus presentaciones de pósters siempre están entre las más visitadas.",
      ca: "Les presentacions de Ramon a les nostres conferències demostren consistentment els estàndards científics més alts. La seva capacitat per comunicar conceptes complexos d'enginyeria de proteïnes clarament i els seus enfocaments experimentals innovadors han tingut impactes significatius en el nostre camp. Les seves presentacions de pòsters sempre són entre les més visitades."
    },
    rating: 5,
    collaboration: 'Conference Presentations 2022-2024',
    expertise: ['Protein Engineering', 'Scientific Communication', 'Peer Review']
  },
  {
    id: 'student-mentor',
    name: 'Alex Thompson',
    title: 'PhD Candidate',
    organization: 'Graduate School of Biomedical Sciences',
    avatar: '/Portfolio/testimonials/alex-thompson.jpg',
    content: {
      en: "As Ramon's mentee, I've learned not just advanced techniques in protein characterization, but also how to approach scientific problems systematically. His patience in explaining complex concepts and his dedication to ensuring reproducible results have shaped my approach to research. He's an exceptional mentor.",
      es: "Como aprendiz de Ramon, he aprendido no solo técnicas avanzadas en caracterización de proteínas, sino también cómo abordar problemas científicos sistemáticamente. Su paciencia para explicar conceptos complejos y su dedicación para asegurar resultados reproducibles han moldeado mi enfoque a la investigación. Es un mentor excepcional.",
      ca: "Com a aprenent de Ramon, he après no només tècniques avançades en caracterització de proteïnes, sinó també com abordar problemes científics sistemàticament. La seva paciència per explicar conceptes complexos i la seva dedicació per assegurar resultats reproduïbles han modelat el meu enfocament a la recerca. És un mentor excepcional."
    },
    rating: 5,
    collaboration: '2023-Present',
    expertise: ['Research Mentoring', 'Protein Characterization', 'Laboratory Techniques']
  }
];

export default testimonials;