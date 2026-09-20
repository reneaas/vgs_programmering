import { evaluate, pack, unpack, value, resultParts, decimalText, statistics, regression, numberTable, D, CalcError } from './engine.mjs';
import { Editor, esc } from './editor.mjs';
const $ = selector => document.querySelector(selector);
const editor = new Editor();
const defaults = () => ({ angle: 'Degree', io: 'MathI/MathO', number: 'Norm', norm: 1, digits: 3, fraction: 'Improper Fraction', decimal: 'Dot' });
const emptyState = () => ({ version: 1, settings: defaults(), ans: { d: '0' }, variables: {}, functions: { f: '', g: '' }, history: [], expression: [], result: null, app: 'home', stats: [], paired: false, frequency: false, table: { start: '1', end: '5', step: '1', dual: false }, box: { type: 'dice', count: 1, trials: 10 } });
let state = emptyState(), menu = null, menuStack = [], shift = false, error = '', resultFormat = 'Standard', homeIndex = 0, historyIndex = -1, off = false;
let screenMode = 'home', selectedRow = 0, selectedCol = 0, tableRows = [], statResults = {}, statTitle = 'Statistics Results', boxResults = [], prompt = null;
const storageKey = 'munch-cw-v1:' + (new URLSearchParams(location.hash.slice(1)).get('state') || location.pathname);
function validNodes(nodes, depth = 0) {
  return Array.isArray(nodes) && nodes.length < 600 && depth < 16 && nodes.every(n => typeof n === 'string' ? n.length < 30 : n && ['frac', 'mixed', 'power', 'root', 'nthroot', 'fn'].includes(n.type) && typeof n.name === 'string' && n.name.length < 20 && Array.isArray(n.args) && n.args.length <= 3 && n.args.every(a => validNodes(a, depth + 1)));
}
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved?.version === 1 && validNodes(saved.expression) && Array.isArray(saved.history) && saved.history.length <= 50 && saved.history.every(h => validNodes(h.nodes))) {
    unpack(saved.ans); if (saved.result) unpack(saved.result);
    state = { ...emptyState(), ...saved, settings: { ...defaults(), ...saved.settings } };
    if (!['Degree', 'Radian', 'Gradian'].includes(state.settings.angle) || !['Norm', 'Fix', 'Sci'].includes(state.settings.number) || !Number.isInteger(state.settings.digits) || state.settings.digits < 0 || state.settings.digits > 10) throw Error();
    for (const v of Object.values(state.variables)) unpack(v);
    if (!Array.isArray(state.stats) || state.stats.length > 160 || state.stats.some(r => !Array.isArray(r) || ![2, 3].includes(r.length) || r.some(x => !new D(x).isFinite()))) throw Error();
    editor.restore(state.expression); screenMode = 'home';
  }
} catch { state = emptyState(); editor.clear(); }
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Storage can be disabled or full. */ }
}
function context() { return { angle: state.settings.angle, ans: state.ans, variables: state.variables, functions: state.functions }; }
function announce(text) { $('#announcement').textContent = text; }
function resultHTML(v, format = resultFormat) {
  const p = resultParts(v, state.settings, format);
  if (p.text !== undefined) return esc(p.text).replace(/\^(-?\d+)/g, '<sup>$1</sup>');
  if (state.settings.io.startsWith('Line')) return esc((p.whole ? p.whole + ' ' : '') + p.numerator + '/' + p.denominator);
  return `${esc(p.whole || '')}<span class="fraction"><span>${esc(p.numerator)}</span><span>${esc(p.denominator)}</span></span>`;
}
function expressionHTML(active = true) { return `<div class="expression" aria-label="${esc(editor.source() || 'Empty expression')}">${state.settings.io.startsWith('Line') ? esc(editor.source()) + (active ? '<span class="caret"></span>' : '') : editor.html(active)}</div>`; }
function menuOpen(title, items, push = true) {
  if (!push) menuStack = [];
  else if (menu) menuStack.push(menu);
  menu = { title, items, index: 0 }; shift = false; error = ''; render();
}
function menuClose() { menu = null; menuStack = []; }
const item = (label, action, detail = '') => ({ label, action, detail });
function choice(title, options, selected, action) {
  menuOpen(title, options.map(option => item(option, () => { action(option); save(); back(); }, option === selected ? '✓' : '')));
  menu.index = Math.max(0, options.indexOf(selected)); render();
}
function back() {
  if (error) error = '';
  else if (menu) { menu = menuStack.pop() || null; }
  else if (prompt) { editor.restore(prompt.before); prompt = null; }
  else if (screenMode === 'stats-results') { screenMode = 'stats-edit'; selectedRow = Math.min(state.stats.length, selectedRow); editor.clear(); }
  else if (screenMode === 'table-grid') { screenMode = 'table-setup'; selectedRow = 0; }
  else if (screenMode === 'box-results') { screenMode = 'box-setup'; selectedRow = 0; }
  else if (screenMode !== 'home' && screenMode !== 'calc') goHome();
  render();
}
function goHome() {
  if (screenMode === 'calc' && !prompt) state.expression = editor.snapshot();
  if (prompt) { editor.restore(prompt.before); prompt = null; }
  menuClose(); error = ''; shift = false; screenMode = 'home'; save(); render();
}
function selectApp(index) {
  menuClose(); error = ''; homeIndex = index; selectedRow = selectedCol = 0;
  if (index === 0) { screenMode = 'calc'; editor.restore(state.expression); }
  else if (index === 1) { screenMode = 'stats-edit'; editor.clear(); chooseStatsType(); }
  else if (index === 2) { screenMode = 'table-setup'; }
  else { screenMode = 'box-setup'; }
  state.app = ['calc', 'stats', 'table', 'box'][index]; save(); render();
}
function beginPrompt(title, initial, commit) {
  menuClose(); prompt = { title, before: editor.snapshot(), commit };
  editor.setText(initial || ''); state.result = screenMode === 'calc' ? null : state.result; render();
}
function commitPrompt() {
  const text = editor.source(); const p = prompt;
  // Commit may deliberately leave the prompt open when validation fails.
  p.commit(text); editor.restore(p.before); prompt = null; save(); render();
}
function insert(text) {
  if (screenMode === 'home') return;
  if (!['calc', 'stats-edit'].includes(screenMode) && !prompt) return;
  if (screenMode === 'calc' && state.result && !prompt) {
    editor.clear(); if (['+', '-', '*', '/', '^', 'nCr', 'nPr', '!', '%'].includes(text)) editor.insert('Ans');
    state.result = null;
  }
  error = ''; editor.insert(text); resultFormat = 'Standard'; changed();
}
function template(type, name, fixed) {
  if (!['calc', 'stats-edit'].includes(screenMode) && !prompt) return;
  if (state.result && screenMode === 'calc' && !prompt) { editor.clear(); if (['power', 'frac'].includes(type)) editor.insert('Ans'); state.result = null; }
  error = ''; editor.template(type, name, fixed); changed();
}
function changed() {
  if (screenMode === 'calc' && !prompt) state.expression = editor.snapshot();
  save(); render();
}
function execute(decimal = false) {
  if (menu) { menu.items[menu.index]?.action(); render(); return; }
  if (error) { error = ''; render(); return; }
  if (prompt) { commitPrompt(); return; }
  if (screenMode === 'home') { selectApp(homeIndex); return; }
  if (screenMode === 'calc') {
    if (!editor.source()) return;
    if (!state.result) {
      const v = evaluate(editor.source(), context());
      state.ans = pack(v); state.result = pack(v); state.expression = editor.snapshot();
      state.history.push({ nodes: editor.snapshot(), result: pack(v) }); state.history = state.history.slice(-50); historyIndex = state.history.length;
    }
    resultFormat = decimal ? 'Decimal' : 'Standard';
    const p = resultParts(unpack(state.result), state.settings, resultFormat);
    announce(p.text ?? `${p.whole || ''} ${p.numerator} over ${p.denominator}`);
  } else if (screenMode === 'stats-edit') {
    if (!editor.source()) { statsActions(); return; }
    const v = evaluate(editor.source(), context());
    if (selectedRow >= statsLimit()) throw new CalcError('Range ERROR');
    if (selectedCol === 2 && (!v.d.isInteger() || v.d.lt(0) || v.d.gte('1e10'))) throw new CalcError('Range ERROR');
    if (!state.stats[selectedRow]) state.stats[selectedRow] = ['0', '0', '1'];
    state.stats[selectedRow][selectedCol] = v.d.toString(); selectedRow = Math.min(statsLimit() - 1, selectedRow + 1); editor.clear();
  } else if (screenMode === 'table-setup') tableAction(selectedRow);
  else if (screenMode === 'box-setup') boxAction(selectedRow);
  save(); render();
}
function chooseStatsType() {
  menuOpen('Statistics', [item('1-Variable', () => setStatsType(false)), item('2-Variable', () => setStatsType(true))], false);
}
function statsColumns() { return [0, ...(state.paired ? [1] : []), ...(state.frequency ? [2] : [])]; }
function statsLimit() { return Math.floor(160 / statsColumns().length); }
function setStatsType(paired) {
  if (state.paired !== paired) state.stats = [];
  state.paired = paired; selectedRow = selectedCol = 0; menuClose(); save(); render();
}
function showStatistics() {
  statResults = statistics(state.stats, state.paired, state.frequency);
  if (state.paired) { delete statResults.a; delete statResults.b; delete statResults.r; }
  statTitle = state.paired ? '2-Var Results' : '1-Var Results';
  selectedRow = 0; screenMode = 'stats-results'; menuClose(); render();
}
const regressions = [['y=a+bx', 'linear'], ['y=a+bx+cx²', 'quadratic'], ['y=a+b·ln(x)', 'logarithmic'], ['y=a·e^(bx)', 'exponential'], ['y=a·b^x', 'ab'], ['y=a·x^b', 'power'], ['y=a+b/x', 'inverse']];
function regressionMenu() {
  menuOpen('Select Reg Type', regressions.map(([label, type]) => item(label, () => {
    statResults = regression(state.stats, type, state.frequency); statTitle = label;
    selectedRow = 0; screenMode = 'stats-results'; menuClose(); render();
  })));
}
function statsActions() {
  menuOpen('Statistics', [item(state.paired ? '2-Var Results' : '1-Var Results', showStatistics), ...(state.paired ? [item('Reg Results', regressionMenu)] : [])], false);
}
function tableAction(index) {
  const fields = state.table.dual ? ['f', 'g', 'start', 'end', 'step', 'generate'] : ['f', 'start', 'end', 'step', 'generate'];
  const field = fields[index];
  if (field === 'f' || field === 'g') beginPrompt(`${field}(x)=`, state.functions[field], s => { evaluate(s, { ...context(), variables: { ...state.variables, x: '1' } }); state.functions[field] = s; });
  else if (field === 'generate') {
    if (!state.functions.f || (state.table.dual && !state.functions.g)) throw new CalcError('Define f(x) / g(x)');
    tableRows = numberTable(state.functions.f, state.table.dual ? state.functions.g : '', state.table.start, state.table.end, state.table.step, context());
    screenMode = 'table-grid'; selectedRow = 0; render();
  } else beginPrompt(field[0].toUpperCase() + field.slice(1), state.table[field], s => { state.table[field] = evaluate(s, context()).d.toString(); });
}
function boxAction(index) {
  if (index === 0) choice('Math Box', ['Dice Roll', 'Coin Toss'], state.box.type === 'dice' ? 'Dice Roll' : 'Coin Toss', v => { state.box.type = v === 'Dice Roll' ? 'dice' : 'coin'; });
  else if (index === 1) beginPrompt(state.box.type === 'dice' ? 'Number of Dice (1–3)' : 'Number of Coins (1–3)', String(state.box.count), s => { const n = evaluate(s, context()).d; if (!n.isInteger() || n.lt(1) || n.gt(3)) throw new CalcError('Range ERROR'); state.box.count = n.toNumber(); });
  else if (index === 2) beginPrompt('Attempts (1–250)', String(state.box.trials), s => { const n = evaluate(s, context()).d; if (!n.isInteger() || n.lt(1) || n.gt(250)) throw new CalcError('Range ERROR'); state.box.trials = n.toNumber(); });
  else {
    boxResults = Array.from({ length: state.box.trials }, () => Array.from({ length: state.box.count }, () => Math.floor(Math.random() * (state.box.type === 'dice' ? 6 : 2)) + (state.box.type === 'dice' ? 1 : 0)));
    selectedRow = 0; screenMode = 'box-results'; render();
  }
}
function settingsMenu() {
  menuOpen('SETTINGS', [
    item('Calc Settings', calcSettings, '›'),
    item('System Settings', () => menuOpen('System Settings', [item('Contrast', () => choice('Contrast', ['Light', 'Normal', 'Dark'], state.contrast || 'Normal', v => { state.contrast = v; })), item('About this simulator', () => { menuClose(); $('#help').showModal(); })]), '›'),
    item('Reset', () => menuOpen('Reset', ['Settings & Data', 'Variable Memory', 'Initialize All'].map(mode => item(mode, () => menuOpen('Reset ' + mode + '?', [item('No', back), item('Yes', () => {
      if (mode === 'Variable Memory') state.variables = {};
      else {
        const variables = state.variables, ans = state.ans; state = emptyState();
        if (mode === 'Settings & Data') { state.variables = variables; state.ans = ans; }
        editor.clear(); screenMode = 'home';
      }
      menuClose(); save(); render();
    })])))), '›'),
    item('Get Started', () => { menuClose(); $('#help').showModal(); }),
  ], false);
}
function calcSettings() {
  menuOpen('Calc Settings', [
    item('Input/Output', () => choice('Input/Output', ['MathI/MathO', 'MathI/DecimalO', 'LineI/LineO', 'LineI/DecimalO'], state.settings.io, v => state.settings.io = v), '›'),
    item('Angle Unit', () => choice('Angle Unit', ['Degree', 'Radian', 'Gradian'], state.settings.angle, v => state.settings.angle = v), state.settings.angle),
    item('Number Format', () => menuOpen('Number Format', [
      item('Fix', () => choice('Decimal Places', Array.from({ length: 10 }, (_, i) => String(i)), String(state.settings.digits), v => { state.settings.number = 'Fix'; state.settings.digits = +v; })),
      item('Sci', () => choice('Significant Digits', Array.from({ length: 10 }, (_, i) => String(i + 1)), String(state.settings.digits), v => { state.settings.number = 'Sci'; state.settings.digits = +v; })),
      item('Norm', () => choice('Norm', ['Norm 1', 'Norm 2'], 'Norm ' + state.settings.norm, v => { state.settings.number = 'Norm'; state.settings.norm = +v.at(-1); })),
    ]), state.settings.number),
    item('Fraction Result', () => choice('Fraction Result', ['Improper Fraction', 'Mixed Fraction'], state.settings.fraction, v => state.settings.fraction = v), '›'),
    item('Decimal Mark', () => choice('Decimal Mark', ['Dot', 'Comma'], state.settings.decimal, v => state.settings.decimal = v), '›'),
  ]);
}
function catalog() {
  const fn = (label, name) => item(label, () => { menuClose(); template('fn', name); });
  const literal = (label, text) => item(label, () => { menuClose(); insert(text); });
  menuOpen('CATALOG', [
    item('Function Analysis', () => menuOpen('Function Analysis', [fn('logarithm · log', 'log'), fn('natural log · ln', 'ln'), literal('e^(', 'exp('), fn('f(x)', 'f'), fn('g(x)', 'g')]), '›'),
    item('Probability', () => menuOpen('Probability', [literal('Factorial · !', '!'), literal('Combination · nCr', 'nCr'), literal('Permutation · nPr', 'nPr'), literal('Random Number', 'Ran()'), fn('Random Integer', 'RanInt'), literal('Percent · %', '%')]), '›'),
    item('Numeric Calc', () => menuOpen('Numeric Calc', [fn('Absolute Value', 'abs'), fn('Floor', 'floor'), fn('Ceiling', 'ceil')]), '›'),
    item('Hyperbolic/Trig', () => menuOpen('Hyperbolic/Trig', ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh'].map(name => fn(name, name))), '›'),
    item('Angle / Sexagesimal', () => menuOpen('Angle / Sexagesimal', [fn('Degree, Minute, Second', 'dms'), literal('π', 'pi')]), '›'),
  ], false);
}
function formatMenu() {
  if (!state.result || screenMode !== 'calc') return;
  const v = unpack(state.result), options = ['Standard', 'Decimal'];
  if (v.d.isInteger() && v.d.gte(1) && v.d.lte('9999999999')) options.push('Prime Factor');
  if (v.exact?.kind === 'rational' && v.exact.q.d !== 1n) options.push('Improper Fraction', 'Mixed Fraction');
  options.push('ENG Notation', 'Sexagesimal');
  menuOpen('FORMAT', options.map(name => item(name, () => { resultFormat = name; menuClose(); render(); })), false);
}
function variableMenu() {
  menuOpen('VARIABLE', 'ABCDEFxyz'.split('').map(name => item(name, () => {
    menuOpen(name + ' = ' + decimalText(unpack(state.variables[name] || '0')), [
      item('Recall', () => { menuClose(); insert(name); }),
      item('Store Result', () => { state.variables[name] = state.result || state.ans; menuClose(); save(); }),
      item('Edit', () => beginPrompt(name + '=', state.variables[name]?.d || '0', source => { state.variables[name] = pack(evaluate(source, context())); })),
    ]);
  }, decimalText(unpack(state.variables[name] || '0')))), false);
}
function functionMenu() {
  menuOpen('FUNCTION', [
    ...['f', 'g'].map(name => item(`Define ${name}(x)`, () => beginPrompt(`${name}(x)=`, state.functions[name], source => {
      // Validate syntax at two points; a domain error at a sample is permitted.
      if (new RegExp(`\\b${name}\\s*\\(`).test(source)) throw new CalcError('Circular ERROR');
      try { evaluate(source, { ...context(), variables: { ...state.variables, x: '1' } }); } catch (e) { if (e.message.includes('Syntax') || e.message.includes('Argument')) throw e; }
      state.functions[name] = source;
    }))),
    ...['f', 'g'].map(name => item(`${name}(x)`, () => { menuClose(); template('fn', name); })),
  ], false);
}
function toolsMenu() {
  if (screenMode.startsWith('stats')) menuOpen('TOOLS', [
    item(state.paired ? '2-Var Results' : '1-Var Results', showStatistics),
    ...(state.paired ? [item('Reg Results', regressionMenu)] : []),
    item('Select Type', chooseStatsType),
    item('Frequency', () => choice('Frequency', ['On', 'Off'], state.frequency ? 'On' : 'Off', v => { if (state.frequency !== (v === 'On')) state.stats = []; state.frequency = v === 'On'; selectedRow = selectedCol = 0; screenMode = 'stats-edit'; editor.clear(); })),
    item('Edit', () => menuOpen('Edit', [
      item('Insert Row', () => { if (state.stats.length >= statsLimit()) throw new CalcError('Range ERROR'); state.stats.splice(selectedRow, 0, ['0','0','1']); menuClose(); screenMode = 'stats-edit'; editor.clear(); save(); }),
      item('Delete Row', () => { state.stats.splice(selectedRow, 1); selectedRow = Math.min(selectedRow, state.stats.length); menuClose(); screenMode = 'stats-edit'; editor.clear(); save(); }),
      item('Delete All', () => menuOpen('Delete All Data?', [item('No', back), item('Yes', () => { state.stats = []; selectedRow = 0; editor.clear(); screenMode = 'stats-edit'; menuClose(); save(); })])),
    ])),
    item('Sort', () => menuOpen('Sort', statsColumns().flatMap(c => ['Ascending','Descending'].map(order => item(`${['x','y','Freq'][c]} ${order}`, () => { state.stats.sort((a,b) => new D(a[c] ?? 1).cmp(b[c] ?? 1) * (order === 'Ascending' ? 1 : -1)); selectedRow = 0; screenMode = 'stats-edit'; menuClose(); save(); }))))),
  ], false);
  else if (screenMode.startsWith('table')) menuOpen('TOOLS', [item('Table Type', () => choice('Table Type', ['f(x)', 'f(x)/g(x)'], state.table.dual ? 'f(x)/g(x)' : 'f(x)', v => { state.table.dual = v === 'f(x)/g(x)'; screenMode = 'table-setup'; selectedRow = 0; })), item('Table Range', () => { menuClose(); screenMode = 'table-setup'; selectedRow = state.table.dual ? 2 : 1; })], false);
  else if (screenMode.startsWith('box')) menuOpen('TOOLS', [item('Trial Settings', () => { menuClose(); screenMode = 'box-setup'; selectedRow = 0; }), item('Summary', () => {
    if (!boxResults.length) throw new CalcError('No Data');
    const totals = {}; boxResults.forEach(row => { const sum = row.reduce((a, b) => a + b, 0); totals[sum] = (totals[sum] || 0) + 1; });
    menuOpen(state.box.type === 'dice' ? 'Sum : frequency' : 'Heads : frequency', Object.entries(totals).map(([n, count]) => item(n, () => {}, String(count))));
  })], false);
  else functionMenu();
}
function move(direction) {
  error = '';
  const delta = direction === 'up' || direction === 'left' || direction === 'pageup' ? -1 : 1;
  if (menu) menu.index = Math.max(0, Math.min(menu.items.length - 1, menu.index + delta * (direction.startsWith('page') ? 4 : 1)));
  else if (screenMode === 'home') homeIndex = Math.max(0, Math.min(3, homeIndex + (direction === 'up' ? -3 : direction === 'down' ? 3 : delta)));
  else if (prompt) editor.move(direction);
  else if (screenMode === 'calc') {
    if ((direction === 'up' || direction === 'down') && !editor.path.length && state.history.length) {
      if (historyIndex < 0) historyIndex = state.history.length;
      historyIndex = Math.max(0, Math.min(state.history.length - 1, historyIndex + delta));
      editor.restore(state.history[historyIndex].nodes); state.result = state.history[historyIndex].result;
    } else { if (state.result) state.result = null; editor.move(direction); }
    state.expression = editor.snapshot();
  } else if (screenMode === 'stats-edit') {
    if (direction === 'left' || direction === 'right') { const cols = statsColumns(); selectedCol = cols[Math.max(0, Math.min(cols.length - 1, cols.indexOf(selectedCol) + delta))]; }
    else selectedRow = Math.max(0, Math.min(statsLimit() - 1, state.stats.length, selectedRow + delta));
    editor.clear();
  } else {
    const count = screenMode === 'table-setup' ? (state.table.dual ? 6 : 5) : screenMode === 'box-setup' ? 4 : screenMode === 'table-grid' ? tableRows.length : screenMode === 'stats-results' ? Object.keys(statResults).length : boxResults.length;
    selectedRow = Math.max(0, Math.min(count - 1, selectedRow + delta * (direction.startsWith('page') ? 4 : 1)));
  }
  render();
}
function press(key) {
  try {
    if (off && key !== 'ON') return;
    if (key === 'ON') { off = false; goHome(); return; }
    if (key === 'SHIFT') { shift = !shift; render(); return; }
    const shifted = shift; shift = false;
    if (key === 'HOME') { goHome(); return; }
    if (key === 'BACK') { back(); return; }
    if (['up', 'down', 'left', 'right', 'pageup', 'pagedown'].includes(key)) { move(key); return; }
    if (key === 'EXE' || key === 'OK') { execute(shifted); return; }
    if (key === 'AC') {
      if (shifted) { off = true; save(); }
      else if (menu) menuClose();
      else { error = ''; editor.clear(); if (screenMode === 'calc') { state.result = null; state.expression = []; } }
      render(); save(); return;
    }
    if (key === 'SETTINGS') { settingsMenu(); return; }
    if (key === 'CATALOG') { catalog(); return; }
    if (key === 'TOOLS') { toolsMenu(); return; }
    if (key === 'VARIABLE') { variableMenu(); return; }
    if (key === 'FUNCTION') { functionMenu(); return; }
    if (key === 'FORMAT') { formatMenu(); return; }
    if (menu) return;
    if (key === 'DEL') {
      if (screenMode === 'stats-edit' && !editor.source()) { state.stats.splice(selectedRow, 1); selectedRow = Math.min(selectedRow, state.stats.length); }
      else if (shifted) editor.overwrite = !editor.overwrite;
      else { if (screenMode === 'calc') state.result = null; editor.backspace(); }
      changed(); return;
    }
    if (key === ')' && editor.path.length) {
      const parent = editor.path.slice(0, -2), index = editor.path.at(-2), node = editor.slot(parent)[index];
      if (node.type === 'fn') { editor.path = parent; editor.pos = index + 1; changed(); return; }
    }
    if (shifted) {
      const blue = { '7': 'pi', '8': 'e', '4': 'A', '5': 'B', '6': 'C', '1': 'D', '2': 'E', '3': 'F', '0': 'x', '.': 'y', EXP: 'z', '-': '-' };
      if (blue[key]) { insert(blue[key]); return; }
      if (key === 'frac') { template('mixed'); return; }
      if (key === 'root') { template('nthroot'); return; }
      if (key === 'power') { template('power', '', '-1'); return; }
      if (key === 'square') { insert('log('); return; }
      if (key === 'logbase') { template('fn', 'ln'); return; }
      if (['sin', 'cos', 'tan'].includes(key)) { template('fn', 'a' + key); return; }
      if (key === '+') { template('fn', 'dms'); return; }
      if (key === 'x') { $('#help').showModal(); render(); return; }
    }
    if (key === 'frac') template('frac');
    else if (key === 'root') template('root');
    else if (key === 'power') template('power');
    else if (key === 'square') template('power', '', '2');
    else if (key === 'logbase') template('fn', 'log');
    else if (['sin', 'cos', 'tan'].includes(key)) template('fn', key);
    else if (key === 'EXP') insert('*10^');
    else insert(key);
  } catch (e) { error = e instanceof CalcError ? e.message : 'Math ERROR'; announce(error); render(); }
}
function render() {
  $('#lcd').classList.toggle('off', off);
  $('#lcd').style.backgroundColor = { Light: '#d9e5db', Normal: '#c6d9cd', Dark: '#a7c0b1' }[state.contrast || 'Normal'];
  $('#status').innerHTML = `<span>${shift ? 'S ' : ''}${state.settings.angle === 'Degree' ? 'D' : state.settings.angle === 'Radian' ? 'R' : 'G'} ${state.settings.io.startsWith('Math') ? 'Math' : ''} ${state.settings.number !== 'Norm' ? state.settings.number.toUpperCase() : ''}</span><span>${screenMode === 'home' ? '' : esc({ calc: 'Calculate', 'stats-edit': 'Statistics', 'stats-results': 'Statistics', 'table-setup': 'Table', 'table-grid': 'Table', 'box-setup': 'Math Box', 'box-results': 'Math Box' }[screenMode])} ▴▾</span>`;
  $('[data-key="SHIFT"]').classList.toggle('selected', shift);
  let html = '';
  if (error) html = `<div class="error-screen">${esc(error)}<small>◀ / ▶ : edit &nbsp; AC : clear</small></div>`;
  else if (menu) html = `<div class="screen-title">${esc(menu.title)}</div><div class="menu-list">${menu.items.map((m, i) => `<button type="button" class="menu-item ${i === menu.index ? 'selected' : ''}" data-menu="${i}"><span>${esc(m.label)}</span><small>${esc(m.detail || '')}</small></button>`).join('')}</div>`;
  else if (prompt) html = `<div class="screen-title">${esc(prompt.title)}</div>${expressionHTML()}<div class="tiny">EXE : confirm &nbsp; ↩ : cancel</div>`;
  else if (screenMode === 'home') {
    const icons = ['<span class="icon">×÷<br style="display:none">±</span>', '<svg viewBox="0 0 30 24"><path d="M2 1v21h27M6 20V10h5v10m3 0V4h5v16m3 0V8h5v12"/></svg>', '<svg viewBox="0 0 30 24"><path d="M2 3h26v19H2zM2 9h26M11 9v13M20 9v13M2 15h26"/></svg>', '<span class="icon">⚄◇</span>'];
    html = `<div class="home-grid">${['Calculate', 'Statistics', 'Table', 'Math Box'].map((name, i) => `<button class="home-item ${i === homeIndex ? 'selected' : ''}" data-app="${i}" type="button">${icons[i]}<span>${name}</span></button>`).join('')}</div>`;
  } else if (screenMode === 'calc') html = `${expressionHTML(!state.result)}<div class="result" aria-label="Result">${state.result ? resultHTML(unpack(state.result)) : ''}</div>`;
  else if (screenMode === 'stats-edit') {
    const start = Math.max(0, selectedRow - 2), rows = Array.from({ length: Math.min(4, Math.max(state.stats.length + 1 - start, 1)) }, (_, i) => start + i);
    html = `<div class="grid-wrap"><table class="table"><tr><th></th>${statsColumns().map(c => `<th>${['x','y','Freq'][c]}</th>`).join('')}</tr>${rows.map(i => `<tr><th>${i + 1}</th>${statsColumns().map(c => `<td data-cell="${i},${c}" class="${i === selectedRow && c === selectedCol ? 'selected' : ''}">${state.stats[i] ? esc(decimalText(value(state.stats[i][c] ?? 1))) : ''}</td>`).join('')}</tr>`).join('')}</table></div><div class="entry-line">${['x','y','Freq'][selectedCol]}=${expressionHTML()}</div>`;
  } else if (screenMode === 'stats-results') html = `<div class="screen-title">${esc(statTitle)}</div><div class="result-list">${Object.entries(statResults).map(([name, v], i) => `<div class="result-row ${i === selectedRow ? 'selected' : ''}"><span>${esc(name)}</span><span>${esc(decimalText(value(v)))}</span></div>`).join('')}</div>`;
  else if (screenMode === 'table-setup') {
    const fields = [['f(x)', state.functions.f || 'Define'], ...(state.table.dual ? [['g(x)', state.functions.g || 'Define']] : []), ['Start', state.table.start], ['End', state.table.end], ['Step', state.table.step], ['Generate', 'EXE']];
    html = `<div class="screen-title">Table · ${state.table.dual ? 'f(x), g(x)' : 'f(x)'}</div><div class="menu-list">${fields.map(([k, v], i) => `<button type="button" class="menu-item ${i === selectedRow ? 'selected' : ''}" data-table="${i}"><span>${esc(k)}</span><small>${esc(v)}</small></button>`).join('')}</div>`;
  } else if (screenMode === 'table-grid') {
    const start = Math.max(0, selectedRow - 3);
    html = `<table class="table"><tr><th>x</th><th>f(x)</th>${state.table.dual ? '<th>g(x)</th>' : ''}</tr>${tableRows.slice(start, start + 5).map((r, i) => `<tr class="${i + start === selectedRow ? 'selected' : ''}"><td>${esc(decimalText(value(r.x)))}</td><td>${r.f ? esc(decimalText(unpack(r.f))) : 'ERROR'}</td>${state.table.dual ? `<td>${r.g ? esc(decimalText(unpack(r.g))) : 'ERROR'}</td>` : ''}</tr>`).join('')}</table>`;
  } else if (screenMode === 'box-setup') {
    const fields = [['Type', state.box.type === 'dice' ? 'Dice Roll' : 'Coin Toss'], [state.box.type === 'dice' ? 'Dice' : 'Coins', state.box.count], ['Attempts', state.box.trials], ['Execute', 'EXE']];
    html = `<div class="screen-title">Math Box</div><div class="menu-list">${fields.map(([k, v], i) => `<button type="button" class="menu-item ${i === selectedRow ? 'selected' : ''}" data-box="${i}"><span>${esc(k)}</span><small>${esc(v)}</small></button>`).join('')}</div>`;
  } else if (screenMode === 'box-results') {
    const start = Math.max(0, selectedRow - 2);
    html = `<div class="screen-title">${state.box.type === 'dice' ? 'Dice Roll' : 'Coin Toss'} · ${state.box.trials} attempts</div><table class="table">${boxResults.slice(start, start + 4).map((row, i) => `<tr class="${i + start === selectedRow ? 'selected' : ''}"><th>${i + start + 1}</th>${row.map(v => `<td>${state.box.type === 'dice' ? v : v ? 'H' : 'T'}</td>`).join('')}<td>Σ ${row.reduce((a, b) => a + b, 0)}</td></tr>`).join('')}</table>`;
  }
  $('#screen').innerHTML = html;
  const selected = $('#screen .menu-item.selected, #screen .result-row.selected');
  if (selected) selected.scrollIntoView({ block: 'nearest' });
  const caret = $('#screen .caret'); if (caret) caret.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function keyHTML(key, label, legend = '', classes = '') {
  return `<div class="key-wrap ${classes}">${legend ? `<span class="legend ${key === 'SHIFT' ? 'shift-label' : ''}">${legend}</span>` : ''}<button type="button" class="key ${['ON', 'HOME', 'SETTINGS', 'BACK', 'up', 'down', 'left', 'right', 'OK', 'pageup', 'pagedown'].includes(key) ? 'dark' : key === 'SHIFT' ? 'shift' : ''}" data-key="${esc(key)}" aria-label="${esc(({ frac: 'Fraction', mixed: 'Mixed fraction', root: 'Square root', power: 'Power', square: 'Square', logbase: 'Logarithm with base', DEL: 'Delete', AC: 'All clear', EXP: 'Times ten to a power', BACK: 'Back', '*': 'Multiply', '/': 'Divide', '-': 'Subtract', '+': 'Add', up: 'Up', down: 'Down', left: 'Left', right: 'Right', pageup: 'Page up', pagedown: 'Page down' })[key] || key)}">${label}</button></div>`;
}
$('#navigation').innerHTML = [
  ['ON', '⏻', 'ON', 'on'], ['HOME', '⌂', 'HOME', 'home'], ['up', '⌃', '', 'up'], ['pageup', '⌃', '', 'pageup'],
  ['SETTINGS', '☷', 'SETTINGS', 'settings'], ['BACK', '↩', '', 'back'], ['left', '‹', '', 'left'], ['OK', 'OK', '', 'ok'], ['right', '›', '', 'right'], ['pagedown', '⌄', '', 'pagedown'],
  ['SHIFT', '⇧', 'SHIFT', 'shift-wrap'], ['VARIABLE', '⇄x', 'VARIABLE', 'variable'], ['FUNCTION', '<i>f</i>(x)', 'FUNCTION', 'function'], ['down', '⌄', '', 'down'], ['CATALOG', '▱', 'CATALOG', 'catalog'], ['TOOLS', '•••', 'TOOLS', 'tools'],
].map(args => keyHTML(...args)).join('');
$('#scientific').innerHTML = [
  ['x', '<i>x</i>', 'QR'], ['frac', '<span class="key-frac"><span>▪</span><span>▪</span></span>', '▪ ▫/▫'], ['root', '√▪', 'ⁿ√▫'], ['power', '▪<sup>▫</sup>', 'x⁻¹'], ['square', '▪<sup>2</sup>', 'log'], ['logbase', 'log<sub>▫</sub>▫', 'ln'],
  ['Ans', 'Ans', ''], ['sin', 'sin', 'sin⁻¹'], ['cos', 'cos', 'cos⁻¹'], ['tan', 'tan', 'tan⁻¹'], ['(', '(', ''], [')', ')', ''],
].map(args => keyHTML(...args)).join('');
$('#numeric').innerHTML = [
  ['7', '7', 'π'], ['8', '8', 'e'], ['9', '9'], ['DEL', '⌫', 'INS'], ['AC', 'AC', 'OFF'],
  ['4', '4', 'A'], ['5', '5', 'B'], ['6', '6', 'C'], ['*', '×'], ['/', '÷'],
  ['1', '1', 'D'], ['2', '2', 'E'], ['3', '3', 'F'], ['+', '+', '° ′ ″'], ['-', '−', '(−)'],
  ['0', '0', 'x'], ['.', '. ', 'y'], ['EXP', '×10<sup>▫</sup>', 'z'], ['FORMAT', '↶<br>FORMAT<br>↪'], ['EXE', 'EXE', '≈'],
].map(args => keyHTML(...args)).join('');
document.addEventListener('click', event => {
  const key = event.target.closest('[data-key]'); if (key) { press(key.dataset.key); return; }
  const app = event.target.closest('[data-app]'); if (app) { selectApp(+app.dataset.app); return; }
  const m = event.target.closest('[data-menu]'); if (m) { menu.index = +m.dataset.menu; press('EXE'); return; }
  const table = event.target.closest('[data-table]'); if (table) { selectedRow = +table.dataset.table; press('EXE'); return; }
  const box = event.target.closest('[data-box]'); if (box) { selectedRow = +box.dataset.box; press('EXE'); return; }
  const cell = event.target.closest('[data-cell]'); if (cell) { [selectedRow, selectedCol] = cell.dataset.cell.split(',').map(Number); editor.clear(); render(); return; }
  const slot = event.target.closest('[data-path]'); if (slot) { editor.path = JSON.parse(slot.dataset.path); editor.pos = editor.slot().length; if (screenMode === 'calc') state.result = null; render(); }
});
document.addEventListener('keydown', event => {
  if ($('#help').open || event.ctrlKey || event.metaKey || event.altKey || event.key === 'Tab') return;
  const map = { Enter: 'EXE', Backspace: 'DEL', Delete: 'AC', Escape: 'BACK', ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', PageUp: 'pageup', PageDown: 'pagedown', F1: 'HOME', F2: 'SETTINGS', F3: 'CATALOG', F4: 'FORMAT', '^': 'power' };
  const key = map[event.key] || (/^[0-9.()+\-*/%!A-Fxyz]$/.test(event.key) ? event.key : null);
  if (!key) return;
  // Let focused controls retain native Space/Enter activation for accessibility.
  if (event.key === 'Enter' && document.activeElement?.matches('#screen button')) return;
  event.preventDefault();
  if (event.key === 'Escape' && !menu && !prompt && !error && ['home', 'calc'].includes(screenMode) && window.parent !== window) window.parent.postMessage({ type: 'cw-close' }, location.origin);
  else press(key);
});
document.addEventListener('paste', event => {
  if ($('#help').open || !['calc', 'stats-edit'].includes(screenMode) && !prompt) return;
  const text = event.clipboardData.getData('text').trim(); if (!text || text.length > 2048) return;
  event.preventDefault(); editor.setText(text); if (screenMode === 'calc') state.result = null; changed();
});
$('#about').addEventListener('click', () => $('#help').showModal());
function fit() {
  const width = document.documentElement.clientWidth - 16;
  const scale = Math.max(.3, Math.min(1.4, width / 360, (innerHeight - 43) / 750));
  $('#calculator').style.transform = `scale(${scale})`;
  $('#calculator-fit').style.width = 360 * scale + 'px'; $('#calculator-fit').style.height = 750 * scale + 'px';
}
new ResizeObserver(fit).observe(document.documentElement);
window.addEventListener('pagehide', save);
fit(); render();
