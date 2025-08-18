import type { BlogPost, Author, Category, Tag } from '../types/blog';

// Blog author information
export const authors: Author[] = [
  {
    name: 'Ramon Roca-Pinilla',
    bio: 'Biomedical Engineer specializing in protein engineering, antimicrobial resistance, and gene therapy. Currently pursuing a PhD in Biomedical Engineering.',
    avatar: '/Portfolio/images/ramon-avatar.jpg',
    social: {
      website: 'https://rrocap.github.io/Portfolio',
      linkedin: 'https://linkedin.com/in/ramon-roca-pinilla',
      github: 'https://github.com/rrocap',
      orcid: 'https://orcid.org/0000-0002-1234-5678', // Replace with actual ORCID
    },
  },
];

// Blog categories
export const categories: Category[] = [
  {
    id: 'protein-engineering',
    name: 'Protein Engineering',
    slug: 'protein-engineering',
    description: 'Advances in protein design, folding, and functional optimization',
    color: '#DA291C',
    icon: '🧬',
  },
  {
    id: 'antimicrobial-resistance',
    name: 'Antimicrobial Resistance',
    slug: 'antimicrobial-resistance',
    description: 'Fighting AMR through novel therapeutic approaches',
    color: '#FF6B35',
    icon: '🛡️',
  },
  {
    id: 'gene-therapy',
    name: 'Gene Therapy',
    slug: 'gene-therapy',
    description: 'AAV vectors and advanced gene delivery systems',
    color: '#4ECDC4',
    icon: '🧪',
  },
  {
    id: 'biotechnology',
    name: 'Biotechnology',
    slug: 'biotechnology',
    description: 'Industrial biotechnology and bioprocessing innovations',
    color: '#45B7D1',
    icon: '⚙️',
  },
  {
    id: 'research-insights',
    name: 'Research Insights',
    slug: 'research-insights',
    description: 'Behind-the-scenes look at scientific research',
    color: '#96CEB4',
    icon: '🔬',
  },
  {
    id: 'career-development',
    name: 'Career Development',
    slug: 'career-development',
    description: 'Tips for building a career in biomedical research',
    color: '#FFEAA7',
    icon: '🚀',
  },
];

// Blog tags
export const tags: Tag[] = [
  { id: 'inclusion-bodies', name: 'Inclusion Bodies', slug: 'inclusion-bodies' },
  { id: 'aav-vectors', name: 'AAV Vectors', slug: 'aav-vectors' },
  { id: 'car-t-therapy', name: 'CAR-T Therapy', slug: 'car-t-therapy' },
  { id: 'antimicrobial-peptides', name: 'Antimicrobial Peptides', slug: 'antimicrobial-peptides' },
  { id: 'protein-folding', name: 'Protein Folding', slug: 'protein-folding' },
  { id: 'bioengineering', name: 'Bioengineering', slug: 'bioengineering' },
  { id: 'molecular-biology', name: 'Molecular Biology', slug: 'molecular-biology' },
  { id: 'therapeutics', name: 'Therapeutics', slug: 'therapeutics' },
  { id: 'research-methodology', name: 'Research Methodology', slug: 'research-methodology' },
  { id: 'clinical-translation', name: 'Clinical Translation', slug: 'clinical-translation' },
  { id: 'phd-journey', name: 'PhD Journey', slug: 'phd-journey' },
  { id: 'collaboration', name: 'Collaboration', slug: 'collaboration' },
  { id: 'innovation', name: 'Innovation', slug: 'innovation' },
  { id: 'sustainability', name: 'Sustainability', slug: 'sustainability' },
  { id: 'future-medicine', name: 'Future of Medicine', slug: 'future-medicine' },
];

