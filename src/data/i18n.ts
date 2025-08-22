export type Lang = 'en' | 'es' | 'ca';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About', 
      research: 'Research',
      publications: 'Publications',
      contact: 'Contact'
    },
    hero: {
      title: 'Ramon Roca Pinilla',
      subtitle: 'Biomedical Engineer • Molecular Biologist',
      tagline: 'Engineering proteins to combat antimicrobial resistance through computational design and experimental validation.'
    },
    sections: {
      selectedPublications: 'Selected Publications',
      aboutMe: 'About',
      researchAreas: 'Research Areas'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      about: 'Sobre mí',
      research: 'Investigación', 
      publications: 'Publicaciones',
      contact: 'Contacto'
    },
    hero: {
      title: 'Ramon Roca Pinilla',
      subtitle: 'Ingeniero Biomédico • Biólogo Molecular',
      tagline: 'Diseñando proteínas para combatir la resistencia antimicrobiana mediante diseño computacional y validación experimental.'
    },
    sections: {
      selectedPublications: 'Publicaciones Seleccionadas',
      aboutMe: 'Sobre mí',
      researchAreas: 'Áreas de Investigación'
    }
  },
  ca: {
    nav: {
      home: 'Inici',
      about: 'Sobre mi',
      research: 'Recerca',
      publications: 'Publicacions', 
      contact: 'Contacte'
    },
    hero: {
      title: 'Ramon Roca Pinilla',
      subtitle: 'Enginyer Biomèdic • Biòleg Molecular',
      tagline: 'Dissenyant proteïnes per combatre la resistència antimicrobiana mitjançant disseny computacional i validació experimental.'
    },
    sections: {
      selectedPublications: 'Publicacions Seleccionades',
      aboutMe: 'Sobre mi',
      researchAreas: 'Àrees de Recerca'
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

// Narrative content (Problem → Approach → Impact)
export const narrative = {
  problem: {
    en: { heading: 'The Problem', body: 'Drug‑resistant infections and delivery inefficiencies slow translation. Traditional screening burns time and budget with low hit rates.' },
    es: { heading: 'El Problema', body: 'Las infecciones resistentes y las ineficiencias de entrega frenan la traslación. El cribado tradicional consume tiempo y recursos con baja tasa de acierto.' },
    ca: { heading: 'El Problema', body: 'Les infeccions resistents i les ineficiències de lliurament frenen la translació. L\'screening tradicional consumeix temps i pressupost amb baixa taxa d\'encert.' }
  },
  approach: {
    en: { heading: 'My Approach', body: 'Integrate computational protein & vector design with rapid wet‑lab validation to compress design cycles.' },
    es: { heading: 'Mi Enfoque', body: 'Integro diseño computacional de proteínas y vectores con validación experimental rápida para comprimir ciclos.' },
    ca: { heading: 'El Meu Enfoc', body: 'Integro disseny computacional de proteïnes i vectors amb validació ràpida per comprimir cicles.' }
  },
  impact: {
    en: { heading: 'Impact', body: 'Higher quality candidates earlier, focusing experiments on functionally promising scaffolds and delivery vectors.' },
    es: { heading: 'Impacto', body: 'Candidatos de mayor calidad antes, enfocando experimentos en andamiajes y vectores prometedores.' },
    ca: { heading: 'Impacte', body: 'Candidats de més qualitat abans, enfocant experiments en bastides i vectors prometedors.' }
  }
};

// Timeline data (career / journey)
export const timelineData: Record<Lang, Array<{ year: string; title: string; line: string; detail: string }>> = {
  en: [
    { year: '2013', title: 'B.S. Biotechnology', line: 'UAB', detail: 'Foundation in molecular biology & biotech' },
    { year: '2015', title: 'M.S. Biomedical Engineering', line: 'UC Irvine', detail: 'Engineering for biological systems' },
    { year: '2020', title: 'Ph.D. Biomedicine', line: 'UAB', detail: 'Protein engineering specialization' },
    { year: '2021', title: 'Postdoc Researcher', line: 'CMRI Sydney', detail: 'Translational vectorology' },
    { year: 'Now', title: 'Fighting Resistance', line: 'Next‑Gen Antimicrobials', detail: 'Computational + experimental loop' }
  ],
  es: [
    { year: '2013', title: 'Grado Biotecnología', line: 'UAB', detail: 'Base en biología molecular' },
    { year: '2015', title: 'Máster Ing. Biomédica', line: 'UC Irvine', detail: 'Ingeniería aplicada a sistemas biológicos' },
    { year: '2020', title: 'Doctorado Biomedicina', line: 'UAB', detail: 'Especialización en ingeniería de proteínas' },
    { year: '2021', title: 'Investigador Postdoc', line: 'CMRI Sídney', detail: 'Vectorología traslacional' },
    { year: 'Ahora', title: 'Resistencia a Fármacos', line: 'Antimicrobianos', detail: 'Bucle computacional + experimental' }
  ],
  ca: [
    { year: '2013', title: 'Grau Biotecnologia', line: 'UAB', detail: 'Base en biologia molecular' },
    { year: '2015', title: 'Màster Eng. Biomèdica', line: 'UC Irvine', detail: 'Enginyeria per a sistemes biològics' },
    { year: '2020', title: 'Doctorat Biomedicina', line: 'UAB', detail: 'Especialització en enginyeria de proteïnes' },
    { year: '2021', title: 'Investigador Postdoc', line: 'CMRI Sydney', detail: 'Vectorologia translacional' },
    { year: 'Ara', title: 'Resistència Fàrmacs', line: 'Antimicrobians', detail: 'Bucle computacional + experimental' }
  ]
};

// Timeline profile tagline
export const timelineTagline: Record<Lang,string> = {
  en: 'Computational → Experimental loop',
  es: 'Bucle computacional → experimental',
  ca: 'Bucle computacional → experimental'
};

// Impact strip metric labels
export const impactLabels = {
  publications: { en: 'Peer‑reviewed papers', es: 'Artículos revisados', ca: 'Articles revisats' },
  citations: { en: 'Citations', es: 'Citas', ca: 'Cites' },
  speed: { en: 'Faster design–test loops', es: 'Ciclos diseño‑prueba más rápidos', ca: 'Cicles disseny‑prova més ràpids' },
  hitRate: { en: 'Assay hit‑rate (bench)', es: 'Tasa de acierto en ensayos', ca: 'Taxa d\'encert en assaigs' }
} as const;
