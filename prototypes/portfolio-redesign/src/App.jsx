import React from 'react';
import SkipToContent from './components/SkipToContent';
import Navbar from './components/Navbar';
import LinkChip from './components/LinkChip';
import FocusCard from './components/FocusCard';
import ProjectCard from './components/ProjectCard';
import PubItem from './components/PubItem';
import { EXTERNAL_LINKS } from './constants';

function App() {
  const projects = [
    {
      title: 'Protein Mapper',
      tag: 'bio/AI',
      desc: 'A tool for mapping protein interactions using deep learning.',
    },
    {
      title: 'Capsid Linker Designer',
      tag: 'gene therapy',
      desc: 'Design and evaluate linkers for AAV capsid insertions.',
    },
    {
      title: 'Translational Assay Suite',
      tag: 'translational',
      desc: 'In vivo antimicrobial peptide efficacy assay workflows.',
    },
    {
      title: 'Lab Automation Toolkit',
      tag: 'software',
      desc: 'Fiji and Python pipelines for high-throughput imaging.',
    },
  ];
  const publications = [
    { title: 'Antimicrobial Peptide Study', venue: 'Nature Biotech', year: 2022 },
    { title: 'AI-driven Protein Design', venue: 'Science Advances', year: 2023 },
    { title: 'AAV Linker Engineering', venue: 'Mol Ther', year: 2024 },
  ];

  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main" className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Protein engineering, antimicrobial peptides, and sharp tools.
          </h1>
          <p className="text-lg text-neutral-300 mb-4 max-w-prose">
            I develop computational and experimental methods at the interface of
            molecular biology and artificial intelligence.
          </p>
          <div className="flex flex-wrap gap-2">
            <LinkChip type="scholar" href={EXTERNAL_LINKS.scholar} label="Scholar" />
            <LinkChip type="orcid" href={EXTERNAL_LINKS.orcid} label="ORCID" />
            <LinkChip type="github" href={EXTERNAL_LINKS.github} label="GitHub" />
            <LinkChip type="linkedin" href={EXTERNAL_LINKS.linkedin} label="LinkedIn" />
            <LinkChip type="music" href={EXTERNAL_LINKS.music} label=" Music" />
          </div>
        </section>

        {/* Current Focus */}
        <FocusCard />

        {/* Selected Work */}
        <section id="work" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Selected work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.title} title={p.title} tag={p.tag}>
                {p.desc}
              </ProjectCard>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Selected publications</h2>
          <ul className="list-none pl-0">
            {publications.map((pub) => (
              <PubItem
                key={pub.title}
                title={pub.title}
                venue={pub.venue}
                year={pub.year}
              />
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">Contact</h2>
          <p className="text-base text-neutral-300">
            Email preferred; DMs on GitHub.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-4">
        <div className="max-w-6xl mx-auto px-4 text-sm text-neutral-500 text-center">
          © {new Date().getFullYear()} Ramon · Made with React · Tailwind
        </div>
      </footer>
    </>
  );
}

export default App;
