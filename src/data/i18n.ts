export type Lang = 'en' | 'es' | 'ca';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      research: 'Research',
      publications: 'Publications',
      contact: 'Contact',
      works: 'Works',
      writing: 'Writing'
    },
    hero: {
      title: 'Ramon Roca Pinilla',
      subtitle: 'Biomedical Engineer \u2022 AI/ML Enthusiast \u2022 Molecular Biologist',
      tagline: 'Engineering proteins and viral vectors to combat antimicrobial resistance and advance gene therapy through computational design and experimental validation.'
    },
    sections: {
      selectedPublications: 'Selected Publications',
      allPublications: 'All Publications',
      aboutMe: 'About',
      researchAreas: 'Research Areas',
      impact: 'Research Impact',
      timeline: 'Career Journey',
      contact: 'Get in Touch',
      narrative: 'Research Vision'
    },
    researchAreas: {
      antimicrobial: {
        title: 'Antimicrobial Engineering',
        description: 'Designing multidomain recombinant proteins and host defense peptides to combat drug-resistant infections.'
      },
      geneTherapy: {
        title: 'Gene Therapy & Capsid Engineering',
        description: 'Engineering AAV capsid variants through directed evolution for improved tissue targeting and therapeutic delivery.'
      },
      computational: {
        title: 'AI & Computational Biology',
        description: 'Applying machine learning to protein design, capsid optimization, and antimicrobial peptide discovery.'
      }
    },
    contact: {
      heading: "Let's Connect",
      description: 'Interested in collaboration, have questions about my research, or want to discuss antimicrobial resistance and gene therapy?',
      email: 'rroca@cmri.org.au',
      location: 'CMRI, Sydney, Australia',
      viewScholar: 'View on Google Scholar',
      viewAll: 'View all on Scholar'
    },
    v3: {
      heroTagline: 'Engineering proteins and viral vectors to fight antimicrobial resistance.',
      viewWorks: 'View Works',
      getInTouch: 'Get in Touch',
      worksHeading: 'Selected Works',
      aboutHeading: 'About',
      writingHeading: 'Writing',
      contactHeading: "Let's Connect",
      researchFocus: 'Research Focus',
      timelineHeading: 'Journey',
      footerTagline: 'Still amazed that proteins remember how to fold.',
    },
    gemini: {
      heroTitle: 'Engineering proteins\nand viral vectors.',
      heroSubtitle: 'Combating antimicrobial resistance and advancing gene therapy through computational design and experimental validation.',
      ctaPrimary: 'View Publications',
      ctaSecondary: 'The Story',
      scrollHint: 'Scroll',
      sectionWorks: '01. Selected Works',
      sectionAbout: '02. The Story',
      sectionWriting: '03. Writing',
      aboutTitle: 'Exploring spaces no bench can cover.',
      aboutBio: [
        'My background spans from a Biotechnology degree in Barcelona to a Masters in Biomedical Engineering at UC Irvine. During my PhD, I spent four years on multidomain antimicrobial protein design, leading to two patents.',
        "At the Children's Medical Research Institute (CMRI) in Sydney, I built and led a computational peptide discovery platform. I combined large-scale sequence analysis, protein language models, and GPU-accelerated pipelines to design and experimentally validate over 100 antimicrobial peptide candidates.",
        "I also contributed heavily to AAV capsid engineering and directed evolution for gene therapies. I don't use computation as a replacement for the bench, but to explore spaces and sequences that no bench can cover alone."
      ],
      competenciesTitle: 'Core Competencies',
      competencies: ['Protein Language Models', 'AAV Capsid Engineering', 'Python & Data Science', 'Antimicrobial Discovery', 'GPU-Accelerated Pipelines', 'Molecular Biology'],
      contactHeading: 'Exploring spaces no bench can cover.',
      contactSubtitle: 'Bridging computation and biology. 20+ publications, 300+ citations, and 2 patents in antimicrobial drug discovery and protein engineering.',
      footerCopy: 'All rights reserved.',
      viewAllScholar: 'View all on Scholar',
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      about: 'Sobre m\u00ed',
      research: 'Investigaci\u00f3n',
      publications: 'Publicaciones',
      contact: 'Contacto',
      works: 'Proyectos',
      writing: 'Escritos'
    },
    hero: {
      title: 'Ramon Roca Pinilla',
      subtitle: 'Ingeniero Biom\u00e9dico \u2022 Entusiasta IA/ML \u2022 Bi\u00f3logo Molecular',
      tagline: 'Dise\u00f1ando prote\u00ednas y vectores virales para combatir la resistencia antimicrobiana y avanzar la terapia g\u00e9nica mediante dise\u00f1o computacional y validaci\u00f3n experimental.'
    },
    sections: {
      selectedPublications: 'Publicaciones Seleccionadas',
      allPublications: 'Todas las Publicaciones',
      aboutMe: 'Sobre m\u00ed',
      researchAreas: '\u00c1reas de Investigaci\u00f3n',
      impact: 'Impacto Cient\u00edfico',
      timeline: 'Trayectoria',
      contact: 'Contacto',
      narrative: 'Visi\u00f3n de Investigaci\u00f3n'
    },
    researchAreas: {
      antimicrobial: {
        title: 'Ingenier\u00eda Antimicrobiana',
        description: 'Dise\u00f1o de prote\u00ednas recombinantes multidominio y p\u00e9ptidos de defensa para combatir infecciones resistentes.'
      },
      geneTherapy: {
        title: 'Terapia G\u00e9nica e Ingenier\u00eda de C\u00e1psides',
        description: 'Ingenier\u00eda de variantes de c\u00e1psides AAV mediante evoluci\u00f3n dirigida para mejorar la entrega terap\u00e9utica.'
      },
      computational: {
        title: 'IA y Biolog\u00eda Computacional',
        description: 'Aplicaci\u00f3n de aprendizaje autom\u00e1tico al dise\u00f1o de prote\u00ednas, optimizaci\u00f3n de c\u00e1psides y descubrimiento de p\u00e9ptidos.'
      }
    },
    contact: {
      heading: 'Contactemos',
      description: '\u00bfInteresado en colaborar, tienes preguntas sobre mi investigaci\u00f3n, o quieres discutir resistencia antimicrobiana y terapia g\u00e9nica?',
      email: 'rroca@cmri.org.au',
      location: 'CMRI, S\u00eddney, Australia',
      viewScholar: 'Ver en Google Scholar',
      viewAll: 'Ver todo en Scholar'
    },
    v3: {
      heroTagline: 'Diseñando proteínas y vectores virales para combatir la resistencia antimicrobiana.',
      viewWorks: 'Ver Proyectos',
      getInTouch: 'Contactar',
      worksHeading: 'Proyectos Seleccionados',
      aboutHeading: 'Sobre mí',
      writingHeading: 'Escritos',
      contactHeading: 'Conectemos',
      researchFocus: 'Áreas de Investigación',
      timelineHeading: 'Trayectoria',
      footerTagline: 'Aún asombrado de que las proteínas recuerden cómo plegarse.',
    },
    gemini: {
      heroTitle: 'Diseñando proteínas\ny vectores virales.',
      heroSubtitle: 'Combatiendo la resistencia antimicrobiana y avanzando la terapia génica mediante diseño computacional y validación experimental.',
      ctaPrimary: 'Ver Publicaciones',
      ctaSecondary: 'La Historia',
      scrollHint: 'Desplazar',
      sectionWorks: '01. Trabajos Seleccionados',
      sectionAbout: '02. La Historia',
      sectionWriting: '03. Escritos',
      aboutTitle: 'Explorando espacios que ningún laboratorio puede cubrir.',
      aboutBio: [
        'Mi formación abarca desde un grado en Biotecnología en Barcelona hasta un Máster en Ingeniería Biomédica en UC Irvine. Durante mi doctorado, dediqué cuatro años al diseño de proteínas antimicrobianas multidominio, lo que resultó en dos patentes.',
        'En el Children\'s Medical Research Institute (CMRI) en Sídney, construí y lideré una plataforma computacional de descubrimiento de péptidos. Combiné análisis de secuencias a gran escala, modelos de lenguaje de proteínas y pipelines acelerados por GPU para diseñar y validar experimentalmente más de 100 candidatos de péptidos antimicrobianos.',
        'También contribuí significativamente a la ingeniería de cápsides AAV y evolución dirigida para terapias génicas. No uso la computación como reemplazo del laboratorio, sino para explorar espacios y secuencias que ningún laboratorio puede cubrir por sí solo.'
      ],
      competenciesTitle: 'Competencias Clave',
      competencies: ['Modelos de Lenguaje de Proteínas', 'Ingeniería de Cápsides AAV', 'Python y Ciencia de Datos', 'Descubrimiento Antimicrobiano', 'Pipelines Acelerados por GPU', 'Biología Molecular'],
      contactHeading: 'Explorando espacios que ningún laboratorio puede cubrir.',
      contactSubtitle: 'Uniendo computación y biología. 20+ publicaciones, 300+ citas y 2 patentes en descubrimiento de fármacos antimicrobianos e ingeniería de proteínas.',
      footerCopy: 'Todos los derechos reservados.',
      viewAllScholar: 'Ver todo en Scholar',
    }
  },
  ca: {
    nav: {
      home: 'Inici',
      about: 'Sobre mi',
      research: 'Recerca',
      publications: 'Publicacions',
      contact: 'Contacte',
      works: 'Projectes',
      writing: 'Escrits'
    },
    hero: {
      title: 'Ramon Roca Pinilla',
      subtitle: 'Enginyer Biom\u00e8dic \u2022 Entusiasta IA/ML \u2022 Bi\u00f2leg Molecular',
      tagline: 'Dissenyant prote\u00efnes i vectors virals per combatre la resist\u00e8ncia antimicrobiana i avan\u00e7ar la ter\u00e0pia g\u00e8nica mitjan\u00e7ant disseny computacional i validaci\u00f3 experimental.'
    },
    sections: {
      selectedPublications: 'Publicacions Seleccionades',
      allPublications: 'Totes les Publicacions',
      aboutMe: 'Sobre mi',
      researchAreas: '\u00c0rees de Recerca',
      impact: 'Impacte Cient\u00edfic',
      timeline: 'Traject\u00f2ria',
      contact: 'Contacte',
      narrative: 'Visi\u00f3 de Recerca'
    },
    researchAreas: {
      antimicrobial: {
        title: 'Enginyeria Antimicrobiana',
        description: 'Disseny de prote\u00efnes recombinants multidomini i p\u00e8ptids de defensa per combatre infeccions resistents.'
      },
      geneTherapy: {
        title: 'Ter\u00e0pia G\u00e8nica i Enginyeria de C\u00e0psides',
        description: 'Enginyeria de variants de c\u00e0psides AAV mitjan\u00e7ant evoluci\u00f3 dirigida per millorar el lliurament terap\u00e8utic.'
      },
      computational: {
        title: 'IA i Biologia Computacional',
        description: 'Aplicaci\u00f3 d\'aprenentatge autom\u00e0tic al disseny de prote\u00efnes, optimitzaci\u00f3 de c\u00e0psides i descobriment de p\u00e8ptids.'
      }
    },
    contact: {
      heading: 'Connectem',
      description: 'Interessat en col\u00b7laborar, tens preguntes sobre la meva recerca, o vols parlar de resist\u00e8ncia antimicrobiana i ter\u00e0pia g\u00e8nica?',
      email: 'rroca@cmri.org.au',
      location: 'CMRI, Sydney, Austr\u00e0lia',
      viewScholar: 'Veure a Google Scholar',
      viewAll: 'Veure tot a Scholar'
    },
    v3: {
      heroTagline: 'Dissenyant proteïnes i vectors virals per combatre la resistència antimicrobiana.',
      viewWorks: 'Veure Projectes',
      getInTouch: 'Contactar',
      worksHeading: 'Projectes Seleccionats',
      aboutHeading: 'Sobre mi',
      writingHeading: 'Escrits',
      contactHeading: 'Connectem',
      researchFocus: 'Àrees de Recerca',
      timelineHeading: 'Trajectòria',
      footerTagline: 'Encara sorprès que les proteïnes recordin com plegar-se.',
    },
    gemini: {
      heroTitle: 'Dissenyant proteïnes\ni vectors virals.',
      heroSubtitle: 'Combatent la resistència antimicrobiana i avançant la teràpia gènica mitjançant disseny computacional i validació experimental.',
      ctaPrimary: 'Veure Publicacions',
      ctaSecondary: 'La Història',
      scrollHint: 'Desplaçar',
      sectionWorks: '01. Treballs Seleccionats',
      sectionAbout: '02. La Història',
      sectionWriting: '03. Escrits',
      aboutTitle: 'Explorant espais que cap laboratori pot cobrir.',
      aboutBio: [
        'La meva formació abasta des d\'un grau en Biotecnologia a Barcelona fins a un Màster en Enginyeria Biomèdica a UC Irvine. Durant el meu doctorat, vaig dedicar quatre anys al disseny de proteïnes antimicrobianes multidomini, cosa que va resultar en dues patents.',
        'Al Children\'s Medical Research Institute (CMRI) a Sydney, vaig construir i liderar una plataforma computacional de descobriment de pèptids. Vaig combinar anàlisi de seqüències a gran escala, models de llenguatge de proteïnes i pipelines accelerats per GPU per dissenyar i validar experimentalment més de 100 candidats de pèptids antimicrobians.',
        'També vaig contribuir significativament a l\'enginyeria de càpsides AAV i evolució dirigida per a teràpies gèniques. No faig servir la computació com a reemplaçament del laboratori, sinó per explorar espais i seqüències que cap laboratori pot cobrir per si sol.'
      ],
      competenciesTitle: 'Competències Clau',
      competencies: ['Models de Llenguatge de Proteïnes', 'Enginyeria de Càpsides AAV', 'Python i Ciència de Dades', 'Descobriment Antimicrobià', 'Pipelines Accelerats per GPU', 'Biologia Molecular'],
      contactHeading: 'Explorant espais que cap laboratori pot cobrir.',
      contactSubtitle: 'Unint computació i biologia. 20+ publicacions, 300+ cites i 2 patents en descobriment de fàrmacs antimicrobians i enginyeria de proteïnes.',
      footerCopy: 'Tots els drets reservats.',
      viewAllScholar: 'Veure tot a Scholar',
    }
  }
};

