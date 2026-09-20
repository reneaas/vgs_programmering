/* Independent CW-style calculator. MIT; see the repository LICENSE.
 * No eval/Function: expressions are parsed with an explicit function allowlist.
 */
import Decimal from './vendor/decimal.mjs';
export const D = Decimal.clone({ precision: 23, rounding: Decimal.ROUND_HALF_UP });
const PI = D.acos(-1);
export class CalcError extends Error {
  constructor(message = 'Math ERROR', position = 0) { super(message); this.position = position; }
}
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
function q(n, d = 1n) {
  if (!d) throw new CalcError();
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d); return { n: n / g, d: d / g };
}
const qa = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
const qm = (a, b) => q(a.n * b.n, a.d * b.d);
const qi = a => q(a.d, a.n);
const qr = x => ({ q: x, kind: 'rational' });
function rational(s) {
  const [mantissa, exp = '0'] = String(s).toLowerCase().split('e');
  const places = (mantissa.split('.')[1] || '').length - Number(exp);
  const n = BigInt(mantissa.replace('.', ''));
  return places >= 0 ? q(n, 10n ** BigInt(places)) : q(n * 10n ** BigInt(-places));
}
export function value(d, exact = null) {
  d = new D(d);
  if (!d.isFinite() || d.abs().gte('1e100')) throw new CalcError();
  if (!d.isZero() && d.abs().lt('1e-99')) return { d: new D(0), exact: qr(q(0n)) };
  if (exact && (exact.q.n.toString().length > 160 || exact.q.d.toString().length > 160)) exact = null;
  if (exact?.q.n === 0n) exact = qr(q(0n));
  return { d, exact };
}
const number = s => value(s, qr(rational(s)));
const basisEqual = (a, b) => a.kind === b.kind && a.rad === b.rad;
function neg(a) { return value(a.d.neg(), a.exact ? { ...a.exact, q: q(-a.exact.q.n, a.exact.q.d) } : null); }
function sqrtExact(r) {
  if (r.n < 0n) return null;
  let rad = r.n * r.d;
  if (rad > 10000000000n) return null;
  let factor = 1n;
  for (let i = 2n; i * i <= rad; i++) while (rad % (i * i) === 0n) { rad /= i * i; factor *= i; }
  return rad === 1n || rad === 0n ? qr(q(factor * rad, r.d)) : { kind: 'root', rad: Number(rad), q: q(factor, r.d) };
}
function binary(op, a, b) {
  let d, e = null; const x = a.exact, y = b.exact;
  if (op === '+' || op === '-') {
    if (op === '-') b = neg(b);
    d = a.d.add(b.d);
    if (x && b.exact && basisEqual(x, b.exact)) e = { ...x, q: qa(x.q, b.exact.q) };
    else if (a.d.isZero()) e = b.exact;
    else if (b.d.isZero()) e = x;
  } else if (op === '*' || op === '/') {
    if (op === '/' && b.d.isZero()) throw new CalcError();
    d = op === '*' ? a.d.mul(b.d) : a.d.div(b.d);
    if (x && y) {
      const coeff = qm(x.q, op === '*' ? y.q : qi(y.q));
      if (y.kind === 'rational') e = { ...x, q: coeff };
      else if (x.kind === 'rational' && op === '*') e = { ...y, q: coeff };
      else if (basisEqual(x, y) && op === '/') e = qr(coeff);
      else if (x.kind === 'root' && y.kind === 'root') {
        const base = op === '*' ? q(BigInt(x.rad * y.rad)) : q(BigInt(x.rad), BigInt(y.rad));
        const root = sqrtExact(base); if (root) e = { ...root, q: qm(coeff, root.q) };
      } else if (x.kind === 'rational' && y.kind === 'root' && op === '/') e = { ...y, q: qm(coeff, q(1n, BigInt(y.rad))) };
    }
  } else if (op === '^') {
    if (a.d.isZero() && b.d.lte(0)) throw new CalcError();
    if (a.d.isNegative() && !b.d.isInteger()) {
      if (y?.kind !== 'rational' || y.q.d % 2n === 0n) throw new CalcError();
      d = a.d.neg().pow(b.d).mul(y.q.n % 2n ? -1 : 1);
    } else d = a.d.pow(b.d);
    if (x?.kind === 'rational' && b.d.isInteger() && b.d.abs().lte(100)) {
      const n = BigInt(b.d.abs().toFixed(0)); const r = q(x.q.n ** n, x.q.d ** n);
      e = qr(b.d.isNegative() ? qi(r) : r);
    } else if (b.d.eq(2) && x?.kind === 'root') e = qr(qm(qm(x.q, x.q), q(BigInt(x.rad))));
    else if (b.d.eq('0.5') && x?.kind === 'rational') e = sqrtExact(x.q);
  } else if (op === 'nCr' || op === 'nPr') {
    if (!a.d.isInteger() || !b.d.isInteger() || b.d.lt(0) || a.d.lt(b.d) || a.d.gte('1e10')) throw new CalcError();
    const r = op === 'nCr' ? D.min(b.d, a.d.sub(b.d)).toNumber() : b.d.toNumber();
    if (r > 10000) throw new CalcError();
    let integer = 1n; const n = BigInt(a.d.toFixed(0));
    for (let i = 1n; i <= BigInt(r); i++) {
      integer *= n - i + 1n; if (op === 'nCr') integer /= i;
      if (integer.toString().length > 100) throw new CalcError();
    }
    d = new D(integer.toString()); e = qr(q(integer));
  }
  return value(d, e);
}
function call(name, args, ctx) {
  const a = args[0], b = args[1];
  const arities = { log: [1, 2], root: [2], RanInt: [2], f: [1], g: [1], Ran: [0], dms: [3] };
  if (!(arities[name] || [1]).includes(args.length)) throw new CalcError('Argument ERROR');
  const factor = ctx.angle === 'Radian' ? new D(1) : PI.div(ctx.angle === 'Gradian' ? 200 : 180);
  let d, e = null;
  if (['sin', 'cos', 'tan'].includes(name)) {
    const z = a.d.mul(factor);
    const limit = ctx.angle === 'Radian' ? '157079632.7' : ctx.angle === 'Gradian' ? '1e10' : '9e9';
    if (a.d.abs().gte(limit)) throw new CalcError();
    const cosine = D.cos(z);
    if (name === 'tan' && cosine.abs().lt('1e-20')) throw new CalcError();
    d = D[name](z);
    // Known exact special angles. Do not guess radicals for general results.
    const turns = a.d.mul(ctx.angle === 'Radian' ? new D(180).div(PI) : ctx.angle === 'Gradian' ? '0.9' : 1).mod(360).add(360).mod(360);
    const angle = turns.toNumber();
    const specials = name === 'tan' ? [0, 30, 45, 60, 120, 135, 150, 180, 210, 225, 240, 300, 315, 330] : [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
    if (specials.some(n => Math.abs(n - angle) < 1e-12)) {
      const abs = Math.abs(d.toNumber()), sign = d.isNegative() ? -1n : 1n;
      if (abs < 1e-20) { d = new D(0); e = qr(q(0n)); }
      else if (Math.abs(abs - 1) < 1e-14) e = qr(q(sign));
      else if (Math.abs(abs - 0.5) < 1e-14) e = qr(q(sign, 2n));
      else if (Math.abs(abs - Math.SQRT1_2) < 1e-14) e = { kind: 'root', rad: 2, q: q(sign, 2n) };
      else if (Math.abs(abs - Math.sqrt(3) / 2) < 1e-14) e = { kind: 'root', rad: 3, q: q(sign, 2n) };
      else if (Math.abs(abs - Math.sqrt(3)) < 1e-14) e = { kind: 'root', rad: 3, q: q(sign) };
      else if (Math.abs(abs - 1 / Math.sqrt(3)) < 1e-14) e = { kind: 'root', rad: 3, q: q(sign, 3n) };
    }
  } else if (['asin', 'acos', 'atan'].includes(name)) {
    d = D[name](a.d).div(factor);
    // Exact familiar inverse-trig outputs, expressed in the selected angle unit.
    const degree = D[name](a.d).mul(180).div(PI);
    if (degree.sub(degree.round()).abs().lt('1e-20') && degree.round().mod(15).isZero()) {
      const degrees = rational(degree.round().toFixed(0));
      e = ctx.angle === 'Radian' ? { kind: 'pi', q: qm(degrees, q(1n, 180n)) } : qr(ctx.angle === 'Gradian' ? qm(degrees, q(10n, 9n)) : degrees);
    }
  } else if (name === 'sqrt') { d = a.d.sqrt(); if (a.exact?.kind === 'rational') e = sqrtExact(a.exact.q); }
  else if (name === 'root') return binary('^', b, binary('/', number('1'), a));
  else if (name === 'log') { d = b ? b.d.log(a.d) : a.d.log(10); if (d.isInteger()) e = qr(rational(d.toFixed(0))); }
  else if (name === 'ln') { d = a.d.ln(); if (d.isZero()) e = qr(q(0n)); }
  else if (['sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh', 'exp'].includes(name)) d = D[name](a.d);
  else if (name === 'abs') return a.d.isNegative() ? neg(a) : a;
  else if (name === 'floor' || name === 'ceil') { d = a.d[name](); e = qr(rational(d.toFixed(0))); }
  else if (name === 'Ran') d = new D(Math.floor((ctx.random || Math.random)() * 1000)).div(1000);
  else if (name === 'RanInt') {
    if (!a.d.isInteger() || !b.d.isInteger() || a.d.gte(b.d) || a.d.abs().gte('1e10') || b.d.abs().gte('1e10') || b.d.sub(a.d).gte('1e10')) throw new CalcError();
    d = a.d.add(Math.floor((ctx.random || Math.random)() * b.d.sub(a.d).add(1).toNumber())); e = qr(rational(d.toFixed(0)));
  } else if (name === 'dms') { d = a.d.abs().add(b.d.div(60)).add(args[2].d.div(3600)).mul(a.d.isNegative() ? -1 : 1); }
  else if (name === 'f' || name === 'g') {
    if (!ctx.functions?.[name] || (ctx.level || 0) >= 8) throw new CalcError('Circular ERROR');
    return evaluate(ctx.functions[name], { ...ctx, variables: { ...ctx.variables, x: pack(a) }, level: (ctx.level || 0) + 1 });
  } else throw new CalcError('Syntax ERROR');
  return value(d, e);
}
const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'root', 'log', 'ln', 'exp', 'abs', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh', 'floor', 'ceil', 'Ran', 'RanInt', 'dms', 'f', 'g']);
export function evaluate(source, options = {}) {
  const ctx = { angle: 'Degree', ...options };
  if (typeof source !== 'string' || source.length > 2048) throw new CalcError('Stack ERROR');
  source = source.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-').replaceAll('π', 'pi');
  const tokens = []; let offset = 0;
  while (offset < source.length) {
    if (/\s/.test(source[offset])) { offset++; continue; }
    const m = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?|^(?:nCr|nPr|[A-Za-z]+)|^[()+\-*/^!%,]/.exec(source.slice(offset));
    if (!m) throw new CalcError('Syntax ERROR', offset);
    tokens.push({ s: m[0], pos: offset }); offset += m[0].length;
    if (tokens.length > 512) throw new CalcError('Stack ERROR', offset);
  }
  let index = 0, depth = 0;
  const peek = () => tokens[index]?.s;
  const fail = () => { throw new CalcError('Syntax ERROR', tokens[index]?.pos ?? source.length); };
  function expression(min = 0) {
    if (++depth > 48) throw new CalcError('Stack ERROR');
    const t = peek(); index++; let a;
    if (t === '-' || t === '+') { a = expression(40); if (t === '-') a = neg(a); }
    else if (t === '(') { a = expression(); if (peek() === ')') index++; else if (peek() !== undefined) fail(); }
    else if (t && /^(\d|\.)/.test(t)) {
      if (Math.abs(Number(t.split(/[eE]/)[1] || 0)) > 999) throw new CalcError();
      a = number(t);
    } else if (FUNCTIONS.has(t)) {
      if (peek() !== '(') fail(); index++; const args = [];
      if (peek() !== ')') {
        args.push(expression());
        while (peek() === ',') { index++; args.push(expression()); if (args.length > 3) fail(); }
      }
      if (peek() === ')') index++; else if (peek() !== undefined) fail();
      a = call(t, args, ctx);
    } else if (t === 'pi') a = value(PI, { kind: 'pi', q: q(1n) });
    else if (t === 'e') a = value(D.exp(1));
    else if (t === 'Ans') a = unpack(ctx.ans || { d: '0' });
    else if (/^[A-Fxyz]$/.test(t || '')) a = unpack(ctx.variables?.[t] || { d: '0' });
    else fail();
    while (index < tokens.length) {
      const op = peek();
      if (op === '!' || op === '%') {
        if (50 < min) break; index++;
        if (op === '%') a = binary('/', a, number('100'));
        else {
          if (!a.d.isInteger() || a.d.lt(0) || a.d.gt(69)) throw new CalcError();
          let n = 1n; for (let k = 2n; k <= BigInt(a.d.toFixed(0)); k++) n *= k;
          a = value(n.toString(), qr(q(n)));
        }
        continue;
      }
      const implicit = op === '(' || FUNCTIONS.has(op) || /^(?:pi|e|Ans|[A-Fxyz])$/.test(op);
      const precedence = implicit ? 30 : ({ '+': 10, '-': 10, '*': 20, '/': 20, nCr: 25, nPr: 25, '^': 50 })[op];
      if (precedence === undefined || precedence < min) break;
      if (!implicit) index++;
      a = binary(implicit ? '*' : op, a, expression(op === '^' ? precedence : precedence + 1));
    }
    depth--; return a;
  }
  try { const out = expression(); if (index !== tokens.length) fail(); return out; }
  catch (err) { if (err instanceof CalcError) throw err; throw new CalcError('Math ERROR', tokens[index]?.pos ?? source.length); }
}
export function pack(v) {
  return { d: v.d.toString(), exact: v.exact ? { ...v.exact, q: { n: String(v.exact.q.n), d: String(v.exact.q.d) } } : null };
}
export function unpack(v) {
  if (typeof v === 'string' || typeof v === 'number') return number(String(v));
  return value(v.d, v.exact ? { ...v.exact, q: q(BigInt(v.exact.q.n), BigInt(v.exact.q.d)) } : null);
}
export function decimalText(v, settings = {}) {
  const x = v.d; let s;
  if (settings.number === 'Fix') s = x.toFixed(settings.digits ?? 3);
  else if (settings.number === 'Sci') s = x.toExponential((settings.digits ?? 3) - 1);
  else if (!x.isZero() && (x.abs().lt(settings.norm === 2 ? '1e-9' : '.01') || x.abs().gte('1e10'))) s = x.toSignificantDigits(10).toExponential();
  else s = x.toSignificantDigits(10).toFixed();
  if (settings.decimal === 'Comma') s = s.replace('.', ',');
  return s.replace(/e\+?(-?\d+)/, '×10^$1');
}
export function resultParts(v, settings = {}, format = 'Standard') {
  const e = v.exact;
  if (format === 'Prime Factor') {
    if (!v.d.isInteger() || v.d.lt(1) || v.d.gt('9999999999')) throw new CalcError('Range ERROR');
    let n = v.d.toNumber(); const terms = [];
    for (let i = 2; i * i <= n; i++) { let count = 0; while (n % i === 0) { n /= i; count++; } if (count) terms.push(count > 1 ? `${i}^${count}` : String(i)); }
    if (n > 1 || !terms.length) terms.push(String(n)); return { text: terms.join('×') };
  }
  if (format === 'Sexagesimal') {
    let total = v.d.abs().mul(3600).toDecimalPlaces(2), deg = total.div(3600).floor();
    total = total.sub(deg.mul(3600)); const min = total.div(60).floor(), sec = total.sub(min.mul(60));
    return { text: `${v.d.isNegative() ? '−' : ''}${deg}°${min}′${sec}″` };
  }
  if (format === 'ENG Notation') {
    const exp = v.d.isZero() ? 0 : Math.floor(v.d.e / 3) * 3;
    return { text: `${v.d.div(new D(10).pow(exp)).toSignificantDigits(10)}×10^${exp}` };
  }
  const decimal = format === 'Decimal' || (format === 'Standard' && (settings.io?.includes('Decimal') || ['Fix', 'Sci'].includes(settings.number)));
  if (!decimal && e && e.q.n.toString().length + e.q.d.toString().length <= 12) {
    const suffix = e.kind === 'pi' ? 'π' : e.kind === 'root' ? `√${e.rad}` : '';
    let n = e.q.n, d = e.q.d, whole = '';
    if ((format === 'Mixed Fraction' || (format === 'Standard' && settings.fraction === 'Mixed Fraction')) && e.kind === 'rational' && d !== 1n && (n >= d || n <= -d)) {
      whole = String(n / d); n = n < 0n ? -(n % d) : n % d;
    }
    const numerator = suffix ? `${n === 1n ? '' : n === -1n ? '−' : n}${suffix}` : String(n);
    if (d === 1n || n === 0n) return { text: (whole || '') + numerator };
    return { numerator, denominator: String(d), whole };
  }
  return { text: decimalText(v, settings) };
}
function samples(rows, frequency) {
  const out = rows.map(r => ({ x: new D(r[0]), y: new D(r[1] || 0), w: new D(frequency ? r[2] ?? 1 : 1) }));
  if (out.some(r => !r.x.isFinite() || !r.y.isFinite() || !r.w.isInteger() || r.w.lt(0) || r.w.gte('1e10'))) throw new CalcError();
  return out.filter(r => !r.w.isZero());
}
export function statistics(rows, paired = false, frequency = false) {
  const data = samples(rows, frequency);
  if (!data.length) throw new CalcError('No Data');
  const sum = fn => data.reduce((s, r) => s.add(fn(r).mul(r.w)), new D(0));
  const n = sum(() => new D(1)), sx = sum(r => r.x), mean = sx.div(n), ss = sum(r => r.x.sub(mean).pow(2));
  const sorted = data.slice().sort((a, b) => a.x.cmp(b.x));
  const at = index => { let total = new D(0); for (const r of sorted) { total = total.add(r.w); if (total.gt(index)) return r.x; } return sorted.at(-1).x; };
  const count = n.toNumber();
  const median = (start, length) => length % 2 ? at(start + (length - 1)/2) : at(start + length/2 - 1).add(at(start + length/2)).div(2);
  const half = Math.floor(count / 2);
  const out = { n, 'x̄': mean, 'Σx': sx, 'Σx²': sum(r => r.x.pow(2)), 'σx': ss.div(n).sqrt(), 'σx²': ss.div(n) };
  if (count > 1) { out.sx = ss.div(n.sub(1)).sqrt(); out['sx²'] = ss.div(n.sub(1)); }
  out.minX = sorted[0].x; out.Q1 = half ? median(0, half) : sorted[0].x; out.Med = median(0, count); out.Q3 = half ? median(count - half, half) : sorted[0].x; out.maxX = sorted.at(-1).x;
  if (paired) {
    const sy = sum(r => r.y), my = sy.div(n), yy = sum(r => r.y.sub(my).pow(2)), xy = sum(r => r.x.sub(mean).mul(r.y.sub(my)));
    Object.assign(out, { 'ȳ': my, 'Σy': sy, 'Σy²': sum(r => r.y.pow(2)), 'Σxy': sum(r => r.x.mul(r.y)), 'Σx³': sum(r => r.x.pow(3)), 'Σx⁴': sum(r => r.x.pow(4)), 'Σx²y': sum(r => r.x.pow(2).mul(r.y)), 'σy': yy.div(n).sqrt(), 'σy²': yy.div(n), minY: D.min(...data.map(r => r.y)), maxY: D.max(...data.map(r => r.y)) });
    if (count > 1) { out.sy = yy.div(n.sub(1)).sqrt(); out['sy²'] = yy.div(n.sub(1)); }
    if (!ss.isZero()) { out.b = xy.div(ss); out.a = my.sub(out.b.mul(mean)); }
    if (!ss.isZero() && !yy.isZero()) out.r = xy.div(ss.mul(yy).sqrt());
    delete out.Q1; delete out.Q3; delete out.Med;
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.toString()]));
}
export function regression(rows, type = 'linear', frequency = false) {
  let data = samples(rows, frequency);
  if (data.length < (type === 'quadratic' ? 3 : 2)) throw new CalcError('No Data');
  if (!['linear','quadratic','logarithmic','exponential','ab','power','inverse'].includes(type)) throw new CalcError();
  data = data.map(r => ({ ...r,
    x: ['logarithmic','power'].includes(type) ? r.x.ln() : type === 'inverse' ? new D(1).div(r.x) : r.x,
    y: ['exponential','ab','power'].includes(type) ? r.y.ln() : r.y,
  }));
  if (data.some(r => !r.x.isFinite() || !r.y.isFinite())) throw new CalcError();
  const sum = fn => data.reduce((s, r) => s.add(fn(r).mul(r.w)), new D(0));
  const n = sum(() => new D(1)), mx = sum(r => r.x).div(n), my = sum(r => r.y).div(n);
  const xx = sum(r => r.x.sub(mx).pow(2)), yy = sum(r => r.y.sub(my).pow(2)), xy = sum(r => r.x.sub(mx).mul(r.y.sub(my)));
  if (xx.isZero()) throw new CalcError();
  let result;
  if (type === 'quadratic') {
    // Solve in centered coordinates to reduce cancellation in the normal equations.
    const z = r => r.x.sub(mx), sums = Array.from({ length: 5 }, (_, i) => sum(r => z(r).pow(i)));
    const matrix = Array.from({ length: 3 }, (_, i) => [...Array.from({ length: 3 }, (_, j) => sums[i+j]), sum(r => z(r).pow(i).mul(r.y))]);
    for (let col = 0; col < 3; col++) {
      let pivot = col; for (let row = col + 1; row < 3; row++) if (matrix[row][col].abs().gt(matrix[pivot][col].abs())) pivot = row;
      if (matrix[pivot][col].isZero()) throw new CalcError();
      [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];
      const divisor = matrix[col][col]; matrix[col] = matrix[col].map(v => v.div(divisor));
      for (let row = 0; row < 3; row++) if (row !== col) { const factor = matrix[row][col]; matrix[row] = matrix[row].map((v, j) => v.sub(factor.mul(matrix[col][j]))); }
    }
    const [intercept, slope, c] = matrix.map(r => r[3]);
    result = { a: intercept.sub(slope.mul(mx)).add(c.mul(mx.pow(2))), b: slope.sub(c.mul(mx).mul(2)), c };
  } else {
    let b = xy.div(xx), a = my.sub(b.mul(mx));
    if (['exponential','ab','power'].includes(type)) a = a.exp();
    if (type === 'ab') b = b.exp();
    result = { a, b }; if (!yy.isZero()) result.r = xy.div(xx.mul(yy).sqrt());
  }
  return Object.fromEntries(Object.entries(result).map(([k, v]) => [k, value(v).d.toString()]));
}
export function numberTable(f, g, start, end, step, ctx = {}) {
  const a = new D(start), b = new D(end), s = new D(step), max = g ? 30 : 45;
  if (!a.isFinite() || !b.isFinite() || !s.isFinite() || s.lte(0) || b.lt(a)) throw new CalcError('Range ERROR');
  const count = b.sub(a).div(s).floor().add(1).toNumber();
  if (!Number.isSafeInteger(count) || count > max) throw new CalcError('Range ERROR');
  return Array.from({ length: count }, (_, i) => {
    const x = a.add(s.mul(i)); const vars = { ...ctx.variables, x: x.toString() };
    const at = expr => { try { return pack(evaluate(expr, { ...ctx, variables: vars })); } catch { return null; } };
    return { x: x.toString(), f: at(f), g: g ? at(g) : undefined };
  });
}
