import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector('.hero-title');
if (hero) {
  gsap.from(hero, { opacity: 0, duration: 1 });
}

const items = document.querySelectorAll('.timeline-item');
items.forEach((el, i) => {
  gsap.from(el, {
    x: i % 2 === 0 ? -100 : 100,
    opacity: 0,
    scrollTrigger: {
      trigger: el,
      start: 'top 80%'
    }
  });
});

const bar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scroll / height) * 100;
  if (bar) bar.style.width = progress + '%';
});

const button = document.getElementById('themeToggle');
if (button) {
  button.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}