export function t(lang: 'en' | 'es' | 'ca', key: string): string {
  const translation = translations[lang] || translations.en;
  const keys = key.split('.');
  let value: any = translation;

  for (const k of keys) {
    value = value?.[k];
  }

  return typeof value === 'string' ? value : key;
}

// Narrative content (Problem -> Approach -> Impact)
export const narrative = {
  problem: {
    en: { heading: 'The Problem', body: 'Drug-resistant infections and delivery inefficiencies slow translation. Traditional screening burns time and budget with low hit rates.' },
    es: { heading: 'El Problema', body: 'Las infecciones resistentes y las ineficiencias de entrega frenan la traslaci\u00f3n. El cribado tradicional consume tiempo y recursos con baja tasa de acierto.' },
    ca: { heading: 'El Problema', body: 'Les infeccions resistents i les inefici\u00e8ncies de lliurament frenen la translaci\u00f3. L\'screening tradicional consumeix temps i pressupost amb baixa taxa d\'encert.' }
  },
  approach: {
    en: { heading: 'My Approach', body: 'Integrate computational protein & vector design with rapid wet-lab validation to compress design cycles.' },
    es: { heading: 'Mi Enfoque', body: 'Integro dise\u00f1o computacional de prote\u00ednas y vectores con validaci\u00f3n experimental r\u00e1pida para comprimir ciclos.' },
    ca: { heading: 'El Meu Enfoc', body: 'Integro disseny computacional de prote\u00efnes i vectors amb validaci\u00f3 r\u00e0pida per comprimir cicles.' }
  },
  impact: {
    en: { heading: 'Impact', body: 'Higher quality candidates earlier, focusing experiments on functionally promising scaffolds and delivery vectors.' },
    es: { heading: 'Impacto', body: 'Candidatos de mayor calidad antes, enfocando experimentos en andamiajes y vectores prometedores.' },
    ca: { heading: 'Impacte', body: 'Candidats de m\u00e9s qualitat abans, enfocant experiments en bastides i vectors prometedors.' }
  }
};

