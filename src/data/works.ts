import type { Lang } from './i18n';

export interface Work {
  id: string;
  image: string;
  yearRange: string;
  tags: string[];
  title: Record<Lang, string>;
  blurb: Record<Lang, string>;
}

export const works: Work[] = [
  {
    id: 'amp',
    image: '/works/amp.webp',
    yearRange: '2018–Now',
    tags: ['Protein Engineering', 'AMR'],
    title: {
      en: 'Antimicrobial Peptides',
      es: 'Péptidos Antimicrobianos',
      ca: 'Pèptids Antimicrobians',
    },
    blurb: {
      en: 'Multidomain recombinant proteins that combine host defense peptides to overcome antibiotic resistance.',
      es: 'Proteínas recombinantes multidominio que combinan péptidos de defensa para superar la resistencia a antibióticos.',
      ca: 'Proteïnes recombinants multidomini que combinen pèptids de defensa per superar la resistència als antibiòtics.',
    },
  },
  {
    id: 'protein-eng',
    image: '/works/protein-eng.webp',
    yearRange: '2019–2022',
    tags: ['Inclusion Bodies', 'Nanomaterials'],
    title: {
      en: 'Protein Engineering',
      es: 'Ingeniería de Proteínas',
      ca: 'Enginyeria de Proteïnes',
    },
    blurb: {
      en: 'Functional inclusion bodies and leucine-zipper scaffolds as bioactive nanomaterials.',
      es: 'Cuerpos de inclusión funcionales y andamiajes de cremalleras de leucina como nanomateriales bioactivos.',
      ca: "Cossos d'inclusió funcionals i bastides de cremalleres de leucina com a nanomaterials bioactius.",
    },
  },
  {
    id: 'ml-bio',
    image: '/works/ml-bio.webp',
    yearRange: '2022–Now',
    tags: ['Machine Learning', 'Protein Design'],
    title: {
      en: 'ML in Biology',
      es: 'ML en Biología',
      ca: 'ML en Biologia',
    },
    blurb: {
      en: 'Applying deep learning to antimicrobial peptide discovery and capsid optimization.',
      es: 'Aplicando aprendizaje profundo al descubrimiento de péptidos antimicrobianos y optimización de cápsides.',
      ca: "Aplicant aprenentatge profund al descobriment de pèptids antimicrobians i optimització de càpsides.",
    },
  },
  {
    id: 'aav',
    image: '/works/aav.webp',
    yearRange: '2021–Now',
    tags: ['AAV', 'Directed Evolution'],
    title: {
      en: 'AAV Capsid Engineering',
      es: 'Ingeniería de Cápsides AAV',
      ca: 'Enginyeria de Càpsides AAV',
    },
    blurb: {
      en: 'Directed evolution of AAV capsids for improved tissue targeting and CAR-T cell transduction.',
      es: 'Evolución dirigida de cápsides AAV para mejor direccionamiento tisular y transducción de células CAR-T.',
      ca: 'Evolució dirigida de càpsides AAV per a millor direccionament tissular i transducció de cèl·lules CAR-T.',
    },
  },
  {
    id: 'inclusion-bodies',
    image: '/works/inclusion-bodies.webp',
    yearRange: '2018–2023',
    tags: ['Biomaterials', 'Nanoparticles'],
    title: {
      en: 'Functional Inclusion Bodies',
      es: 'Cuerpos de Inclusión Funcionales',
      ca: "Cossos d'Inclusió Funcionals",
    },
    blurb: {
      en: 'Engineering protein aggregates as bioactive nanoparticles for pharmaceutical applications.',
      es: 'Ingeniería de agregados proteicos como nanopartículas bioactivas para aplicaciones farmacéuticas.',
      ca: "Enginyeria d'agregats proteics com a nanopartícules bioactives per a aplicacions farmacèutiques.",
    },
  },
  {
    id: 'gene-therapy',
    image: '/works/gene-therapy.webp',
    yearRange: '2023–Now',
    tags: ['Gene Therapy', 'Rare Disease'],
    title: {
      en: 'Gene Therapy Vectors',
      es: 'Vectores de Terapia Génica',
      ca: 'Vectors de Teràpia Gènica',
    },
    blurb: {
      en: 'Preclinical AAV vector evaluation using ex situ liver perfusion and humanized mouse models.',
      es: 'Evaluación preclínica de vectores AAV usando perfusión hepática ex situ y modelos murinos humanizados.',
      ca: 'Avaluació preclínica de vectors AAV usant perfusió hepàtica ex situ i models murins humanitzats.',
    },
  },
];
