(() => {
  'use strict';
  const root = document.querySelector('[data-input-demo]');
  if (!root) return;
  const source = root.querySelector('.preview-fallback');
  const canvas = root.querySelector('canvas');
  const slider = root.querySelector('input[type="range"]');
  const label = root.querySelector('output');
  const context = canvas.getContext('2d');
  if (!context) return;
  function draw() {
    const width = Number(slider.value);
    canvas.width = width;
    canvas.height = Math.max(1, Math.round(width * source.naturalHeight / source.naturalWidth));
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    const description = width < 160 ? 'Coarse' : width < 400 ? 'Balanced' : 'Detailed';
    label.textContent = description;
    slider.setAttribute('aria-valuetext', description + ' image preview');
    canvas.setAttribute('aria-label', description + ' resized preview of the public ladybird photograph');
    canvas.hidden = false;
    source.hidden = true;
    slider.disabled = false;
  }
  slider.addEventListener('input', draw);
  source.addEventListener('load', draw, {once:true});
  if (source.complete && source.naturalWidth) draw();
})();