// Timeline data (career / journey)
export const timelineData: Record<Lang, Array<{ year: string; title: string; line: string; detail: string }>> = {
  en: [
    { year: '2013', title: 'B.S. Biotechnology', line: 'UAB', detail: 'Foundation in molecular biology & biotech' },
    { year: '2015', title: 'M.S. Biomedical Engineering', line: 'UC Irvine', detail: 'Engineering for biological systems' },
    { year: '2020', title: 'Ph.D. Biomedicine', line: 'UAB', detail: 'Protein engineering specialization' },
    { year: '2021', title: 'Postdoc Researcher', line: 'CMRI Sydney', detail: 'Translational vectorology' },
    { year: 'Now', title: 'Fighting Resistance', line: 'Next-Gen Antimicrobials', detail: 'Computational + experimental loop' }
  ],
  es: [
    { year: '2013', title: 'Grado Biotecnolog\u00eda', line: 'UAB', detail: 'Base en biolog\u00eda molecular' },
    { year: '2015', title: 'M\u00e1ster Ing. Biom\u00e9dica', line: 'UC Irvine', detail: 'Ingenier\u00eda aplicada a sistemas biol\u00f3gicos' },
    { year: '2020', title: 'Doctorado Biomedicina', line: 'UAB', detail: 'Especializaci\u00f3n en ingenier\u00eda de prote\u00ednas' },
    { year: '2021', title: 'Investigador Postdoc', line: 'CMRI S\u00eddney', detail: 'Vectorolog\u00eda traslacional' },
    { year: 'Ahora', title: 'Resistencia a F\u00e1rmacos', line: 'Antimicrobianos', detail: 'Bucle computacional + experimental' }
  ],
  ca: [
    { year: '2013', title: 'Grau Biotecnologia', line: 'UAB', detail: 'Base en biologia molecular' },
    { year: '2015', title: 'M\u00e0ster Eng. Biom\u00e8dica', line: 'UC Irvine', detail: 'Enginyeria per a sistemes biol\u00f2gics' },
    { year: '2020', title: 'Doctorat Biomedicina', line: 'UAB', detail: 'Especialitzaci\u00f3 en enginyeria de prote\u00efnes' },
    { year: '2021', title: 'Investigador Postdoc', line: 'CMRI Sydney', detail: 'Vectorologia translacional' },
    { year: 'Ara', title: 'Resist\u00e8ncia F\u00e0rmacs', line: 'Antimicrobians', detail: 'Bucle computacional + experimental' }
  ]
};