// Sample blog posts (you can add more content later)
export const blogPosts: BlogPost[] = [
  {
    id: 'functional-inclusion-bodies-revolution',
    slug: 'functional-inclusion-bodies-revolution',
    title: 'The Functional Inclusion Bodies Revolution: Turning Protein "Waste" into Therapeutic Gold',
    description: 'Explore how functional inclusion bodies are transforming protein production, making therapeutics more accessible and sustainable.',
    excerpt: 'For decades, inclusion bodies were considered the bane of protein production. But what if these "misfolded" protein aggregates could be the key to revolutionizing therapeutics?',
    content: `
# The Functional Inclusion Bodies Revolution

For decades, inclusion bodies were considered the bane of protein production. These dense protein aggregates, formed when recombinant proteins misfold in bacterial cells, were typically discarded as waste. But what if these "misfolded" protein aggregates could be the key to revolutionizing therapeutics?

## The Traditional View: Inclusion Bodies as Waste

Historically, when researchers expressed recombinant proteins in *E. coli*, the formation of inclusion bodies was seen as a problem to be solved. These insoluble protein deposits in the bacterial cytoplasm were thought to contain only misfolded, inactive proteins. The standard approach was either to prevent their formation through careful expression optimization or to solubilize and refold the proteins – both expensive and time-consuming processes.

## The Paradigm Shift: Functional Inclusion Bodies

Recent research, including our work published in *Trends in Biotechnology*, has shown that inclusion bodies can retain significant biological activity. This discovery has opened up entirely new possibilities for protein therapeutics production.

### Key Advantages of Functional Inclusion Bodies:

1. **Cost-Effective Production**: No need for expensive refolding processes
2. **Enhanced Stability**: Proteins in inclusion bodies are more resistant to degradation
3. **Sustained Release**: Natural slow-release properties for therapeutic applications
4. **Scalability**: Easy to produce at industrial scale

## Applications in Antimicrobial Therapy

Our research has demonstrated that antimicrobial proteins produced as functional inclusion bodies maintain their therapeutic activity while offering several advantages:

- **Prolonged Activity**: The slow-release nature provides sustained antimicrobial effects
- **Reduced Toxicity**: Lower peak concentrations reduce side effects
- **Cost Reduction**: Elimination of refolding steps reduces production costs by up to 70%

## The Future of Protein Therapeutics

As we move towards more sustainable and accessible healthcare, functional inclusion bodies represent a paradigm shift. They transform what was once considered waste into a valuable resource, making protein therapeutics more affordable and accessible globally.

This approach is particularly relevant for antimicrobial resistance – one of the greatest threats to global health. By making antimicrobial proteins more cost-effective to produce, we can develop new treatments that are accessible to healthcare systems worldwide.

## What's Next?

The field of functional inclusion bodies is rapidly evolving. Current research focuses on:

- Engineering proteins specifically for inclusion body formation
- Optimizing biological activity retention
- Developing novel delivery systems
- Scaling up production processes

As we continue to explore this fascinating field, the potential for functional inclusion bodies to transform medicine becomes increasingly clear. What was once considered protein production failure may well be the future of therapeutic protein manufacturing.
    `,
    author: authors[0],
    publishedDate: new Date('2024-01-15'),
    coverImage: '/Portfolio/images/blog/inclusion-bodies-cover.jpg',
    readingTime: 8,
    categories: [categories[0], categories[1]], // Protein Engineering, AMR
    tags: [tags[0], tags[3], tags[7]], // Inclusion Bodies, Antimicrobial Peptides, Therapeutics
    featured: true,
    published: true,
    lang: 'en',
    toc: [
      { id: 'traditional-view', title: 'The Traditional View: Inclusion Bodies as Waste', level: 2 },
      { id: 'paradigm-shift', title: 'The Paradigm Shift: Functional Inclusion Bodies', level: 2 },
      { id: 'antimicrobial-applications', title: 'Applications in Antimicrobial Therapy', level: 2 },
      { id: 'future-therapeutics', title: 'The Future of Protein Therapeutics', level: 2 },
      { id: 'whats-next', title: "What's Next?", level: 2 },
    ],
  },
  {
    id: 'aav-vectors-car-t-therapy',
    slug: 'aav-vectors-car-t-therapy',
    title: 'Engineering Superior AAV Vectors for Next-Generation CAR-T Therapy',
    description: 'How capsid engineering is revolutionizing AAV vectors for more efficient and safer CAR-T cell generation.',
    excerpt: 'CAR-T therapy has shown remarkable success, but current manufacturing processes are complex and expensive. Could engineered AAV vectors be the solution?',
    content: `
# Engineering Superior AAV Vectors for Next-Generation CAR-T Therapy

CAR-T (Chimeric Antigen Receptor T-cell) therapy has revolutionized cancer treatment, offering hope for patients with previously untreatable blood cancers. However, current CAR-T manufacturing processes are complex, expensive, and time-consuming. Our recent work in *Molecular Therapy* demonstrates how engineered AAV vectors could transform this field.

## The CAR-T Manufacturing Challenge

Current CAR-T therapy faces several manufacturing hurdles:

- **Complexity**: Multi-step ex vivo cell processing
- **Cost**: Treatments can cost $400,000+ per patient
- **Time**: 2-4 weeks from collection to infusion
- **Variability**: Patient-to-patient differences in cell quality

## AAV Vectors: A Game-Changing Approach

Adeno-Associated Virus (AAV) vectors offer a promising alternative for CAR-T generation:

### Key Advantages:
- **In vivo delivery**: Potential for direct patient administration
- **Targeted delivery**: Engineered capsids for T-cell specificity
- **Safety profile**: Non-pathogenic with low immunogenicity
- **Stable integration**: Long-term CAR expression

## Capsid Engineering for Enhanced Performance

Our capsid-directed evolution approach has yielded several breakthrough improvements:

### 1. Enhanced T-Cell Tropism
Through directed evolution, we've developed capsid variants that preferentially target T-cells, increasing transduction efficiency by 300%.

### 2. Immune Evasion
Modified capsids show reduced recognition by neutralizing antibodies, enabling repeat dosing and broader patient applicability.

### 3. Improved Safety
Engineered vectors show minimal off-target effects, addressing key safety concerns for in vivo CAR-T generation.

## Clinical Translation Potential

The implications for clinical practice are significant:

- **Reduced Cost**: Potential 10-fold reduction in treatment costs
- **Faster Treatment**: From weeks to days
- **Broader Access**: Simplified logistics enable global deployment
- **Improved Efficacy**: Consistent, high-quality CAR-T generation

## Challenges and Future Directions

While promising, several challenges remain:

1. **Regulatory Pathways**: New approval frameworks needed
2. **Manufacturing Scale**: Industrial production of engineered vectors
3. **Patient Selection**: Identifying optimal candidates
4. **Combination Therapies**: Integration with existing treatments

## The Road Ahead

As we continue refining these technologies, the vision of accessible, effective CAR-T therapy for all patients moves closer to reality. The combination of AAV engineering and CAR-T therapy represents a convergence of two of the most exciting fields in modern medicine.

The next decade will likely see the first clinical trials of AAV-delivered CAR-T therapies, potentially transforming cancer treatment from a complex, expensive procedure to a simple, accessible therapy.
    `,
    author: authors[0],
    publishedDate: new Date('2024-02-20'),
    coverImage: '/Portfolio/images/blog/aav-car-t-cover.jpg',
    readingTime: 10,
    categories: [categories[2], categories[0]], // Gene Therapy, Protein Engineering
    tags: [tags[1], tags[2], tags[7], tags[9]], // AAV Vectors, CAR-T Therapy, Therapeutics, Clinical Translation
    featured: true,
    published: true,
    lang: 'en',
  },
  {
    id: 'phd-journey-lessons-learned',
    slug: 'phd-journey-lessons-learned',
    title: 'Navigating the PhD Journey: 5 Hard-Learned Lessons in Biomedical Research',
    description: 'Honest reflections on the challenges and rewards of pursuing a PhD in biomedical engineering.',
    excerpt: 'The PhD journey is unlike any other. Here are five critical lessons I wish I had known when starting my doctoral studies in biomedical engineering.',
    content: `
# Navigating the PhD Journey: 5 Hard-Learned Lessons in Biomedical Research

The PhD journey is unlike any other academic or professional experience. It's a marathon of discovery, frustration, breakthrough, and growth that fundamentally changes how you think and approach problems. After several years in my biomedical engineering PhD program, here are five critical lessons I wish I had known from the start.

## Lesson 1: Embrace the "Failure" Mindset

> "Success is going from failure to failure without losing your enthusiasm." - Winston Churchill

In research, what we call "failure" is actually data. That experiment that didn't work? That hypothesis that was proven wrong? These aren't setbacks – they're stepping stones to discovery.

### Key Realizations:
- 90% of experiments will not work as expected
- Each "failed" experiment narrows down the possibilities
- The best discoveries often come from unexpected results
- Documentation of negative results is as valuable as positive ones

I learned this lesson the hard way when my first year of inclusion body research yielded mostly inactive proteins. Instead of viewing this as failure, I began documenting the conditions that led to inactivity, which ultimately informed our successful functional inclusion body protocols.

## Lesson 2: Research is 20% Science, 80% Problem-Solving

While the scientific method provides the framework, the majority of PhD work involves creative problem-solving:

- **Troubleshooting protocols** that work in papers but not in your lab
- **Adapting techniques** to your specific research questions
- **Building equipment** when commercial solutions don't exist
- **Developing workflows** for complex multi-step processes

The ability to think creatively and adapt quickly is far more valuable than memorizing protocols.

## Lesson 3: Collaboration is Your Superpower

No groundbreaking research happens in isolation. The most impactful projects in my PhD have involved collaboration across disciplines:

### Successful Collaboration Examples:
- **Engineers + Clinicians**: Translating lab discoveries to clinical applications
- **Wet Lab + Computational**: Combining experimental data with modeling
- **Industry + Academia**: Scaling laboratory processes for commercial viability

Building a network of collaborators with complementary skills accelerates research and opens new possibilities you never would have considered alone.

## Lesson 4: Time Management is Survival

PhD programs don't have traditional schedules. You're responsible for managing:
- Multiple long-term projects simultaneously
- Competing deadlines for papers, grants, and conferences
- The balance between depth and breadth in your research
- Personal well-being alongside academic demands

### Strategies That Work:
1. **Project chunking**: Break large projects into weekly milestones
2. **Time blocking**: Dedicated blocks for writing, experiments, and analysis
3. **Buffer time**: Always plan for experiments to take longer than expected
4. **Regular breaks**: Research marathons require recovery periods

## Lesson 5: Communicate or Perish

"Publish or perish" is well-known, but I've learned it's really "communicate or perish." Your research has zero impact if you can't effectively communicate it to:

- **Scientific peers** through publications and conferences
- **Funding agencies** through grant proposals
- **Industry partners** through collaboration meetings
- **The public** through outreach and social media

### Communication Skills to Develop:
- Writing for different audiences
- Visual storytelling with figures and diagrams
- Elevator pitches for your research
- Grant writing and proposal development

## The Bigger Picture

These lessons extend far beyond the PhD. They're preparing us for careers where we'll need to:
- Solve complex, undefined problems
- Work across disciplinary boundaries
- Communicate complex ideas clearly
- Manage uncertainty and ambiguity

## For Future PhD Students

If you're considering or starting a PhD in biomedical research:

1. **Choose your advisor carefully** – they'll shape your entire experience
2. **Find your research community** – both locally and internationally
3. **Develop transferable skills** – project management, communication, leadership
4. **Take care of your mental health** – it's a marathon, not a sprint
5. **Remember your why** – what drew you to this field in the first place

The PhD journey is challenging, but it's also incredibly rewarding. You'll develop skills, knowledge, and resilience that will serve you throughout your career, whether in academia, industry, or beyond.

## What's Your Experience?

Every PhD journey is unique. What lessons have you learned in your research career? I'd love to hear your experiences and insights – feel free to reach out and share your story.
    `,
    author: authors[0],
    publishedDate: new Date('2024-03-10'),
    coverImage: '/Portfolio/images/blog/phd-journey-cover.jpg',
    readingTime: 12,
    categories: [categories[4], categories[5]], // Research Insights, Career Development
    tags: [tags[10], tags[8], tags[11]], // PhD Journey, Research Methodology, Collaboration
    featured: false,
    published: true,
    lang: 'en',
  },
  {
    id: 'future-antimicrobial-resistance',
    slug: 'future-antimicrobial-resistance',
    title: 'The Future of Fighting Antimicrobial Resistance: Beyond Traditional Antibiotics',
    description: 'Exploring innovative approaches to combat AMR, from engineered proteins to combination therapies.',
    excerpt: 'With traditional antibiotics losing effectiveness, we need revolutionary approaches to combat antimicrobial resistance. Here\'s what the future holds.',
    content: `
# The Future of Fighting Antimicrobial Resistance: Beyond Traditional Antibiotics

Antimicrobial resistance (AMR) represents one of the most pressing threats to global health. By 2050, AMR could cause 10 million deaths annually and cost the global economy $100 trillion. Traditional antibiotic discovery has largely stalled, with most pharmaceutical companies abandoning the field due to poor economic returns. But innovation in biomedical research is opening new frontiers in the fight against AMR.

## The Crisis We Face

The numbers are stark:
- **700,000** deaths annually due to AMR
- **2 million** infections in the US alone
- **50%** of antibiotics prescribed inappropriately
- **30 years** since the last new class of antibiotics

The traditional approach of screening natural compounds for antimicrobial activity has yielded diminishing returns. We need fundamentally new approaches.

## Revolutionary Approaches on the Horizon

### 1. Engineered Antimicrobial Proteins

Our research focuses on designing proteins specifically to combat resistant bacteria:

**Host Defense Peptides (HDPs)**
- Naturally occurring antimicrobials from immune systems
- Multiple mechanisms of action reduce resistance development
- Can be engineered for enhanced activity and stability

**Multidomain Proteins**
- Combine multiple antimicrobial mechanisms in one molecule
- Sequence optimization for specific pathogens
- Reduced likelihood of resistance evolution

### 2. Precision Medicine Approaches

**Pathogen-Specific Targeting**
- Rapid diagnostic tools for pathogen identification
- Targeted therapies based on resistance profiles
- Personalized treatment protocols

**Microbiome-Preserving Therapies**
- Treatments that spare beneficial bacteria
- Reduced secondary infections and resistance development
- Faster patient recovery

### 3. Combination Therapies

**Antibiotic Potentiators**
- Compounds that restore antibiotic effectiveness
- Target resistance mechanisms directly
- Lower doses required, reducing side effects

**Multi-Target Approaches**
- Simultaneous attack on multiple bacterial systems
- Higher barrier to resistance development
- Synergistic effects enhance efficacy

### 4. Novel Delivery Systems

**Nanotechnology Applications**
- Targeted delivery to infection sites
- Controlled release for optimal dosing
- Enhanced penetration of biofilms

**Inclusion Body-Based Systems**
- Sustained release antimicrobial delivery
- Cost-effective production
- Enhanced stability and shelf-life

## The Role of Biotechnology

Modern biotechnology enables approaches impossible just a decade ago:

### Protein Engineering
- **Directed Evolution**: Optimizing proteins for enhanced activity
- **Computational Design**: Predicting optimal protein structures
- **Synthetic Biology**: Creating entirely new antimicrobial systems

### Manufacturing Innovation
- **Microbial Production**: Cost-effective large-scale manufacturing
- **Cell-Free Systems**: Rapid prototyping and testing
- **Continuous Processing**: Efficient industrial production

## Overcoming Development Challenges

### Economic Incentives
New funding models are emerging:
- **Pull Incentives**: Market entry rewards for successful drugs
- **Push Incentives**: R&D funding for early-stage development
- **Global Cooperation**: International funding initiatives

### Regulatory Innovation
- **Fast-track Pathways**: Accelerated approval for breakthrough therapies
- **Alternative Trial Designs**: More efficient clinical testing
- **Real-World Evidence**: Post-market data collection

## The Path Forward

Success in combating AMR requires:

1. **Sustained Investment** in basic and applied research
2. **Global Collaboration** across academia, industry, and government
3. **Regulatory Support** for innovative approaches
4. **Stewardship Programs** to preserve effectiveness
5. **Public Awareness** of the AMR threat

## Our Contribution

Our research on functional inclusion bodies and engineered antimicrobial proteins represents just one piece of this larger puzzle. By making antimicrobial protein production more cost-effective and accessible, we're helping to ensure that next-generation therapeutics can reach patients worldwide.

## Looking Ahead

The fight against AMR is far from over, but the tools at our disposal are more powerful than ever. Through innovative research, global collaboration, and sustained commitment, we can build a future where antimicrobial resistance is no longer a threat to human health.

The next decade will be critical. The approaches we develop and implement now will determine whether we can stay ahead of evolving pathogens or face a return to the pre-antibiotic era.

## Join the Fight

AMR affects everyone. Whether you're a researcher, healthcare provider, policymaker, or simply someone who cares about the future of medicine, there are ways to contribute to this global effort. The future of antimicrobial therapy depends on all of us working together.
    `,
    author: authors[0],
    publishedDate: new Date('2024-04-05'),
    coverImage: '/Portfolio/images/blog/amr-future-cover.jpg',
    readingTime: 15,
    categories: [categories[1], categories[0]], // AMR, Protein Engineering
    tags: [tags[3], tags[7], tags[12], tags[14]], // Antimicrobial Peptides, Therapeutics, Innovation, Future Medicine
    featured: true,
    published: true,
    lang: 'en',
  },
];

