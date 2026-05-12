export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function isAnswerCorrect(userAnswer: number, expected: number, decimals: number, tolerance = 0): boolean {
  const roundedExpected = roundTo(expected, decimals);
  const roundedUser = roundTo(userAnswer, decimals);
  const acceptedTolerance = Math.max(tolerance, decimals === 0 ? 0.49 : 0.5 / 10 ** decimals);
  return Math.abs(roundedUser - roundedExpected) <= acceptedTolerance;
}

export function formatNumber(value: number, decimals: number): string {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(roundTo(value, decimals));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sample<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
