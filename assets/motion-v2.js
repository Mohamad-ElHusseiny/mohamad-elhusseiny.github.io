(() => {
  'use strict';
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const body = document.body;
  const toggle = document.querySelector('.motion-toggle');
  const label = document.querySelector('[data-motion-label]');
  let manuallyPaused = false;
  try { manuallyPaused = localStorage.getItem('portfolio-motion-paused') === 'true'; } catch (_) {}
  const active = () => !media.matches && !manuallyPaused;
  function updateMotion() {
    const enabled = active();
    body.classList.toggle('has-motion', enabled);
    body.classList.toggle('motion-paused', !enabled);
    if (toggle) {
      toggle.hidden = false;
      toggle.disabled = media.matches;
      toggle.setAttribute('aria-pressed', String(!enabled));
      toggle.setAttribute('aria-label', media.matches ? 'Motion disabled by your preference' : enabled ? 'Pause visual motion' : 'Play visual motion');
      label.textContent = media.matches ? 'Motion off' : enabled ? 'Pause motion' : 'Play motion';
    }
  }
  toggle?.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    try { localStorage.setItem('portfolio-motion-paused', String(manuallyPaused)); } catch (_) {}
    updateMotion();
  });
  media.addEventListener('change', updateMotion);
  updateMotion();
  document.addEventListener('visibilitychange', () => body.classList.toggle('motion-suspended', document.hidden));

  document.querySelectorAll('[data-tilt]').forEach(element => {
    let pending = false;
    let point = null;
    element.addEventListener('pointermove', event => {
      if (!active() || !finePointer.matches || event.pointerType === 'touch') return;
      point = {x:event.clientX, y:event.clientY};
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        if (!point || !active()) return;
        const rect = element.getBoundingClientRect();
        const x = Math.max(-.5, Math.min(.5, (point.x - rect.left) / rect.width - .5));
        const y = Math.max(-.5, Math.min(.5, (point.y - rect.top) / rect.height - .5));
        const strength = element.classList.contains('hero-stage') ? 7 : 4;
        element.style.setProperty('--tilt-x', (-y * strength).toFixed(2) + 'deg');
        element.style.setProperty('--tilt-y', (x * strength).toFixed(2) + 'deg');
        element.style.setProperty('--glow-x', (x * 45).toFixed(1) + 'px');
        element.style.setProperty('--glow-y', (y * 35).toFixed(1) + 'px');
        element.style.setProperty('--object-x', (x * 9).toFixed(1) + 'px');
        element.style.setProperty('--object-y', (y * 7).toFixed(1) + 'px');
      });
    }, {passive:true});
    element.addEventListener('pointerleave', () => {
      point = null;
      ['--tilt-x','--tilt-y','--glow-x','--glow-y','--object-x','--object-y'].forEach(name => element.style.removeProperty(name));
    });
  });

  document.querySelectorAll('[data-magnet]').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (!active() || !finePointer.matches || event.pointerType === 'touch') return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--magnet-x', ((event.clientX - rect.left - rect.width / 2) * .1).toFixed(1) + 'px');
      button.style.setProperty('--magnet-y', ((event.clientY - rect.top - rect.height / 2) * .13).toFixed(1) + 'px');
    }, {passive:true});
    button.addEventListener('pointerleave', () => {
      button.style.removeProperty('--magnet-x');
      button.style.removeProperty('--magnet-y');
    });
  });

  const focus = document.getElementById('visual-focus');
  const lab = document.querySelector('.research-lab');
  if (focus && lab) {
    document.querySelector('.focus-control').hidden = false;
    const setFocus = () => lab.style.setProperty('--focus-blur', ((100 - Number(focus.value)) / 22).toFixed(2) + 'px');
    focus.addEventListener('input', setFocus);
    setFocus();
  }
  const progress = document.querySelector('.scroll-progress');
  const header = document.querySelector('.header');
  let scrollPending = false;
  function updateScroll() {
    scrollPending = false;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0) + ')';
    header?.classList.toggle('has-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, {passive:true});
  window.addEventListener('resize', updateScroll, {passive:true});
  updateScroll();
})();
