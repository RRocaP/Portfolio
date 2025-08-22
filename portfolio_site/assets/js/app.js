(() => {
  const dataEl = document.getElementById('site-data');
  const data = JSON.parse(dataEl.textContent);
  const grid = document.getElementById('projectGrid');
  const pubList = document.getElementById('pubList');

  // Theme toggle with localStorage
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (t) => { document.body.classList.toggle('light', t === 'light'); localStorage.setItem('theme', t); };
  setTheme(localStorage.getItem('theme') || 'dark');
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    setTheme(next);
  });


  // Create project element helper
  const createProjectElement = (project) => {
    const el = document.createElement('article');
    el.className = 'card';
    
    // Use safer DOM manipulation instead of innerHTML
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.innerHTML = svgFor(project.thumb); // SVG is safe
    
    const title = document.createElement('h3');
    title.textContent = project.title;
    
    const blurb = document.createElement('p');
    blurb.textContent = project.blurb;
    
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = project.tags.map(t => `#${t}`).join(' ');
    
    el.appendChild(thumb);
    el.appendChild(title);
    el.appendChild(blurb);
    el.appendChild(meta);
    
    // Add event listener with proper closure
    const clickHandler = () => window.open(project.link, '_blank');
    el.addEventListener('click', clickHandler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    });
    
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Open ${project.title} project`);
    
    return el;
  };

  // Render projects efficiently
  const render = (items) => {
    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();
    
    // Clear grid efficiently
    grid.textContent = '';
    
    for (const project of items) {
      fragment.appendChild(createProjectElement(project));
    }
    
    grid.appendChild(fragment);
  };

  // Filters - will be initialized after data loads
  function initFilters() {
    const chips = Array.from(document.querySelectorAll('.chip'));
    for (const c of chips) {
      c.addEventListener('click', () => {
        chips.forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        const f = c.dataset.filter;
        if (f === 'all') render(data.projects);
        else render(data.projects.filter(p => p.tags.includes(f)));
      });
    }
  }

  // Simple inline SVG placeholders
  function svgFor(name){
    if (name && name.endsWith('.svg')) {
      if (name.includes('pipeline')) return iconPipeline();
      if (name.includes('plot')) return iconPlot();
      if (name.includes('volcano')) return iconVolcano();
    }
    return iconGeneric();
  }
  function iconPipeline(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#7dd3fc"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <g stroke="url(#g)" stroke-width="3" fill="none">
        <rect x="20" y="30" width="40" height="24" rx="6"/>
        <rect x="80" y="30" width="40" height="24" rx="6"/>
        <rect x="140" y="30" width="40" height="24" rx="6"/>
        <path d="M60 42h18M120 42h18"/>
        <rect x="50" y="86" width="100" height="30" rx="8"/>
      </g>
    </svg>`;
  }
  function iconPlot(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <g stroke="#2a3140">
        ${Array.from({length:5}, (_,i)=>`<path d="M20 ${120 - i*20}h160"/>`).join('')}
        ${Array.from({length:7}, (_,i)=>`<path d="M${20 + i*24} 20v100"/>`).join('')}
      </g>
      <g>
        ${Array.from({length:25}, ()=>{
          const x = 30 + Math.random()*150; const y = 30 + Math.random()*90; const c = Math.random()>.5? '#7dd3fc':'#a78bfa';
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${c}"/>`;
        }).join('')}
      </g>
    </svg>`;
  }
  function iconVolcano(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <path d="M30 120 C60 60, 80 60, 100 120 S 160 60, 170 120" fill="none" stroke="#a78bfa" stroke-width="3"/>
      <g>
        <circle cx="70" cy="70" r="5" fill="#22c55e"/>
        <circle cx="130" cy="70" r="5" fill="#ef4444"/>
      </g>
    </svg>`;
  }
  function iconGeneric(){
    return `<svg width="100%" height="100%" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g2" x1="0" x2="1"><stop stop-color="#4f46e5"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs>
      <rect width="200" height="140" rx="14" fill="#0b0f18"/>
      <circle cx="100" cy="70" r="46" fill="none" stroke="url(#g2)" stroke-width="4"/>
    </svg>`;
  }

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Initialize components
  document.getElementById('githubLink').href = data.owner.github;
  document.getElementById('linkedinLink').href = data.owner.linkedin;
  
  render(data.projects);
  initFilters();
  
  // Publications
  for (const p of data.publications) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${p.link}" target="_blank" rel="noopener">${p.title}</a> <span style="color:#8892a6">(${p.year})</span>`;
    pubList.appendChild(li);
  }
})();

