import Link from "next/link";
import { BIO, FUNDING_LUMP, SELECTED_PUBS } from "@/lib/content";
import { PubCard } from "@/components/PubCard";

export default function HomePage() {
  return (
    <section className="py-14 md:py-20">
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-neutral-500">
          <span className="h-2 w-2 rounded-full bg-accent-yellow" /> Research Officer · TVU @ CMRI
        </span>
        <h1 className="mt-3 font-display text-4xl md:text-6xl tracking-tight">
          Ramon Roca‑Pinilla, <span className="text-accent-red">PhD</span>
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-700">{BIO.short}</p>
        <p className="mt-2 text-sm text-neutral-500">Scholarships & grants: {FUNDING_LUMP}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/publications" className="px-4 py-2 rounded border border-neutral-200 hover:border-accent-red no-underline">
            Publications
          </Link>
          <Link href="/projects" className="px-4 py-2 rounded border border-neutral-200 hover:border-accent-red no-underline">
            Projects
          </Link>
          <Link href="/contact" className="px-4 py-2 rounded bg-black text-white hover:bg-accent-red no-underline">
            Contact
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl">Selected work</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {SELECTED_PUBS.slice(0, 4).map((p) => (
            <PubCard key={p.title} pub={p} />
          ))}
        </div>
        <div className="mt-6">
          <a className="underline" href="https://scholar.google.com/citations?user=jYIZGT0AAAAJ" target="_blank">
            View all on Google Scholar
          </a>
        </div>
      </div>
    </section>
  );
}