// Timeline profile tagline
export const timelineTagline: Record<Lang,string> = {
  en: 'Computational \u2192 Experimental loop',
  es: 'Bucle computacional \u2192 experimental',
  ca: 'Bucle computacional \u2192 experimental'
};

// Impact strip metric labels
export const impactLabels = {
  publications: { en: 'Peer-reviewed papers', es: 'Art\u00edculos revisados', ca: 'Articles revisats' },
  citations: { en: 'Citations', es: 'Citas', ca: 'Cites' },
  hIndex: { en: 'h-index', es: '\u00cdndice h', ca: '\u00cdndex h' },
  speed: { en: 'Faster design-test loops', es: 'Ciclos dise\u00f1o-prueba m\u00e1s r\u00e1pidos', ca: 'Cicles disseny-prova m\u00e9s r\u00e0pids' },
  hitRate: { en: 'Assay hit-rate (bench)', es: 'Tasa de acierto en ensayos', ca: 'Taxa d\'encert en assaigs' }
} as const;

// About section data
export const aboutData: Record<Lang, { bio: string; focusIntro: string; areas: Array<{title: string; description: string}>; patent: string }> = {
  en: {
    bio: "I am a Research Officer at the Children's Medical Research Institute (CMRI) in Sydney's Translational Vectorology Unit, with a Ph.D. in Biomedicine, Molecular Biology and Biochemistry from the Autonomous University of Barcelona (2020) and a Master's in Biomedical Engineering from UC Irvine (2015).",
    focusIntro: 'My research focuses on developing next-generation antimicrobial solutions through protein engineering:',
    areas: [
      { title: 'Multidomain Antimicrobial Proteins', description: 'Designing recombinant proteins that combine multiple mechanisms to combat antibiotic-resistant pathogens' },
      { title: 'Antimicrobial Peptide-Phage Synergy', description: 'Exploring novel approaches using viral vectors and antimicrobial peptides as alternatives to conventional antibiotics' },
      { title: 'Functional Inclusion Bodies', description: 'Engineering protein aggregates and nanoclusters for biotechnological applications' }
    ],
    patent: 'peer-reviewed publications and a European patent on recombinant antimicrobial polypeptides, my work spans from molecular design to bench validation, addressing critical healthcare challenges in antimicrobial resistance.'
  },
  es: {
    bio: 'Soy Investigador en el Children\'s Medical Research Institute (CMRI) en la Unidad de Vectorología Translacional de Sídney, con un Doctorado en Biomedicina, Biología Molecular y Bioquímica por la Universitat Autònoma de Barcelona (2020) y un Máster en Ingeniería Biomédica por UC Irvine (2015).',
    focusIntro: 'Mi investigación se centra en desarrollar soluciones antimicrobianas de nueva generación mediante ingeniería de proteínas:',
    areas: [
      { title: 'Proteínas Antimicrobianas Multidominio', description: 'Diseño de proteínas recombinantes que combinan múltiples mecanismos para combatir patógenos resistentes a antibióticos' },
      { title: 'Sinergia Péptido Antimicrobiano-Fago', description: 'Exploración de enfoques novedosos usando vectores virales y péptidos antimicrobianos como alternativas a los antibióticos convencionales' },
      { title: 'Cuerpos de Inclusión Funcionales', description: 'Ingeniería de agregados proteicos y nanoclústeres para aplicaciones biotecnológicas' }
    ],
    patent: 'publicaciones revisadas por pares y una patente europea sobre polipéptidos antimicrobianos recombinantes, mi trabajo abarca desde el diseño molecular hasta la validación experimental, abordando desafíos críticos en resistencia antimicrobiana.'
  },
  ca: {
    bio: 'Sóc Investigador al Children\'s Medical Research Institute (CMRI) a la Unitat de Vectorologia Translacional de Sydney, amb un Doctorat en Biomedicina, Biologia Molecular i Bioquímica per la Universitat Autònoma de Barcelona (2020) i un Màster en Enginyeria Biomèdica per UC Irvine (2015).',
    focusIntro: 'La meva recerca se centra en desenvolupar solucions antimicrobianes de nova generació mitjançant enginyeria de proteïnes:',
    areas: [
      { title: 'Proteïnes Antimicrobianes Multidomini', description: 'Disseny de proteïnes recombinants que combinen múltiples mecanismes per combatre patògens resistents als antibiòtics' },
      { title: 'Sinergia Pèptid Antimicrobià-Fag', description: "Exploració d'enfocaments nous usant vectors virals i pèptids antimicrobians com a alternatives als antibiòtics convencionals" },
      { title: "Cossos d'Inclusió Funcionals", description: "Enginyeria d'agregats proteics i nanoclústers per a aplicacions biotecnològiques" }
    ],
    patent: 'publicacions revisades per parells i una patent europea sobre polipèptids antimicrobians recombinants, el meu treball abasta des del disseny molecular fins a la validació experimental, abordant desafiaments crítics en resistència antimicrobiana.'
  }
};

