/**
 * Daily Khata Pro - Financial Calculator Core Math Evaluator
 * Safely parses and evaluates compound arithmetic expressions with standard financial percentage rules.
 *
 * Rules:
 * 1. Preceding base relative percentage on addition and subtraction:
 *    - A + B% => A + (A * B / 100)
 *    - A - B% => A - (A * B / 100)
 * 2. Compound expressions respect operator precedence (* and / before + and -):
 *    - 1000 * 10000 - 30% => (1000 * 10000) - 30% of 10,000,000 => 7,000,000
 *    - 1000 * 10000 + 30% => (1000 * 10000) + 30% of 10,000,000 => 13,000,000
 * 3. Multiplicative percentages:
 *    - 10000000 * 30% => 10000000 * 0.30 => 3,000,000
 *    - 10000000 / 30% => 10000000 / 0.30 => 33,333,333.333333
 *    - 1000 + 500 * 20% => 1000 + (500 * 0.20) => 1100
 * 4. Chained percentages:
 *    - 100 - 20% - 10% => 80 - 10% => 72
 *    - 200 + 10% + 5% => 220 + 5% => 231
 * 5. Parentheses:
 *    - (1000 + 500) - 20% => 1500 - 20% => 1200
 */

export interface MathEvalResult {
  result: number | null;
  error: string | null;
}

export function evaluateFinancialMath(raw: string): MathEvalResult {
  if (!raw || !raw.trim()) return { result: null, error: null };

  try {
    let s = raw
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Strip trailing incomplete operators and spaces (e.g. "1000 +" -> 1000)
    s = s.replace(/[\s+\-*/]+$/, '').trim();
    if (!s) return { result: null, error: null };

    // Strip unclosed trailing open parentheses or operators
    while (s.endsWith('(') || /[\s+\-*/]$/.test(s)) {
      s = s.slice(0, -1).replace(/[\s+\-*/]+$/, '').trim();
    }
    if (!s) return { result: null, error: null };

    // Tokenize
    type Token = number | '+' | '-' | '*' | '/' | '%' | '(' | ')';
    const rawTokens: Token[] = [];
    let i = 0;

    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) {
        i++;
        continue;
      }

      if (c === '(' || c === ')' || c === '+' || c === '-' || c === '*' || c === '/' || c === '%') {
        rawTokens.push(c);
        i++;
      } else if (/[0-9.]/.test(c)) {
        let numStr = '';
        while (i < s.length && /[0-9.]/.test(s[i])) {
          numStr += s[i];
          i++;
        }
        if (numStr === '.' || (numStr.match(/\./g) || []).length > 1) {
          return { result: null, error: 'Invalid number' };
        }
        rawTokens.push(parseFloat(numStr));
      } else {
        return { result: null, error: 'Invalid character' };
      }
    }

    // Process unary signs (+ / -)
    const tokens: Token[] = [];
    for (let k = 0; k < rawTokens.length; k++) {
      const t = rawTokens[k];
      if (t === '+' || t === '-') {
        const prev = tokens[tokens.length - 1];
        const isUnary =
          prev === undefined ||
          prev === '(' ||
          prev === '+' ||
          prev === '-' ||
          prev === '*' ||
          prev === '/';

        if (isUnary) {
          if (k + 1 < rawTokens.length && typeof rawTokens[k + 1] === 'number') {
            const nextNum = rawTokens[k + 1] as number;
            tokens.push(t === '-' ? -nextNum : nextNum);
            k++;
            continue;
          } else if (k + 1 < rawTokens.length && rawTokens[k + 1] === '(') {
            tokens.push(t === '-' ? -1 : 1);
            tokens.push('*');
            continue;
          }
        }
      }
      tokens.push(t);
    }

    let pos = 0;

    function parsePrimary(): number {
      if (pos >= tokens.length) return 0;
      const t = tokens[pos++];
      if (typeof t === 'number') {
        return t;
      }
      if (t === '(') {
        const val = parseAdditive();
        if (pos < tokens.length && tokens[pos] === ')') {
          pos++;
        }
        return val;
      }
      return 0;
    }

    function parseFactor(baseForAdditivePct: number | null): number {
      let val = parsePrimary();
      while (pos < tokens.length && tokens[pos] === '%') {
        pos++;
        if (baseForAdditivePct !== null) {
          val = (baseForAdditivePct * val) / 100;
          baseForAdditivePct = null; // only consume the additive base once
        } else {
          val = val / 100;
        }
      }
      return val;
    }

    function parseMultiplicative(baseForAdditivePct: number | null): number {
      // Lookahead: does this multiplicative chain contain subsequent * or / ?
      // If it contains * or /, any % belongs to the multiplication/division factors
      // (e.g., 500 * 20%), so it should NOT take the additive base.
      let hasMulDiv = false;
      let depth = 0;
      for (let scan = pos; scan < tokens.length; scan++) {
        const tok = tokens[scan];
        if (tok === '(') depth++;
        else if (tok === ')') {
          if (depth === 0) break;
          depth--;
        } else if (depth === 0 && (tok === '+' || tok === '-')) {
          break;
        } else if (depth === 0 && (tok === '*' || tok === '/')) {
          hasMulDiv = true;
          break;
        }
      }

      const effectiveBase = hasMulDiv ? null : baseForAdditivePct;
      let left = parseFactor(effectiveBase);

      while (pos < tokens.length) {
        const op = tokens[pos];
        if (op === '*' || op === '/') {
          pos++;
          const right = parseFactor(null);
          if (op === '*') {
            left = left * right;
          } else {
            if (right === 0) {
              throw new Error('Division by zero');
            }
            left = left / right;
          }
        } else {
          break;
        }
      }
      return left;
    }

    function parseAdditive(): number {
      let left = parseMultiplicative(null);
      while (pos < tokens.length) {
        const op = tokens[pos];
        if (op === '+' || op === '-') {
          pos++;
          // In standard financial calculators, for A + B% or A - B%,
          // the percentage is relative to the calculated preceding value `left`.
          const right = parseMultiplicative(left);
          if (op === '+') {
            left = left + right;
          } else {
            left = left - right;
          }
        } else {
          break;
        }
      }
      return left;
    }

    const res = parseAdditive();

    if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
      return { result: Math.round(res * 1000000) / 1000000, error: null };
    }
    return { result: null, error: 'Math Error' };
  } catch (err: any) {
    return { result: null, error: err?.message || 'Invalid Expression' };
  }
}
