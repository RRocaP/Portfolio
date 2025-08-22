import React from 'react';

const NAV_ITEMS = [
  { label: 'Work', href: '#work' },
  { label: 'Publications', href: '#publications' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => (
  <nav className="sticky top-0 backdrop-blur bg-neutral-900 bg-opacity-50 z-40">
    <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
      <div className="text-white font-semibold">Ramon · Molecular Biology & AI</div>
      <ul className="flex space-x-6">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="text-neutral-200 hover:text-white focus:outline-none focus:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

export default Navbar;