// Gemini theme timeline data
export const geminiTimeline: Record<Lang, Array<{ year: string; role: string; company: string; desc: string }>> = {
  en: [
    { year: '2021 – 2026', role: 'Research Officer', company: "Children's Medical Research Institute, Sydney", desc: 'Built and led a computational peptide discovery platform combining large-scale sequence analysis, protein language models, and GPU pipelines. Designed and experimentally validated over 100 antimicrobial peptide candidates.' },
    { year: '2016 – 2020', role: 'Pre-doctoral Researcher', company: 'UAB & IRTA, Barcelona', desc: 'Started a new antimicrobial peptide research line from scratch; designed broad-spectrum recombinant proteins, filed 2 patents and published 8 papers.' },
    { year: '2015 – 2016', role: 'Graduate Researcher', company: 'University of California, Irvine', desc: 'Tracked estrogen receptor dynamics in living cells using single-molecule fluorescence microscopy and quantitative image analysis.' },
  ],
  es: [
    { year: '2021 – 2026', role: 'Investigador', company: "Children's Medical Research Institute, Sídney", desc: 'Construí y lideré una plataforma computacional de descubrimiento de péptidos combinando análisis de secuencias a gran escala, modelos de lenguaje de proteínas y pipelines GPU. Diseñé y validé experimentalmente más de 100 candidatos de péptidos antimicrobianos.' },
    { year: '2016 – 2020', role: 'Investigador Predoctoral', company: 'UAB & IRTA, Barcelona', desc: 'Inicié una nueva línea de investigación de péptidos antimicrobianos desde cero; diseñé proteínas recombinantes de amplio espectro, registré 2 patentes y publiqué 8 artículos.' },
    { year: '2015 – 2016', role: 'Investigador de Máster', company: 'University of California, Irvine', desc: 'Seguimiento de la dinámica de receptores de estrógeno en células vivas mediante microscopía de fluorescencia de molécula única y análisis cuantitativo de imágenes.' },
  ],
  ca: [
    { year: '2021 – 2026', role: 'Investigador', company: "Children's Medical Research Institute, Sydney", desc: 'Vaig construir i liderar una plataforma computacional de descobriment de pèptids combinant anàlisi de seqüències a gran escala, models de llenguatge de proteïnes i pipelines GPU. Vaig dissenyar i validar experimentalment més de 100 candidats de pèptids antimicrobians.' },
    { year: '2016 – 2020', role: 'Investigador Predoctoral', company: 'UAB & IRTA, Barcelona', desc: 'Vaig iniciar una nova línia de recerca de pèptids antimicrobians des de zero; vaig dissenyar proteïnes recombinants d\'ampli espectre, vaig registrar 2 patents i vaig publicar 8 articles.' },
    { year: '2015 – 2016', role: 'Investigador de Màster', company: 'University of California, Irvine', desc: 'Seguiment de la dinàmica de receptors d\'estrogen en cèl·lules vives mitjançant microscòpia de fluorescència de molècula única i anàlisi quantitativa d\'imatges.' },
  ],
};
