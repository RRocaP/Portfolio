// Sends navigation + candidate link data to service worker for predictive prefetch
function send(msg: any) { if (navigator.serviceWorker?.controller) navigator.serviceWorker.controller.postMessage(msg); }

export function reportNavigation() {
  send({ type: 'NAVIGATED', path: location.pathname });
  const links = Array.from(document.querySelectorAll('a[href^="/Portfolio/"]'))
    .map(a => (a as HTMLAnchorElement).getAttribute('href')!)
    .filter(Boolean);
  send({ type: 'CANDIDATES', paths: links.slice(0, 25) });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  reportNavigation();
} else {
  window.addEventListener('DOMContentLoaded', reportNavigation);
}
