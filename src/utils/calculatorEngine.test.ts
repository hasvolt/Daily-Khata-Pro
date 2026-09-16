/**
 * Daily Khata Pro - Financial Calculator Core Engine Tests
 * Regression test suite for percentage calculations and compound arithmetic expressions.
 */

import { evaluateFinancialMath } from './calculatorEngine.js';

interface TestCase {
  name: string;
  expr: string;
  expected: number | null;
  tolerance?: number;
}

const testCases: TestCase[] = [
  // 1. Primary bug reported by user
  {
    name: 'Compound subtraction with percentage (Reported Bug)',
    expr: '1000 × 10000 − 30%',
    expected: 7000000
  },
  {
    name: 'Compound subtraction with standard operators',
    expr: '1000 * 10000 - 30%',
    expected: 7000000
  },
  // 2. Addition with percentage
  {
    name: 'Compound addition with percentage',
    expr: '1000 × 10000 + 30%',
    expected: 13000000
  },
  {
    name: 'Standard base subtraction with percentage',
    expr: '10000000 − 30%',
    expected: 7000000
  },
  {
    name: 'Standard base addition with percentage',
    expr: '10000000 + 30%',
    expected: 13000000
  },
  // 3. Multiplication and division with percentage
  {
    name: 'Base multiplication with percentage',
    expr: '10000000 × 30%',
    expected: 3000000
  },
  {
    name: 'Base division with percentage',
    expr: '10000000 ÷ 30%',
    expected: 33333333.333333,
    tolerance: 0.001
  },
  {
    name: 'Compound multiplication with percentage',
    expr: '1000 × 10000 × 30%',
    expected: 3000000
  },
  // 4. Operator precedence with mixed addition and multiplication
  {
    name: 'Addition followed by multiplication with percentage',
    expr: '1000 + 500 × 20%',
    expected: 1100
  },
  {
    name: 'Standard markup / discount examples',
    expr: '5000 − 10%',
    expected: 4500
  },
  {
    name: 'Standard tax addition example',
    expr: '5000 + 10%',
    expected: 5500
  },
  // 5. Parentheses precedence
  {
    name: 'Parentheses subexpression with percentage discount',
    expr: '(1000 + 500) − 20%',
    expected: 1200
  },
  {
    name: 'Parentheses around percentage discount then multiplied',
    expr: '(10000 - 30%) * 2',
    expected: 14000
  },
  // 6. Sequential chained percentages
  {
    name: 'Chained sequential discounts',
    expr: '100 − 20% − 10%',
    expected: 72
  },
  {
    name: 'Chained sequential markups',
    expr: '200 + 10% + 5%',
    expected: 231
  },
  // 7. Standalone & standard arithmetic
  {
    name: 'Standalone percentage',
    expr: '50%',
    expected: 0.5
  },
  {
    name: 'Standard addition',
    expr: '100 + 50',
    expected: 150
  },
  {
    name: 'Standard multiplication',
    expr: '1000 * 10000',
    expected: 10000000
  },
  {
    name: 'Decimal percentage',
    expr: '1000 - 25.5%',
    expected: 745
  },
  // 8. Incomplete typing states
  {
    name: 'Trailing operator during typing',
    expr: '1000 * 10000 -',
    expected: 10000000
  },
  {
    name: 'Trailing open parenthesis during typing',
    expr: '(1000 + 500',
    expected: 1500
  }
];

let failed = 0;
console.log('--- Running Financial Calculator Math Engine Tests ---');

for (const tc of testCases) {
  const res = evaluateFinancialMath(tc.expr);
  let passed = false;
  if (tc.expected === null) {
    passed = res.result === null;
  } else if (res.result !== null) {
    if (tc.tolerance !== undefined) {
      passed = Math.abs(res.result - tc.expected) <= tc.tolerance;
    } else {
      passed = Math.abs(res.result - tc.expected) < 0.000001;
    }
  }

  if (passed) {
    console.log(`✅ [PASS] ${tc.name}: "${tc.expr}" => ${res.result}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${tc.name}: "${tc.expr}" => Got ${res.result}, Expected ${tc.expected}`);
  }
}

console.log('----------------------------------------------------');
if (failed === 0) {
  console.log(`🎉 All ${testCases.length} tests passed successfully!`);
} else {
  console.error(`💥 ${failed} tests failed!`);
  process.exit(1);
}
