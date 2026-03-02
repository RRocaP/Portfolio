import type { Lang } from './i18n';

export interface WritingEntry {
  id: string;
  year: string;
  journal: string;
  doi: string;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
}

/**
 * Curated publication highlights — plain-language summaries for a general audience.
 * Sourced from publications.js, selected for impact and narrative relevance.
 */
export const writing: WritingEntry[] = [
  {
    id: 'capsid-cart-2025',
    year: '2025',
    journal: 'Molecular Therapy',
    doi: '10.1016/j.ymthe.2024.12.012',
    title: {
      en: 'Better AAV Capsids for CAR-T Cell Manufacturing',
      es: 'Mejores cápsides AAV para fabricar células CAR-T',
      ca: 'Millors càpsides AAV per fabricar cèl·lules CAR-T',
    },
    summary: {
      en: 'We used directed evolution to find AAV capsid variants that transduce T cells more efficiently — a bottleneck in making CAR-T therapies.',
      es: 'Usamos evolución dirigida para encontrar variantes de cápsides AAV que transducen células T más eficientemente — un cuello de botella en la fabricación de terapias CAR-T.',
      ca: "Vam usar evolució dirigida per trobar variants de càpsides AAV que transdueixen cèl·lules T més eficientment — un coll d'ampolla en la fabricació de teràpies CAR-T.",
    },
  },
  {
    id: 'liver-perfusion-2024',
    year: '2024',
    journal: 'Nature Communications',
    doi: '10.1038/s41467-024-46194-y',
    title: {
      en: 'Testing Gene Therapy Vectors in Human Livers',
      es: 'Probando vectores de terapia génica en hígados humanos',
      ca: 'Provant vectors de teràpia gènica en fetges humans',
    },
    summary: {
      en: 'We kept whole human livers alive outside the body to test how AAV vectors perform — bridging the gap between lab dishes and clinical trials.',
      es: 'Mantuvimos hígados humanos vivos fuera del cuerpo para probar vectores AAV — acortando la distancia entre el laboratorio y los ensayos clínicos.',
      ca: 'Vam mantenir fetges humans vius fora del cos per provar vectors AAV — escurçant la distància entre el laboratori i els assaigs clínics.',
    },
  },
  {
    id: 'hdp-review-2022',
    year: '2022',
    journal: 'Microbial Cell Factories',
    doi: '10.1186/s12934-022-01991-2',
    title: {
      en: 'The Future of Recombinant Host Defense Peptides',
      es: 'El futuro de los péptidos de defensa recombinantes',
      ca: 'El futur dels pèptids de defensa recombinants',
    },
    summary: {
      en: 'A roadmap for producing antimicrobial peptides at scale using recombinant DNA technology — our most-cited recent work.',
      es: 'Una hoja de ruta para producir péptidos antimicrobianos a escala usando tecnología de ADN recombinante — nuestro trabajo reciente más citado.',
      ca: "Un full de ruta per produir pèptids antimicrobians a escala usant tecnologia d'ADN recombinant — el nostre treball recent més citat.",
    },
  },
  {
    id: 'multidomain-2021',
    year: '2021',
    journal: 'Scientific Reports',
    doi: '10.1038/s41598-021-03220-z',
    title: {
      en: 'Tuning Multidomain Antimicrobial Proteins',
      es: 'Ajustando proteínas antimicrobianas multidominio',
      ca: 'Ajustant proteïnes antimicrobianes multidomini',
    },
    summary: {
      en: 'Swapping individual domains in our antimicrobial proteins changes both their killing power and immune-modulating effects — a design lever for precision therapeutics.',
      es: 'Intercambiar dominios individuales en nuestras proteínas antimicrobianas cambia tanto su poder bactericida como sus efectos inmunomoduladores — una palanca de diseño para terapéuticos de precisión.',
      ca: 'Intercanviar dominis individuals en les nostres proteïnes antimicrobianes canvia tant el seu poder bactericida com els seus efectes immunomoduladors — una palanca de disseny per a terapèutics de precisió.',
    },
  },
  {
    id: 'multidomain-2020',
    year: '2020',
    journal: 'Microbial Cell Factories',
    doi: '10.1186/s12934-020-01380-7',
    title: {
      en: 'A New Generation of Antimicrobial Proteins',
      es: 'Una nueva generación de proteínas antimicrobianas',
      ca: 'Una nova generació de proteïnes antimicrobianes',
    },
    summary: {
      en: 'We fused multiple antimicrobial domains into single recombinant polypeptides that outperform their individual parts against resistant bacteria.',
      es: 'Fusionamos múltiples dominios antimicrobianos en polipéptidos recombinantes que superan a sus partes individuales contra bacterias resistentes.',
      ca: 'Vam fusionar múltiples dominis antimicrobians en polipèptids recombinants que superen les seves parts individuals contra bacteris resistents.',
    },
  },
  {
    id: 'leucine-2020',
    year: '2020',
    journal: 'Microbial Cell Factories',
    doi: '10.1186/s12934-020-01425-x',
    title: {
      en: 'Leucine Zippers for Functional Inclusion Bodies',
      es: 'Cremalleras de leucina para cuerpos de inclusión funcionales',
      ca: 'Cremalleres de leucina per a cossos d\'inclusió funcionals',
    },
    summary: {
      en: 'Leucine zippers drive controlled protein aggregation into bioactive nanoparticles — opening a new class of biomaterials for drug delivery.',
      es: 'Las cremalleras de leucina dirigen la agregación controlada de proteínas en nanopartículas bioactivas — abriendo una nueva clase de biomateriales para entrega de fármacos.',
      ca: "Les cremalleres de leucina dirigeixen l'agregació controlada de proteïnes en nanopartícules bioactives — obrint una nova classe de biomaterials per a lliurament de fàrmacs.",
    },
  },
];
