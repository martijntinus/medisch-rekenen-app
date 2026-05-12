import { describe, expect, it } from 'vitest';
import { formatNumber, isAnswerCorrect, roundTo } from '@/lib/math';

describe('medische rekenlogica', () => {
  it('rondt veilig af op gevraagde decimalen', () => {
    expect(roundTo(62.555, 2)).toBe(62.56);
    expect(roundTo(41.49, 0)).toBe(41);
    expect(roundTo(41.5, 0)).toBe(42);
  });

  it('accepteert hele afronding voor druppels/min', () => {
    expect(isAnswerCorrect(42, 41.666, 0)).toBe(true);
    expect(isAnswerCorrect(40, 41.666, 0)).toBe(false);
  });

  it('controleert decimalen bij ml-berekeningen', () => {
    expect(isAnswerCorrect(1.25, 1.25, 2)).toBe(true);
    expect(isAnswerCorrect(1.2, 1.25, 2)).toBe(false);
  });

  it('formatteert Nederlandse notatie', () => {
    expect(formatNumber(1.5, 2)).toBe('1,50');
  });
});
