import { describe, expect, it } from 'vitest';
import { buildProgressExport, parseProgressImport } from '@/lib/storage';

describe('progress storage helpers', () => {
  it('builds an export with attempts and wrong questions', () => {
    const data = buildProgressExport([], []);
    expect(data.schemaVersion).toBe('0.2.0');
    expect(data.attempts).toEqual([]);
    expect(data.wrong).toEqual([]);
    expect(Date.parse(data.exportedAt)).not.toBeNaN();
  });

  it('rejects invalid import files', () => {
    expect(() => parseProgressImport('{"attempts":{}}')).toThrow();
  });

  it('parses valid import files', () => {
    const data = parseProgressImport(JSON.stringify({ schemaVersion: '0.2.0', exportedAt: '2026-05-12T00:00:00.000Z', attempts: [], wrong: [] }));
    expect(data.attempts).toHaveLength(0);
    expect(data.wrong).toHaveLength(0);
  });
});
