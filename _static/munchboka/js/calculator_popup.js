/* Floating, nonmodal calculator. No CDN or jQuery requirement. */
(() => {
  'use strict';
  const instances = new Map();
  function create(button) {
    const panel = document.createElement('section');
    panel.id = button.dataset.cwId; panel.className = 'cw-popup-panel';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', panel.id + '-title'); panel.tabIndex = -1;
    panel.style.width = Math.min(+button.dataset.cwWidth, window.innerWidth - 16) + 'px';
    panel.style.height = Math.min(+button.dataset.cwHeight, window.innerHeight - 16) + 'px';
    const bar = document.createElement('div'); bar.className = 'cw-popup-bar';
    const title = document.createElement('span'); title.id = panel.id + '-title'; title.textContent = button.dataset.cwTitle;
    const close = document.createElement('button'); close.type = 'button'; close.className = 'cw-popup-close'; close.textContent = '×'; close.setAttribute('aria-label', 'Lukk kalkulator');
    const frame = document.createElement('iframe'); frame.title = button.dataset.cwTitle;
    frame.src = button.dataset.cwSrc + '#state=' + encodeURIComponent(location.pathname + ':' + panel.id);
    bar.append(title, close); panel.append(bar, frame); document.body.append(panel);
    const hide = () => { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); button.focus(); };
    close.addEventListener('click', hide);
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); hide(); } });
    const clamp = () => {
      const rect = panel.getBoundingClientRect();
      panel.style.maxWidth = Math.max(1, innerWidth - 16) + 'px';
      panel.style.maxHeight = Math.max(1, innerHeight - 16) + 'px';
      panel.style.left = Math.max(8, Math.min(rect.left, innerWidth - Math.min(rect.width, innerWidth - 16) - 8)) + 'px';
      panel.style.top = Math.max(8, Math.min(rect.top, innerHeight - Math.min(rect.height, innerHeight - 16) - 8)) + 'px';
    };
    let drag = null;
    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      const r = panel.getBoundingClientRect(); drag = { x: e.clientX - r.left, y: e.clientY - r.top };
      bar.setPointerCapture(e.pointerId); panel.classList.add('cw-dragging'); e.preventDefault();
    });
    bar.addEventListener('pointermove', e => { if (!drag) return; panel.style.left = e.clientX - drag.x + 'px'; panel.style.top = e.clientY - drag.y + 'px'; clamp(); });
    const end = () => { drag = null; panel.classList.remove('cw-dragging'); };
    bar.addEventListener('pointerup', end); bar.addEventListener('pointercancel', end);
    window.addEventListener('resize', clamp);
    panel.style.left = Math.max(8, (innerWidth - parseFloat(panel.style.width)) / 2) + 'px';
    panel.style.top = Math.max(8, (innerHeight - parseFloat(panel.style.height)) / 2) + 'px';
    // Escape inside the iframe is forwarded only when no calculator menu needs it.
    window.addEventListener('message', e => { if (e.source === frame.contentWindow && e.origin === location.origin && e.data?.type === 'cw-close') hide(); });
    return { panel, frame, clamp };
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('.cw-popup-button'); if (!button) return;
    let instance = instances.get(button);
    if (!instance) { instance = create(button); instances.set(button, instance); }
    instance.panel.hidden = false; instance.clamp(); button.setAttribute('aria-expanded', 'true');
    for (const item of instances.values()) item.panel.style.zIndex = item === instance ? '10002' : '10001';
    instance.frame.focus();
  });
})();
