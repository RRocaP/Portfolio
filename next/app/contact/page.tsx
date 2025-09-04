export const metadata = { title: "Contact — Ramon Roca‑Pinilla" };

export default function ContactPage() {
  return (
    <section className="py-14 md:py-20">
      <h1 className="font-display text-3xl">Contact</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border border-neutral-200 rounded-lg p-5">
          <p>
            <strong>Email:</strong> rroca-pinilla@cmri.org.au
          </p>
          <p>
            <strong>Phone:</strong> +61 (0) 421 485 997
          </p>
          <p>
            <strong>LinkedIn:</strong> @ramonrocapinilla
          </p>
          <p>
            <strong>Address:</strong> 214 Hawkesbury Rd, Westmead NSW 2145, Australia
          </p>
        </div>
        <div className="border border-neutral-200 rounded-lg p-5">
          <p className="text-neutral-700">For collaborations in antimicrobial proteins, phage synergy, or vectorology, include:</p>
          <ul className="list-disc ml-5 mt-2 text-neutral-700">
            <li>1–3 sentences on the question</li>
            <li>Links to any datasets/protocols</li>
            <li>Desired timelines</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

