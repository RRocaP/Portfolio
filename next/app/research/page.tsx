import { BIO } from "@/lib/content";

export const metadata = { title: "Research — Ramon Roca‑Pinilla" };

export default function ResearchPage() {
  return (
    <section className="py-14 md:py-20 prose prose-neutral max-w-3xl">
      <h1>Research</h1>
      <p>{BIO.long}</p>
      <h2>Current role</h2>
      <p>
        <strong>Research Officer</strong>, Translational Vectorology Unit (TVU), Children’s Medical
        Research Institute (CMRI), Westmead, NSW, Australia.
      </p>
      <h2>Themes</h2>
      <ul>
        <li>Recombinant antimicrobial polypeptides and host‑defense peptides.</li>
        <li>Peptide–phage synergy as antibiotic alternatives.</li>
        <li>Vector engineering and biodistribution (e.g., AAV variants).</li>
      </ul>
      <h2>Methods</h2>
      <ul>
        <li>Transmission electron microscopy; microscopy workflows.</li>
        <li>Protein engineering; inclusion bodies; quantitative assays.</li>
        <li>Bioinformatics pipelines for RNA‑seq and vector analysis.</li>
      </ul>
    </section>
  );
}

