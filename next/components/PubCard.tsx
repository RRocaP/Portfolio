type Pub = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi?: string;
  url?: string;
};

export function PubCard({ pub }: { pub: Pub }) {
  return (
    <article className="group border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
      <h3 className="font-display text-lg leading-snug">
        <a className="no-underline hover:underline" href={pub.url ?? "#"} target="_blank">
          {pub.title}
        </a>
      </h3>
      <p className="mt-2 text-sm text-neutral-700">{pub.authors}</p>
      <p className="mt-1 text-sm text-neutral-500">
        {pub.venue} · {pub.year}
      </p>
      {pub.doi && (
        <p className="mt-2 text-xs">
          DOI: <a className="underline" href={`https://doi.org/${pub.doi}`} target="_blank">{pub.doi}</a>
        </p>
      )}
    </article>
  );
}

