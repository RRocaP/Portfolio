import React from 'react';

const FocusCard = () => (
  <section className="border border-neutral-800 rounded p-4 mb-8">
    <h2 className="text-xl font-semibold mb-2">Current focus</h2>
    <ul className="list-disc list-inside space-y-1">
      <li>AMP in vivo model (anti-Ly6G)</li>
      <li>AAV capsid insertions/linkers</li>
      <li>Automation: Fiji/Python pipelines</li>
    </ul>
  </section>
);

export default FocusCard;
