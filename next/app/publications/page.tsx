import { fetchOrcidWorks, mapOrcidToPubs } from "@/lib/orcid";
import { SELECTED_PUBS } from "@/lib/content";
import { PubCard } from "@/components/PubCard";

export const metadata = { title: "Publications — Ramon Roca‑Pinilla" };

export default async function PublicationsPage() {
  const orcidJson = await fetchOrcidWorks("0000-0002-7393-6200");
  const orcidPubs = orcidJson ? mapOrcidToPubs(orcidJson) : [];
  const pubs = (orcidPubs.length ? orcidPubs : SELECTED_PUBS).slice(0, 12);

  return (
    <section className="py-14 md:py-20">
      <h1 className="font-display text-3xl">Publications</h1>
      <p className="mt-2 text-neutral-600">Curated selection below. For the full list, see Google Scholar.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {pubs.map((p: any) => (
          <PubCard key={p.title + p.year} pub={p} />
        ))}
      </div>
      <div className="mt-6">
        <a className="underline" href="https://scholar.google.com/citations?user=jYIZGT0AAAAJ" target="_blank">
          View all on Google Scholar
        </a>
      </div>
    </section>
  );
}

