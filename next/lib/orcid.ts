export async function fetchOrcidWorks(orcid: string) {
  // Public, no-token attempt. Many fields are public; if not, returns minimal data.
  const url = `https://pub.orcid.org/v3.0/${orcid}/works`;
  const res = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

/** Map ORCID 'works' (if available) to our PubCard shape. Keep defensive. */
export function mapOrcidToPubs(json: any) {
  try {
    const groups = json.group ?? [];
    return groups.slice(0, 12).map((g: any) => {
      const summary = g["work-summary"]?.[0];
      const title = summary?.title?.title?.value ?? "Untitled";
      const year = summary?.["publication-date"]?.year?.value ?? "";
      const doi = summary?.externalIds?.["external-id"]?.find((e: any) => e["external-id-type"] === "doi")?.["external-id-value"];
      const url = summary?.url?.value;
      const journal = summary?.journalTitle?.value ?? summary?.type ?? "Work";
      return {
        title,
        authors: "See record",
        venue: journal,
        year: String(year),
        doi,
        url,
      };
    });
  } catch {
    return [];
  }
}

