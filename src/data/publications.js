// Dynamically fetch (at build time) the list of publications from ORCID so we
// always display the authoritative record instead of a manually-maintained
// placeholder array.

const ORCID_ID = '0000-0002-7393-6200';
const ORCID_WORKS_ENDPOINT = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

/**
 * Fetch the public works for the configured ORCID profile and transform them
 * into the structure expected by the site.
 *
 * Each returned object contains:
 *   { title: string, year: string, journal: string | undefined, featured: bool }
 */
async function fetchPublications() {
  const res = await fetch(ORCID_WORKS_ENDPOINT, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    console.error(`Failed to fetch ORCID works: ${res.status}`);
    return [];
  }

  const data = await res.json();

  if (!data.group) return [];

  const publications = [];

  for (const group of data.group) {
    // Each group may contain multiple summaries (e.g., different versions).
    // We take the first summary which is typically the most complete.
    const summary = group['work-summary'][0];

    const title = summary.title?.title?.value ?? 'Untitled';

    // ORCID stores the publication date as { year: { value: '2024' } }.
    let year = summary['publication-date']?.year?.value;
    if (!year && summary?.created_date?.value) {
      const d = new Date(summary.created_date.value);
      year = d.getUTCFullYear().toString();
    }

    const journal = summary['journal-title']?.value ?? undefined;

    publications.push({ title, year, journal });
  }

  // Sort descending by year (missing year goes last).
  publications.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  // Mark the three most recent works as featured to keep the homepage layout
  // visually similar to the original design.
  publications.forEach((pub, idx) => {
    pub.featured = idx < 3;
  });

  return publications;
}

export const publications = await fetchPublications();
