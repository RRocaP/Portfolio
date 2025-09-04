export function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10 text-sm text-neutral-600">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p>© {new Date().getFullYear()} Ramon Roca‑Pinilla. All rights reserved.</p>
          <p className="text-neutral-500">Built with Next.js · Accents inspired by the Senyera.</p>
        </div>
      </div>
    </footer>
  );
}

