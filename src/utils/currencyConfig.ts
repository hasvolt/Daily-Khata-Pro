export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export function getCurrencyConfig(): CurrencyConfig {
  return {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
  };
}

export function formatIndianCurrency(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  
  const parts = abs.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] === '00' ? '' : `.${parts[1]}`;

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}₹${formattedInt}${decimalPart}`;
}

export function formatCurrencyByLang(amount: number, mask: boolean = false): string {
  if (mask) {
    return '₹ • • • • •';
  }
  return formatIndianCurrency(amount);
}
