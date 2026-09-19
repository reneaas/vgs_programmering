(function(){
  function renderMathIfAvailable(root){
    if (typeof renderMathInElement === 'function') {
      try { renderMathInElement(root, {delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ]}); } catch(e){}
    }
  }

  function highlightCodeIfAvailable(root){
    if (typeof hljs !== 'undefined' && root) {
      try {
        root.querySelectorAll('pre code').forEach(function(block){
          hljs.highlightElement(block);
        });
      } catch(e){}
    }
  }

  /** Re-execute inline <script> tags that were injected via innerHTML. */
  function activateScripts(container){
    if (!container) return;
    container.querySelectorAll('script').forEach(function(old){
      var s = document.createElement('script');
      if (old.type) s.type = old.type;
      // Skip data-only script tags (e.g. application/json config blocks)
      if (s.type && s.type !== 'text/javascript' && s.type !== '') return;
      if (old.src) { s.src = old.src; } else { s.textContent = old.textContent; }
      old.parentNode.replaceChild(s, old);
    });
  }

  function initEscapeRoom(container){
    let cfg = null;
    try {
      // Prefer inline JSON script to avoid attribute escaping issues
      const dataNode = container.querySelector('script.escape-room-data[type="application/json"]');
      let raw = dataNode ? (dataNode.textContent || dataNode.innerText || '') : '';
      if (!raw || !raw.trim()) {
        raw = container.getAttribute('data-config') || '{}';
      }
      // Fallback: decode HTML entities if present in attribute form
      if (raw && raw.indexOf('&') !== -1 && raw.indexOf('{') === -1) {
        const ta = document.createElement('textarea'); ta.innerHTML = raw; raw = ta.value;
      }
      cfg = JSON.parse(raw);
    } catch(e){ cfg = {}; }
    const steps = Array.isArray(cfg.steps) ? cfg.steps : [];
    const storageKey = 'escapeRoom:' + (container && container.id ? container.id : 'default');

    function loadProgress(){
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (obj && typeof obj.idx === 'number') {
          // Clamp index to available steps
          const clamped = Math.max(0, Math.min(steps.length, Math.floor(obj.idx)));
          return { idx: clamped };
        }
      } catch(e){}
      return null;
    }
    function saveProgress(i){
      try { window.localStorage.setItem(storageKey, JSON.stringify({ idx: i })); } catch(e){}
    }
    function clearProgress(){
      try { window.localStorage.removeItem(storageKey); } catch(e){}
    }
    const caseInsensitive = !!cfg.caseInsensitive;

    // Build UI
    const root = document.createElement('div');
    root.className = 'er-root';

    const header = document.createElement('div');
    header.className = 'er-header';
    const progress = document.createElement('div');
    progress.className = 'er-progress';
    header.appendChild(progress);
    // Visual progress bar under the label
    const progressBar = document.createElement('div');
    progressBar.className = 'er-progressbar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', String((Array.isArray(cfg.steps)?cfg.steps:[]).length||0));
    const progressFill = document.createElement('div');
    progressFill.className = 'er-progressbar-fill';
    progressBar.appendChild(progressFill);
    header.appendChild(progressBar);

    const body = document.createElement('div');
    body.className = 'er-body';

  const controls = document.createElement('div');
    controls.className = 'er-controls';
    const codeInput = document.createElement('input'); codeInput.type = 'text'; codeInput.placeholder = 'Skriv kode';
    const submitBtn = document.createElement('button'); submitBtn.className='er-btn primary'; submitBtn.textContent='Sjekk';
    const feedback = document.createElement('div'); feedback.className='er-feedback';
    controls.appendChild(codeInput); controls.appendChild(submitBtn);

    root.appendChild(header); root.appendChild(body); root.appendChild(controls); root.appendChild(feedback);

  let idx = 0;
  let resumePromptShown = false;
    // Avoid auto-scrolling on initial load by not auto-focusing until user interacts
    let userInitiated = false;
    const markUserInitiated = ()=>{ userInitiated = true; try { codeInput.focus({ preventScroll: true }); } catch(e){ try { codeInput.focus(); } catch(_){} } };
    try {
      container.addEventListener('pointerdown', markUserInitiated, { once: true, capture: true });
      container.addEventListener('keydown', function onKey(){ userInitiated = true; container.removeEventListener('keydown', onKey, true); }, true);
    } catch(e){}

    function normalizeCode(s){
      const t = String(s||'').trim();
      return caseInsensitive ? t.toLowerCase() : t;
    }

    function updateProgress(){
      progress.textContent = `Rom ${Math.min(idx+1, steps.length)} av ${steps.length}`;
        const total = steps.length || 1;
        const completed = Math.min(idx, steps.length);
        const pct = Math.max(0, Math.min(100, Math.round((completed/total)*100)));
        try { progressFill.style.width = pct + '%'; } catch(e){}
        try {
          progressBar.setAttribute('aria-valuenow', String(completed));
          progressBar.setAttribute('aria-valuemax', String(total));
        } catch(e){}
  root.appendChild(header); root.appendChild(body); root.appendChild(controls); root.appendChild(feedback);
    }

    function renderStep(){
      body.innerHTML = '';
      feedback.textContent = '';
      updateProgress();
      if (idx >= steps.length){
        const done = document.createElement('div');
        done.className = 'er-complete';
        done.innerHTML = '<h3> Ferdig! 🎉</h3>';
        body.appendChild(done);
        controls.style.display = 'none';
        // Clear saved progress on completion
        clearProgress();
        return;
      }
      controls.style.display = '';
      const step = steps[idx] || {};
      const title = document.createElement('h3'); title.className='er-title'; title.textContent = step.title || `Rom ${idx+1}`;
      const q = document.createElement('div'); q.className='er-q'; q.innerHTML = step.question || '';
      body.appendChild(title); body.appendChild(q);
      renderMathIfAvailable(q); highlightCodeIfAvailable(q); activateScripts(q);
      codeInput.value = '';
      if (userInitiated) {
        try { codeInput.focus({ preventScroll: true }); } catch(e){ try { codeInput.focus(); } catch(_){} }
      }
    }

    function showResumePrompt(savedIndex){
      resumePromptShown = true;
      // Hide normal UI until choice made
      body.innerHTML = '';
      controls.style.display = 'none';
      feedback.textContent = '';
      const p = document.createElement('div');
      p.className = 'er-resume-prompt';
      const txt = document.createElement('div');
      txt.className = 'er-resume-text';
      const roomNum = Math.min((savedIndex||0)+1, steps.length);
      txt.textContent = `Fortsett der du slapp (rom ${roomNum} av ${steps.length})?`;
      const actions = document.createElement('div');
      actions.className = 'er-resume-actions';
  const btnStart = document.createElement('button'); btnStart.className='er-btn accent'; btnStart.textContent='Start fra begynnelsen';
      const btnResume = document.createElement('button'); btnResume.className='er-btn primary'; btnResume.textContent='Fortsett';
      actions.appendChild(btnStart); actions.appendChild(btnResume);
      p.appendChild(txt); p.appendChild(actions);
      body.appendChild(p);
      btnStart.addEventListener('click', ()=>{
        idx = 0;
        clearProgress();
        controls.style.display = '';
        renderStep();
      });
      btnResume.addEventListener('click', ()=>{
        idx = Math.max(0, Math.min(steps.length, savedIndex||0));
        controls.style.display = '';
        renderStep();
      });
    }

    function check(){
      const step = steps[idx] || {};
      const allowed = Array.isArray(step.codes) ? step.codes : [];
      const entered = normalizeCode(codeInput.value);
      const ok = allowed.map(normalizeCode).includes(entered);
      if (ok){
        feedback.textContent = '';
        idx += 1;
        // Persist progress after each successful room
        saveProgress(idx);
        renderStep();
      } else {
        feedback.textContent = 'Feil kode. Prøv igjen.';
        feedback.classList.add('er-error');
        setTimeout(()=>{ feedback.classList.remove('er-error'); }, 500);
      }
    }

    submitBtn.addEventListener('click', check);
    codeInput.addEventListener('keydown', function(e){
      if (e.key === 'Enter') { e.preventDefault(); check(); }
    });

    container.innerHTML = '';
    container.appendChild(root);
    // Optional resume: only show prompt if saved progress exists and is within bounds
    const saved = loadProgress();
    if (saved && typeof saved.idx === 'number' && saved.idx > 0 && saved.idx <= steps.length) {
      showResumePrompt(saved.idx);
    } else {
      // Ensure no stale progress
      if (saved && (saved.idx <= 0 || saved.idx > steps.length)) clearProgress();
      renderStep();
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.escape-room-container').forEach(initEscapeRoom);
  });
})();
