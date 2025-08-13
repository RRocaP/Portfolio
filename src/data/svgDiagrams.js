export const svgDiagrams = {
  "High-throughput, function-forward screening of engineered AAV capsids": `
<svg width="100%" height="100%" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <style>
    .base { font-family: 'Inter', sans-serif; fill: #D4D4D4; }
    .title { font-size: 24px; font-weight: bold; fill: #EAEAEA; text-anchor: middle; }
    .label { font-size: 15px; text-anchor: middle; }
    .sub-label { font-size: 12px; text-anchor: middle; }
    .arrow { stroke: #6B7280; stroke-width: 2; marker-end: url(#arrowhead); }
    .highlight-arrow { stroke: #DC2626; stroke-width: 2.5; marker-end: url(#arrowhead-red); }
    .box { fill: #1E1E1E; stroke: #333333; stroke-width: 1.5; rx: 8; }
    .highlight-box { fill: rgba(220, 38, 38, 0.1); stroke: #DC2626; stroke-width: 2; rx: 8; }
    .dna { fill: #3B82F6; }
    .cell { fill: #10B981; }
  </style>
  <text x="400" y="35" class="title">Function-Forward AAV Screening</text>
  
  <!-- Step 1: Library Generation -->
  <g>
    <rect x="50" y="80" width="180" height="100" class="box" />
    <circle cx="140" cy="130" r="30" class="dna" />
    <text x="140" y="105" class="base label">1. AAV Capsid Library</text>
    <text x="140" y="180" class="base sub-label">Diverse DNA Barcodes</text>
  </g>
  
  <path d="M240 130 L 310 130" class="arrow" />
  
  <!-- Step 2: In Vivo Selection -->
  <g>
    <rect x="320" y="80" width="180" height="100" class="box" />
    <circle cx="410" cy="130" r="35" class="cell" />
    <text x="410" y="105" class="base label">2. In Vivo Selection</text>
    <text x="410" y="180" class="base sub-label">Mouse Model</text>
  </g>
  
  <path d="M510 130 L 580 130" class="arrow" />
  
  <!-- Step 3: Deep Sequencing -->
  <g>
    <rect x="590" y="80" width="180" height="100" class="box" />
    <path d="M630 120 h 100 M630 130 h 100 M630 140 h 100" stroke="#A1A1AA" stroke-width="4" />
    <text x="680" y="105" class="base label">3. Deep Sequencing</text>
    <text x="680" y="180" class="base sub-label">Identify Enriched Capsids</text>
  </g>
  
  <path d="M410 190 L 410 260" class="highlight-arrow" />
  
  <!-- Step 4: Functional Validation -->
  <g>
    <rect x="320" y="270" width="180" height="120" class="highlight-box" />
    <text x="410" y="295" class="base label">4. Functional Validation</text>
    <text x="410" y="325" class="base sub-label" fill="#FBBF24">Test Transduction</text>
    <text x="410" y="345" class="base sub-label" fill="#FBBF24">Efficiency & Tropism</text>
    <text x="410" y="370" class="base sub-label" style="font-weight:bold; fill: #DC2626;">Identify Top Performers</text>
  </g>
  
  <defs>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
    </marker>
    <marker id="arrowhead-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#DC2626" />
    </marker>
  </defs>
</svg>
`,
  "Functional Inclusion Bodies for Therapeutic Protein Production": `
<svg width="100%" height="100%" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <style>
    .base { font-family: 'Inter', sans-serif; fill: #D4D4D4; }
    .title { font-size: 24px; font-weight: bold; fill: #EAEAEA; text-anchor: middle; }
    .label { font-size: 15px; text-anchor: middle; }
    .sub-label { font-size: 12px; text-anchor: middle; }
    .arrow { stroke: #6B7280; stroke-width: 2; marker-end: url(#arrowhead); }
    .box { fill: #1E1E1E; stroke: #333333; stroke-width: 1.5; rx: 8; }
    .protein { fill: #3B82F6; }
    .cell { fill: #059669; }
    .inclusion-body { fill: #F59E0B; }
  </style>
  <text x="400" y="35" class="title">Functional Inclusion Bodies (FIBs)</text>

  <!-- Traditional Method -->
  <g>
    <text x="200" y="80" class="base label" style="font-weight:bold;">Traditional Method</text>
    <rect x="50" y="100" width="300" height="120" class="box" />
    <circle cx="120" cy="160" r="20" class="cell" />
    <text x="120" y="135" class="base sub-label">E. coli</text>
    <path d="M150 160 L 200 160" class="arrow" />
    <circle cx="250" cy="160" r="25" class="inclusion-body" opacity="0.5" />
    <text x="250" y="135" class="base sub-label">Inactive Protein Aggregates</text>
    <text x="250" y="200" class="base label" fill="#EF4444">Requires Refolding</text>
  </g>

  <!-- FIB Method -->
  <g>
    <text x="600" y="80" class="base label" style="font-weight:bold;">FIB Method</text>
    <rect x="450" y="100" width="300" height="120" class="box" style="stroke:#10B981; stroke-width:2;" />
    <circle cx="520" cy="160" r="20" class="cell" />
    <text x="520" y="135" class="base sub-label">Engineered E. coli</text>
    <path d="M550 160 L 600 160" class="arrow" />
    <circle cx="650" cy="160" r="25" class="inclusion-body" />
    <circle cx="645" cy="155" r="5" class="protein" />
    <circle cx="655" cy="165" r="5" class="protein" />
    <text x="650" y="135" class="base sub-label">Functional Inclusion Bodies</text>
    <text x="650" y="200" class="base label" fill="#22C55E">Directly Active</text>
  </g>

  <!-- Comparison -->
  <g>
    <path d="M150 280 L 650 280" stroke="#4B5563" stroke-width="1" />
    <text x="400" y="320" class="base label" style="font-size: 18px;">Paradigm Shift</text>
    <text x="200" y="360" class="base label">Costly & Complex</text>
    <text x="600" y="360" class="base label">Efficient & Scalable</text>
    <path d="M400 330 L 400 400" stroke="#4B5563" stroke-width="1" />
  </g>

  <defs>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
    </marker>
  </defs>
</svg>
`,
  "Directed evolution of a CAR-T cell-specific AAV capsid for T cell engineering": `
<svg width="100%" height="100%" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <style>
    .base { font-family: 'Inter', sans-serif; fill: #D4D4D4; }
    .title { font-size: 24px; font-weight: bold; fill: #EAEAEA; text-anchor: middle; }
    .label { font-size: 15px; text-anchor: middle; }
    .sub-label { font-size: 12px; text-anchor: middle; }
    .arrow { stroke: #6B7280; stroke-width: 2; marker-end: url(#arrowhead); }
    .highlight-arrow { stroke: #8B5CF6; stroke-width: 2.5; marker-end: url(#arrowhead-purple); }
    .box { fill: #1E1E1E; stroke: #333333; stroke-width: 1.5; rx: 8; }
    .highlight-box { fill: rgba(139, 92, 246, 0.1); stroke: #8B5CF6; stroke-width: 2; rx: 8; }
    .t-cell { fill: #EC4899; }
    .aav { fill: #3B82F6; }
  </style>
  <text x="400" y="35" class="title">Directed Evolution of CAR-T Specific AAV</text>

  <!-- Step 1: AAV Library -->
  <g>
    <rect x="50" y="80" width="180" height="100" class="box" />
    <circle cx="140" cy="130" r="10" class="aav" />
    <circle cx="120" cy="120" r="10" class="aav" />
    <circle cx="160" cy="140" r="10" class="aav" />
    <text x="140" y="105" class="base label">1. Diverse AAV Library</text>
  </g>

  <path d="M240 130 L 310 130" class="arrow" />

  <!-- Step 2: Selection on CAR-T cells -->
  <g>
    <rect x="320" y="80" width="180" height="100" class="box" />
    <circle cx="410" cy="130" r="25" class="t-cell" />
    <text x="410" y="105" class="base label">2. Selection Pressure</text>
    <text x="410" y="175" class="base sub-label">On Human CAR-T Cells</text>
  </g>

  <path d="M510 130 L 580 130" class="arrow" />

  <!-- Step 3: Recovery & Amplification -->
  <g>
    <rect x="590" y="80" width="180" height="100" class="box" />
    <circle cx="680" cy="130" r="12" class="aav" style="fill:#8B5CF6;" />
    <text x="680" y="105" class="base label">3. Recovery & Amplify</text>
    <text x="680" y="175" class="base sub-label">Isolate best binders</text>
  </g>
  
  <path d="M680 190 Q 680 250 410 250 Q 140 250 140 190" stroke="#6B7280" stroke-width="1.5" stroke-dasharray="5,5" fill="none" />
  <text x="400" y="225" class="base sub-label">Multiple Rounds of Evolution</text>

  <!-- Step 4: Final Vector -->
  <g>
    <rect x="320" y="300" width="180" height="120" class="highlight-box" />
    <circle cx="410" cy="360" r="30" class="t-cell" />
    <circle cx="390" cy="340" r="15" class="aav" style="fill:#8B5CF6;" />
    <text x="410" y="325" class="base label">4. Final Vector: AAV-F2</text>
    <text x="410" y="395" class="base sub-label" style="fill:#A78BFA; font-weight:bold;">High Specificity for CAR-T</text>
    <text x="410" y="415" class="base sub-label" style="fill:#A78BFA; font-weight:bold;">Low Off-Target Effects</text>
  </g>

  <defs>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
    </marker>
    <marker id="arrowhead-purple" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
    </marker>
  </defs>
</svg>
`,
};