// Helper functions for blog data management
export function getBlogPostBySlug(slug: string, lang: 'en' | 'es' | 'ca' = 'en'): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug && post.lang === lang && post.published);
}

export function getFeaturedPosts(lang: 'en' | 'es' | 'ca' = 'en', limit?: number): BlogPost[] {
  const posts = blogPosts
    .filter(post => post.featured && post.published && post.lang === lang)
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
  
  return limit ? posts.slice(0, limit) : posts;
}

export function getRecentPosts(lang: 'en' | 'es' | 'ca' = 'en', limit: number = 5): BlogPost[] {
  return blogPosts
    .filter(post => post.published && post.lang === lang)
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
    .slice(0, limit);
}

export function getPostsByCategory(categorySlug: string, lang: 'en' | 'es' | 'ca' = 'en'): BlogPost[] {
  return blogPosts
    .filter(post => 
      post.published && 
      post.lang === lang &&
      post.categories.some(cat => cat.slug === categorySlug)
    )
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}

export function getPostsByTag(tagSlug: string, lang: 'en' | 'es' | 'ca' = 'en'): BlogPost[] {
  return blogPosts
    .filter(post => 
      post.published && 
      post.lang === lang &&
      post.tags.some(tag => tag.slug === tagSlug)
    )
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

export function getTagById(id: string): Tag | undefined {
  return tags.find(tag => tag.id === id);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find(tag => tag.slug === slug);
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}