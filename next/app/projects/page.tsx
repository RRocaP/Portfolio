export const metadata = { title: "Projects — Ramon Roca‑Pinilla" };

const projects = [
  {
    name: "seq4hcc",
    blurb: "Scripts and workflows related to RNA‑seq and HCC analysis.",
    url: "https://github.com/RRocaP/seq4hcc",
  },
  {
    name: "Papers & Notebooks",
    blurb: "Reproducible notebooks for selected publications (when available).",
    url: "https://github.com/RRocaP",
  },
];

export default function Projects() {
  return (
    <section className="py-14 md:py-20">
      <h1 className="font-display text-3xl">Projects & Code</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <a key={p.name} href={p.url} target="_blank" className="no-underline">
            <article className="border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
              <h3 className="font-display text-lg">{p.name}</h3>
              <p className="mt-2 text-sm text-neutral-700">{p.blurb}</p>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}

