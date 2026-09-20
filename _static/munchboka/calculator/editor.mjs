/* Structured natural-display editor. A cursor addresses a slot, never HTML. */
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const sequenceSource = nodes => nodes.map(n => {
  if (typeof n === 'string') return n;
  const a = n.args.map(sequenceSource);
  if (n.type === 'frac') return `((${a[0]})/(${a[1]}))`;
  if (n.type === 'mixed') return `((${a[0]})+((${a[1]})/(${a[2]})))`;
  if (n.type === 'power') return `((${a[0]})^(${a[1]}))`;
  if (n.type === 'root') return `sqrt(${a[0]})`;
  if (n.type === 'nthroot') return `root(${a[0]},${a[1]})`;
  return `${n.name}(${a.join(',')})`;
}).join('');
export class Editor {
  constructor() { this.clear(); }
  clear() { this.nodes = []; this.path = []; this.pos = 0; this.overwrite = false; }
  slot(path = this.path) { let s = this.nodes; for (let i = 0; i < path.length; i += 2) s = s[path[i]].args[path[i + 1]]; return s; }
  source() { return sequenceSource(this.nodes); }
  snapshot() { return JSON.parse(JSON.stringify(this.nodes)); }
  restore(nodes) { this.nodes = JSON.parse(JSON.stringify(nodes)); this.path = []; this.pos = this.nodes.length; }
  setText(text) { this.nodes = [...text]; this.path = []; this.pos = this.nodes.length; }
  insert(text) { this.slot().splice(this.pos, this.overwrite ? 1 : 0, text); this.pos++; }
  atom() {
    const s = this.slot(), end = this.pos; let start = end;
    if (!end) return [];
    const last = s[end - 1];
    if (typeof last === 'object') start--;
    else if (/^[\d.]$/.test(last)) { while (start && typeof s[start - 1] === 'string' && /^[\d.]$/.test(s[start - 1])) start--; }
    else if (last === ')') { let depth = 1; start--; while (start && depth) { start--; if (s[start] === ')') depth++; if (s[start] === '(') depth--; } }
    else if (/^(Ans|pi|π|e|[A-Fxyz])$/.test(last)) start--;
    const out = s.splice(start, end - start); this.pos = start; return out;
  }
  template(type, name = '', fixed = null) {
    let args, focus = 0;
    if (type === 'power') { args = [this.atom(), fixed ? [fixed] : []]; focus = args[0].length ? 1 : 0; }
    else if (type === 'frac') { args = [this.atom(), []]; focus = args[0].length ? 1 : 0; }
    else if (type === 'mixed') args = [[], [], []];
    else if (type === 'nthroot') args = [[], []];
    else if (name === 'log') args = [[], []];
    else if (name === 'RanInt') args = [[], []];
    else if (name === 'dms') args = [[], [], []];
    else args = [[]];
    const idx = this.pos; this.slot().splice(idx, 0, { type, name, args });
    if (fixed && args[0].length) this.pos++;
    else { this.path = [...this.path, idx, focus]; this.pos = args[focus].length; }
  }
  stops() {
    const out = [];
    const visit = (s, path) => { out.push({ path, pos: 0 }); s.forEach((node, i) => { if (typeof node === 'object') node.args.forEach((a, j) => visit(a, [...path, i, j])); out.push({ path, pos: i + 1 }); }); };
    visit(this.nodes, []); return out;
  }
  move(direction) {
    if ((direction === 'up' || direction === 'down') && this.path.length) {
      const path = this.path.slice(), arg = path.pop(), idx = path.pop();
      const node = this.slot(path)[idx], next = arg + (direction === 'down' ? 1 : -1);
      if (next >= 0 && next < node.args.length) { this.path = [...path, idx, next]; this.pos = Math.min(this.pos, this.slot().length); return; }
    }
    const stops = this.stops(), key = JSON.stringify(this.path);
    const index = stops.findIndex(p => p.pos === this.pos && JSON.stringify(p.path) === key);
    const next = stops[Math.max(0, Math.min(stops.length - 1, index + (direction === 'left' || direction === 'up' ? -1 : 1)))];
    this.path = next.path; this.pos = next.pos;
  }
  backspace() {
    if (this.pos) { this.slot().splice(--this.pos, 1); }
    else if (this.path.length) {
      const parent = this.path.slice(0, -2), idx = this.path.at(-2), node = this.slot(parent)[idx];
      if (node.args.every(a => !a.length)) { this.slot(parent).splice(idx, 1); this.path = parent; this.pos = idx; }
      else this.move('left');
    }
  }
  html(active = true) {
    const current = JSON.stringify(this.path);
    const render = (s, path) => {
      const selected = JSON.stringify(path) === current;
      const caret = i => active && selected && i === this.pos ? '<span class="caret" aria-hidden="true"></span>' : '';
      const token = n => {
        if (typeof n === 'string') return `<span class="token">${esc(n === '*' ? '×' : n === '/' ? '÷' : n === 'pi' ? 'π' : n === '-' ? '−' : n)}</span>`;
        return '';
      };
      let html = caret(0);
      s.forEach((n, i) => {
        if (typeof n === 'string') html += token(n);
        else {
          const a = n.args.map((v, j) => render(v, [...path, i, j]));
          if (n.type === 'frac') html += `<span class="fraction"><span>${a[0]}</span><span>${a[1]}</span></span>`;
          else if (n.type === 'mixed') html += `<span class="mixed">${a[0]}<span class="fraction"><span>${a[1]}</span><span>${a[2]}</span></span></span>`;
          else if (n.type === 'power') html += `<span class="power">${a[0]}<sup>${a[1]}</sup></span>`;
          else if (n.type === 'root') html += `<span class="radical">√<span>${a[0]}</span></span>`;
          else if (n.type === 'nthroot') html += `<span class="radical"><sup>${a[0]}</sup>√<span>${a[1]}</span></span>`;
          else if (n.name === 'log') html += `<span>log<sub>${a[0]}</sub>(${a[1]})</span>`;
          else { const name = { asin: 'sin⁻¹', acos: 'cos⁻¹', atan: 'tan⁻¹' }[n.name] || n.name; html += `<span class="function">${esc(name)}(${a.join(',')})</span>`; }
        }
        html += caret(i + 1);
      });
      if (!s.length) html += '<span class="placeholder">□</span>';
      return `<span class="math-slot" data-path="${esc(JSON.stringify(path))}">${html}</span>`;
    };
    return render(this.nodes, []);
  }
}
