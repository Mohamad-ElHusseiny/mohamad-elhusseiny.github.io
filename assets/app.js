'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('js-motion');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
const menu = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');
if (menu && navigation) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('open', open);
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  }));
}
const ns = 'http://www.w3.org/2000/svg';
function svgElement(type, attrs, content) {
  const el = document.createElementNS(ns, type);
  Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, String(value)));
  if (content !== undefined) el.textContent = content;
  return el;
}
function renderDetail(scale) {
  const root = document.querySelector('#hero-pixels');
  if (!root) return;
  root.replaceChildren();
  const step = scale === 'fine' ? 7 : scale === 'balanced' ? 11 : 18;
  const radius = 88;
  for (let y = -radius; y <= radius; y += step) {
    for (let x = -radius; x <= radius; x += step) {
      const distance = Math.hypot(x, y);
      if (distance > radius) continue;
      const variation = (Math.sin(x * 0.14) + Math.cos(y * 0.17) + Math.sin((x + y) * 0.22)) / 3;
      const opacity = Math.max(0.25, 0.95 - distance / 200 + variation * 0.22);
      root.appendChild(svgElement('rect', {
        x: 220 + x, y: 152 + y, width: step - 1.3, height: step - 1.3,
        rx: scale === 'compact' ? 2.5 : 1, fill: variation > 0 ? '#436b47' : '#8eae65', opacity: opacity
      }));
    }
  }
  root.appendChild(svgElement('circle', {cx: 220, cy: 152, r: 29, fill: '#cce498', opacity: '.7'}));
  root.appendChild(svgElement('circle', {cx: 220, cy: 152, r: 11, fill: '#30573b', opacity: '.65'}));
}
document.querySelectorAll('[data-detail]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-detail]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
    renderDetail(button.dataset.detail);
  });
});
renderDetail('fine');
document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.modal);
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  });
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
});
const copyButton = document.querySelector('.copy-email');
if (copyButton) copyButton.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('mhmdhusseiny42@gmail.com');
    status.textContent = 'Email copied.';
  } catch (_) {
    status.textContent = 'mhmdhusseiny42@gmail.com';
  }
});
const printButton = document.getElementById('print-resume');
if (printButton) printButton.addEventListener('click', () => window.print());
