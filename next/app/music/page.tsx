export const metadata = { title: "Music — Ramon Roca‑Pinilla" };

export default function MusicPage() {
  return (
    <section className="py-14 md:py-20">
      <h1 className="font-display text-3xl">Music</h1>
      <p className="mt-2 text-neutral-600">“Cartographers’ Daughter” — single.</p>
      <div className="mt-6 aspect-video w-full max-w-3xl">
        <iframe
          title="Cartographers’ Daughter — Apple Music"
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          height="450"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src="https://embed.music.apple.com/au/album/cartographers-daughter-single/1797174494"
          className="w-full h-full border border-neutral-200 rounded"
        />
      </div>
    </section>
  );
}

