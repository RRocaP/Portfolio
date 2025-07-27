import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  gsap.from('.hero-title', { opacity: 0, y: 20, duration: 1 });

  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      x: i % 2 === 0 ? -50 : 50,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: { trigger: item, start: 'top 80%' }
    });
  });

  gsap.to('#progressBar', {
    width: '100%',
    ease: 'none',
    scrollTrigger: { scrub: true }
  });

  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.dataset.theme = stored;
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';

  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme);
  });

  import('https://cdn.jsdelivr.net/npm/lucide@latest/dist/esm/index.js').then(({ createLucideIcon, icons }) => {
    document.querySelectorAll('[data-icon]').forEach(el => {
      const icon = icons[el.dataset.icon];
      if (icon) {
        el.innerHTML = createLucideIcon(el.dataset.icon, {}).toSvg();
      }
    });
  });
});
