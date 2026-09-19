/* Faithful Jeopardy runtime from the legacy project with math/code rendering, teams, turns, and scoring. */
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

  function executeScripts(root){
    // When content is inserted via innerHTML, script tags don't execute
    // This function finds and re-executes them
    if (!root) return;
    const scripts = root.querySelectorAll('script');
    scripts.forEach(function(oldScript){
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      // Copy attributes
      Array.from(oldScript.attributes).forEach(function(attr){
        newScript.setAttribute(attr.name, attr.value);
      });
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  function initJeopardy(container){
    let cfg = null;
    try {
      const dataNode = container.querySelector('script.jeopardy-data[type="application/json"]');
      let raw = dataNode ? (dataNode.textContent || dataNode.innerText || '') : '';
      if (!raw || !raw.trim()) {
        raw = container.getAttribute('data-config') || '{}';
      }
      if (raw && raw.indexOf('&') !== -1 && raw.indexOf('{') === -1) {
        const ta = document.createElement('textarea'); ta.innerHTML = raw; raw = ta.value;
      }
      cfg = JSON.parse(raw);
    } catch(e){ cfg = {}; }
    const nTeams = Math.max(1, parseInt(cfg.teams||2,10));
    const categories = cfg.categories||[];
    const values = (cfg.values||[]).slice().sort(function(a,b){return a-b;});

    const tileStates = Object.create(null);
    const categoryStats = categories.map(()=>({correct:0, wrong:0}));
    let totalPlayableTiles = 0;
    let scoreboardShown = false;
    const storageKey = 'jeopardy:' + (container && container.id ? container.id : 'default');
    function buildState(){
      return {
        started,
        gameMode,
        timerMs,
        currentTurn,
        scoreboardShown,
        teams: teams.map(t=>({name:t.name, score:t.score})),
        teamCategoryPoints: teamCategoryPoints.map(row=> row.slice()),
        categoryStats: categoryStats.map(s=>({correct:s.correct, wrong:s.wrong})),
        tileStates: Object.fromEntries(Object.entries(tileStates).map(([k,v])=>[k,{locked:!!(v&&v.locked)}]))
      };
    }
    function saveState(){ try { localStorage.setItem(storageKey, JSON.stringify(buildState())); } catch(e){} }
    function loadState(){
      try { const raw = localStorage.getItem(storageKey); if(!raw) return null; const obj = JSON.parse(raw); if (!obj || typeof obj !== 'object') return null; return obj; } catch(e){ return null; }
    }
    function clearState(){ try { localStorage.removeItem(storageKey); } catch(e){} }
    let gameMode = 'duel';
    let timerMs = 0;
    let currentTurn = 0;
    let started = false;

    const scorebar = document.createElement('div');
    scorebar.className = 'jeopardy-scorebar';
    scorebar.style.display = 'none';
    const turnIndicator = document.createElement('div');
    turnIndicator.className = 'jeopardy-turn-indicator';
    turnIndicator.style.display = 'none';
    const topbar = document.createElement('div');
    topbar.className = 'jeopardy-topbar';
    const scoreWrap = document.createElement('div');
    scoreWrap.className = 'jeopardy-scorebar-wrap';
    scoreWrap.appendChild(scorebar);
    const topbarRight = document.createElement('div');
    topbarRight.className = 'jeopardy-topbar-right';
    const resetBtn = document.createElement('button');
    resetBtn.className = 'j-btn accent jeopardy-reset-button';
    resetBtn.textContent = 'Reset spill';
    resetBtn.style.display = 'none';
    topbarRight.appendChild(resetBtn);
    topbar.appendChild(scoreWrap);
    topbar.appendChild(topbarRight);

    let teams = [];
    let teamCategoryPoints = Array.from({length: nTeams}, () => Array.from({length: categories.length}, () => 0));
    function updateActiveTeamHighlight(){
      teams.forEach((t,i)=>{
        if (!t._el) return;
        if (gameMode==='turn' && i===currentTurn) t._el.classList.add('active');
        else t._el.classList.remove('active');
      });
      if (turnIndicator) {
        if (gameMode==='turn' && started && teams.length>0) {
          turnIndicator.style.display = '';
          turnIndicator.textContent = `Tur: ${teams[currentTurn].name}`;
        } else {
          turnIndicator.style.display = 'none';
          turnIndicator.textContent = '';
        }
      }
    }
    function rebuildTeams(newN, names){
      teams = [];
      scorebar.innerHTML = '';
      teamCategoryPoints = Array.from({length: newN}, () => Array.from({length: categories.length}, () => 0));
      for(let i=0;i<newN;i++){
        const team = { name: names && names[i] ? names[i] : `Lag ${i+1}`, score: 0 };
        teams.push(team);
        const el = document.createElement('div');
        el.className = 'jeopardy-team';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'team-name';
        nameSpan.textContent = team.name;
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'score';
        scoreSpan.textContent = '0';
        el.appendChild(nameSpan);
        el.appendChild(scoreSpan);
        scorebar.appendChild(el);
        team._elScore = scoreSpan;
        team._el = el;
      }
      updateActiveTeamHighlight();
    }
    function applySavedState(state){
      try {
        started = !!state.started;
        gameMode = state.gameMode || gameMode;
        timerMs = typeof state.timerMs === 'number' ? state.timerMs : timerMs;
        currentTurn = typeof state.currentTurn === 'number' ? state.currentTurn : 0;
        scoreboardShown = !!state.scoreboardShown;
        const savedTeams = Array.isArray(state.teams) ? state.teams : [];
        const names = savedTeams.length ? savedTeams.map(t=> t && t.name ? String(t.name) : '') : null;
        const newN = Math.max(1, names ? names.length : nTeams);
        rebuildTeams(newN, names || undefined);
        if (savedTeams.length){
          savedTeams.forEach((t,i)=>{
            if (teams[i]){ teams[i].score = Number(t.score)||0; if (teams[i]._elScore) teams[i]._elScore.textContent = String(teams[i].score); }
          });
        }
        if (Array.isArray(state.teamCategoryPoints)){
          teamCategoryPoints = state.teamCategoryPoints.map(row=> Array.isArray(row)? row.slice(): []);
        }
        if (Array.isArray(state.categoryStats)){
          state.categoryStats.forEach((s,i)=>{ if (categoryStats[i]){ categoryStats[i].correct = Number(s.correct)||0; categoryStats[i].wrong = Number(s.wrong)||0; }});
        }
        if (state.tileStates && typeof state.tileStates === 'object'){
          Object.keys(state.tileStates).forEach(k=>{ const v = state.tileStates[k]; if (v && v.locked){ tileStates[k] = {locked:true}; }});
          try {
            container.querySelectorAll('.jeopardy-tile').forEach(btn=>{
              const k = btn && btn.dataset ? btn.dataset.key : null; if (!k) return;
              if (tileStates[k] && tileStates[k].locked){ btn.disabled = true; btn.classList.add('used'); }
            });
          } catch(e){}
        }
        try { scorebar.style.display = ''; } catch(e){}
        try { resetBtn.style.display = ''; } catch(e){}
        try { setup.style.display = 'none'; } catch(e){}
        updateActiveTeamHighlight();
      } catch(e){}
    }

    const table = document.createElement('table');
    table.className = 'jeopardy-grid';

    const thead = document.createElement('thead');
    const thr = document.createElement('tr');
    categories.forEach(cat=>{
      const th = document.createElement('th');
      th.textContent = cat.name||'';
      thr.appendChild(th);
    });
    thead.appendChild(thr);

    const tbody = document.createElement('tbody');

    const lookup = {};
    categories.forEach((cat,ci)=>{
      (cat.tiles||[]).forEach(t=>{
        const key = ci+'|'+t.value;
        lookup[key] = t;
      });
    });
    totalPlayableTiles = Object.keys(lookup).length;

    values.forEach(val=>{
      const tr = document.createElement('tr');
      categories.forEach((cat,ci)=>{
        const td = document.createElement('td');
        const tile = document.createElement('button');
        tile.className = 'jeopardy-tile';
        tile.textContent = val;
        const key = ci+'|'+val;
        tile.dataset.key = key;
        const data = lookup[key] || null;
        if(!data){ tile.disabled = true; tile.classList.add('used'); }
        if (tileStates[key] && tileStates[key].locked) { tile.disabled = true; tile.classList.add('used'); }
        tile.addEventListener('click', ()=>{
          if(tile.classList.contains('used')||tile.disabled) return;
          if (!started) return;
          openModal(cat.name||'', val, data, tile, key);
        });
        td.appendChild(tile);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(thead); table.appendChild(tbody);

    const backdrop = document.createElement('div');
    backdrop.className = 'jeopardy-modal-backdrop';
    const modal = document.createElement('div');
    modal.className = 'jeopardy-modal';
    const header = document.createElement('div'); header.className='jeopardy-modal-header';
    const title = document.createElement('div');
    const timerBox = document.createElement('div'); timerBox.className='jeopardy-timer'; timerBox.style.marginLeft='auto';
    const closeBtn = document.createElement('button'); closeBtn.className='j-btn warn'; closeBtn.textContent='Lukk';
    const body = document.createElement('div'); body.className='jeopardy-modal-body';
    const footer = document.createElement('div'); footer.className='jeopardy-modal-footer';

    header.appendChild(title); header.appendChild(timerBox); header.appendChild(closeBtn);
    modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer);
    backdrop.appendChild(modal);

    function setScore(i, delta){ teams[i].score += delta; teams[i]._elScore.textContent = String(teams[i].score); }
    let escHandler = null;
    const hideModal = ()=>{ 
      backdrop.style.display = 'none'; 
      try { if (typeof stopTimer === 'function') stopTimer(); } catch(e){}
      if (escHandler) { 
        try { document.removeEventListener('keydown', escHandler); } catch(e){}
        escHandler = null; 
      }
    };
    function enableEscClose(){
      if (escHandler) {
        try { document.removeEventListener('keydown', escHandler); } catch(e){}
        escHandler = null;
      }
      escHandler = function(e){
        const key = e.key || e.code;
        if (key === 'Escape' || key === 'Esc') {
          try { e.preventDefault(); } catch(_){ }
          hideModal();
        }
      };
      try { document.addEventListener('keydown', escHandler); } catch(e){}
    }
    function checkCompletionAndShowWinner(){
      if (scoreboardShown) return;
      if (totalPlayableTiles <= 0) return;
      let lockedCount = 0;
      for (const k in tileStates) { if (tileStates[k] && tileStates[k].locked) lockedCount++; }
      if (lockedCount >= totalPlayableTiles) {
        scoreboardShown = true;
        openWinner();
      }
    }
    function openWinner(){
      const sorted = teams.map((t,i)=>({name:t.name, score:t.score, idx:i}))
                          .sort((a,b)=> b.score - a.score);
      const max = sorted.length ? sorted[0].score : 0;
      const winners = sorted.filter(x=> x.score === max);
      title.textContent = winners.length > 1 ? 'Scoreboard' : 'Scoreboard';
      body.innerHTML = '';
      footer.innerHTML = '';
      const grid = document.createElement('div');
      const cols = 2 + categories.length;
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = `1.5fr ${'auto '.repeat(categories.length)} auto`;
      grid.style.gap = '0.5rem 1rem';
      const hTeam = document.createElement('div'); hTeam.style.fontWeight = '700'; hTeam.textContent = 'Lag';
      grid.appendChild(hTeam);
      categories.forEach(cat => { const h = document.createElement('div'); h.style.fontWeight='700'; h.textContent = cat.name||''; grid.appendChild(h); });
      const hScore = document.createElement('div'); hScore.style.fontWeight='700'; hScore.textContent = 'Score';
      grid.appendChild(hScore);
      sorted.forEach(t => {
        const rowBold = (t.score === max);
        const name = document.createElement('div'); name.textContent = t.name; if (rowBold) name.style.fontWeight = '700'; grid.appendChild(name);
        const pointsRow = teamCategoryPoints[t.idx] || [];
        categories.forEach((_, ci) => { const cell = document.createElement('div'); const val = pointsRow[ci] || 0; cell.textContent = String(val); if (rowBold) cell.style.fontWeight = '700'; grid.appendChild(cell); });
        const sc = document.createElement('div'); sc.textContent = String(t.score); if (rowBold) sc.style.fontWeight = '700'; grid.appendChild(sc);
      });
      body.appendChild(grid);
      backdrop.style.display = 'flex';
      enableEscClose();
      closeBtn.onclick = hideModal; backdrop.onclick = (e)=>{ if(e.target===backdrop) hideModal(); };
    }

    function resetGame(){
      try { hideModal(); } catch(e){}
      try { stopTimer(); } catch(e){}
      started = false;
      scoreboardShown = false;
      currentTurn = 0;
      for (const k in tileStates) { try { delete tileStates[k]; } catch(e){} }
      for (let i=0;i<categoryStats.length;i++){ categoryStats[i].correct = 0; categoryStats[i].wrong = 0; }
      teams = [];
      teamCategoryPoints = Array.from({length: nTeams}, () => Array.from({length: categories.length}, () => 0));
      scorebar.innerHTML = '';
      try {
        container.querySelectorAll('.jeopardy-tile').forEach(b=>{ b.disabled = false; b.classList.remove('used'); });
      } catch(e){}
      try { scorebar.style.display = 'none'; } catch(e){}
      try { turnIndicator.style.display = 'none'; } catch(e){}
      try { resetBtn.style.display = 'none'; } catch(e){}
      try { setup.style.display = ''; } catch(e){}
      clearState();
    }
    resetBtn.addEventListener('click', resetGame);

    let countdownId = null;
    function stopTimer(){ if (countdownId) { try { clearInterval(countdownId); } catch(e){} countdownId = null; } timerBox.textContent=''; }
    function startTimer(onTimeout){
      stopTimer();
      if (!timerMs || timerMs <= 0) return;
      let remaining = Math.floor(timerMs/1000);
      const render = () => { timerBox.textContent = `${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`; };
      render();
      countdownId = setInterval(()=>{
        remaining -= 1;
        if (remaining <= 0){ stopTimer(); try { onTimeout && onTimeout(); } catch(e){} }
        else render();
      }, 1000);
    }

    function openModal(category, value, data, tile, key){
      title.textContent = `${category} – ${value}`;
      body.innerHTML = '';
      footer.innerHTML = '';

      const q = document.createElement('div'); q.className='jeopardy-q'; q.innerHTML = data && data.question ? data.question : '';
      const a = document.createElement('div'); a.className='jeopardy-a'; a.innerHTML = data && data.answer ? data.answer : '';

      const revealBtn = document.createElement('button'); revealBtn.className='j-btn success'; revealBtn.textContent='Fasit';
      revealBtn.addEventListener('click', ()=>{
        const showing = a.style.display !== 'block';
        a.style.display = showing ? 'block' : 'none';
        try { setTimeout(()=>{ if (typeof body.scrollTo === 'function') body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }); else body.scrollTop = body.scrollHeight; }, 0); } catch(e){ try { body.scrollTop = body.scrollHeight; } catch(_e){} }
      });
      body.appendChild(q); body.appendChild(a);

      // Execute any scripts in the question and answer content
      executeScripts(q);
      executeScripts(a);

      // Tracking for duel vs turn-based scoring
      let scored = false;
      let duelPendingTeams = new Set();
      const teamActions = document.createElement('div'); teamActions.className='jeopardy-team-actions';
      const disableTeamButtons = () => { teamActions.querySelectorAll('button').forEach(b=>{ b.disabled = true; }); };
      const onTimeout = ()=>{
        disableTeamButtons();
        if (gameMode==='turn' && teams.length>0){ currentTurn = (currentTurn+1)%teams.length; updateActiveTeamHighlight(); }
        try { saveState(); } catch(e){}
        try { setTimeout(()=>{ hideModal(); }, 300); } catch(e){}
      };
      teams.forEach((t, i)=>{
        // In turn-based mode, only the active team can be scored on
        if (gameMode==='turn' && i!==currentTurn) return;
        // Create a per-team column with label and buttons
        const teamCol = document.createElement('div');
        teamCol.className = 'jeopardy-team-column';
        const teamLabel = document.createElement('div');
        teamLabel.className = 'jeopardy-team-label';
        teamLabel.textContent = t.name;
        teamCol.appendChild(teamLabel);

        const add = document.createElement('button');
        add.className='j-btn primary';
        add.textContent = `+${value} poeng`;

        // Explicit 0-points option per team in both modes
        let zeroBtn = document.createElement('button');
        zeroBtn.className = 'j-btn secondary';
        zeroBtn.textContent = '0 poeng';

        // Register this team as pending in duel mode
        if (gameMode === 'duel') {
          duelPendingTeams.add(i);
        }

        const registerScore = (delta)=>{
          if (tileStates[key] && tileStates[key].locked) return;
          setScore(i, delta);
          try {
            const ci = parseInt(String(key).split('|')[0], 10);
            if (!isNaN(ci) && categoryStats[ci]) {
              if (delta > 0) categoryStats[ci].correct++;
            }
            if (!isNaN(ci) && teamCategoryPoints[i]) {
              if (typeof teamCategoryPoints[i][ci] !== 'number') teamCategoryPoints[i][ci] = 0;
              teamCategoryPoints[i][ci] += delta;
            }
          } catch(e){}
        };

        const finalizeIfNeeded = ()=>{
          if (gameMode === 'duel') {
            if (duelPendingTeams.size > 0) return;
          } else {
            // turn-based: single decision ends the question
          }

          scored = true;
          tileStates[key] = { locked: true };
          if (tile) { tile.classList.add('used'); tile.disabled = true; }
          if (gameMode==='turn' && teams.length>0){ currentTurn = (currentTurn+1)%teams.length; updateActiveTeamHighlight(); }
          try { saveState(); setTimeout(()=>{ hideModal(); checkCompletionAndShowWinner(); }, 300); } catch(e){}
        };

        const handleAdd = ()=>{
          if (gameMode === 'turn') {
            if (scored) return;
            registerScore(value);
            scored = true;
            if (add) { add.disabled = true; add.classList.add('used-choice'); }
            if (zeroBtn) { zeroBtn.disabled = true; zeroBtn.classList.add('used-choice'); }
            finalizeIfNeeded();
          } else {
            if (!duelPendingTeams.has(i)) return;
            registerScore(value);
            duelPendingTeams.delete(i);
            if (add) { add.disabled = true; add.classList.add('used-choice'); }
            if (zeroBtn) { zeroBtn.disabled = true; zeroBtn.classList.add('used-choice'); }
            finalizeIfNeeded();
          }
        };

        const handleZero = ()=>{
          if (gameMode === 'turn') {
            if (scored) return;
            // Explicitly choose 0 points: no score change, but consume the question
            scored = true;
            if (add) { add.disabled = true; add.classList.add('used-choice'); }
            if (zeroBtn) { zeroBtn.disabled = true; zeroBtn.classList.add('used-choice'); }
            finalizeIfNeeded();
          } else if (gameMode === 'duel') {
            if (!duelPendingTeams.has(i)) return;
            // Zero points: just clear pending state for this team
            duelPendingTeams.delete(i);
            if (add) { add.disabled = true; add.classList.add('used-choice'); }
            if (zeroBtn) { zeroBtn.disabled = true; zeroBtn.classList.add('used-choice'); }
            finalizeIfNeeded();
          }
        };

        add.addEventListener('click', handleAdd);
        if (zeroBtn) zeroBtn.addEventListener('click', handleZero);

        if (tileStates[key] && tileStates[key].locked) {
          add.disabled = true;
          if (zeroBtn) zeroBtn.disabled = true;
        }

        teamCol.appendChild(add);
        if (zeroBtn) teamCol.appendChild(zeroBtn);
        teamActions.appendChild(teamCol);
      });
      const footerRight = document.createElement('div');
      footerRight.className = 'jeopardy-footer-right';
      footerRight.appendChild(revealBtn);
      footer.appendChild(teamActions);
      footer.appendChild(footerRight);

      renderMathIfAvailable(q); renderMathIfAvailable(a);
      highlightCodeIfAvailable(q); highlightCodeIfAvailable(a);

      backdrop.style.display = 'flex';
      enableEscClose();
      startTimer(onTimeout);
      closeBtn.onclick = hideModal; backdrop.onclick = (e)=>{ if(e.target===backdrop) hideModal(); };
    }

    const setup = document.createElement('div'); setup.className='jeopardy-setup';
    const fTeams = document.createElement('div'); fTeams.className='jp-field';
    const lTeams = document.createElement('label'); lTeams.textContent='Antall lag:'; const sTeams=document.createElement('select');
    [1,2,3,4,5,6].forEach(n=>{ const opt=document.createElement('option'); opt.value=String(n); opt.textContent=String(n); if(n===nTeams) opt.selected=true; sTeams.appendChild(opt); });
    fTeams.appendChild(lTeams); fTeams.appendChild(sTeams);
    const namesWrap = document.createElement('div'); namesWrap.className='jp-names';
    function renderNames(){ namesWrap.innerHTML=''; const n=parseInt(sTeams.value,10)||1; for(let i=0;i<n;i++){ const row=document.createElement('div'); row.className='jp-name-row'; const lbl=document.createElement('label'); lbl.textContent=`Lagnavn ${i+1}`; const inp=document.createElement('input'); inp.type='text'; inp.value=`Lag ${i+1}`; row.appendChild(lbl); row.appendChild(inp); namesWrap.appendChild(row);} }
    sTeams.addEventListener('change', renderNames); renderNames();
    const fTimer=document.createElement('div'); fTimer.className='jp-field'; const lTimer=document.createElement('label'); lTimer.textContent='Timer:'; const sTimer=document.createElement('select'); [{label:'∞',ms:0},{label:'30s',ms:30000},{label:'1 min',ms:60000},{label:'2 min',ms:120000}].forEach((t,i)=>{ const opt=document.createElement('option'); opt.value=String(t.ms); opt.textContent=t.label; if(i===0) opt.selected=true; sTimer.appendChild(opt);}); fTimer.appendChild(lTimer); fTimer.appendChild(sTimer);
    const fMode=document.createElement('div'); fMode.className='jp-field'; const lMode=document.createElement('label'); lMode.textContent='Modus:'; const sMode=document.createElement('select'); [{v:'turn',t:'Turn-based'},{v:'duel',t:'Duell'}].forEach(m=>{ const opt=document.createElement('option'); opt.value=m.v; opt.textContent=m.t; if(m.v==='duel') opt.selected=true; sMode.appendChild(opt);}); fMode.appendChild(lMode); fMode.appendChild(sMode);
    const startBtn=document.createElement('button'); startBtn.className='j-btn primary'; startBtn.textContent='Start spill';
    startBtn.addEventListener('click', ()=>{
      const newN = parseInt(sTeams.value,10)||1;
      const names = Array.from(namesWrap.querySelectorAll('input')).map((inp,i)=> inp.value && inp.value.trim() ? inp.value.trim() : `Lag ${i+1}`);
      gameMode = sMode.value==='turn' ? 'turn' : 'duel';
      timerMs = parseInt(sTimer.value,10)||0;
      currentTurn = Math.floor(Math.random()*Math.max(1,newN));
      started = true;
      try { if (typeof resumePrompt !== 'undefined' && resumePrompt && resumePrompt.parentNode) resumePrompt.remove(); } catch(e){}
      rebuildTeams(newN, names);
      try { scorebar.style.display = ''; } catch(e){}
      try { resetBtn.style.display = ''; } catch(e){}
      try { updateActiveTeamHighlight(); } catch(e){}
      setup.style.display='none';
      try { saveState(); } catch(e){}
    });
    setup.appendChild(fTeams); setup.appendChild(namesWrap); setup.appendChild(fTimer); setup.appendChild(fMode); setup.appendChild(startBtn);

    container.innerHTML = '';
    const saved = loadState();
    let resumePrompt = null;
    if (saved && (saved.started || (saved.tileStates && Object.keys(saved.tileStates).length>0) || (Array.isArray(saved.teams) && saved.teams.some(t=> (t&&Number(t.score)||0)!==0)))){
      resumePrompt = document.createElement('div'); resumePrompt.className='jeopardy-resume-prompt';
      const txt = document.createElement('div'); txt.className='jeopardy-resume-text'; txt.textContent = 'Fortsett der du slapp?';
      const actions = document.createElement('div'); actions.className='jeopardy-resume-actions';
      const btnStart = document.createElement('button'); btnStart.className='j-btn accent'; btnStart.textContent='Start fra begynnelsen';
      const btnResume = document.createElement('button'); btnResume.className='j-btn primary'; btnResume.textContent='Fortsett';
      actions.appendChild(btnStart); actions.appendChild(btnResume);
      resumePrompt.appendChild(txt); resumePrompt.appendChild(actions);
      btnStart.addEventListener('click', ()=>{ 
        try { clearState(); } catch(e){}
        try { resumePrompt.remove(); } catch(e){}
        try { setup.style.display = ''; } catch(e){}
      });
      btnResume.addEventListener('click', ()=>{ try { applySavedState(saved); } catch(e){}; try { resumePrompt.remove(); } catch(e){}; });
      container.appendChild(resumePrompt);
      try { setup.style.display = 'none'; } catch(e){}
    }
    container.appendChild(setup);
    container.appendChild(topbar);
    container.appendChild(turnIndicator);
    container.appendChild(table);
    container.appendChild(backdrop);
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.jeopardy-container[data-config]').forEach(initJeopardy);
  });
})();
