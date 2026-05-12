import type { Attempt, GeneratedQuestion } from './types';

export const ATTEMPTS_KEY = 'medcalc-attempts-v020';
export const WRONG_KEY = 'medcalc-wrong-v020';
export const STORAGE_SCHEMA_VERSION = '0.2.0';

export type ProgressData = {
  schemaVersion: string;
  exportedAt: string;
  attempts: Attempt[];
  wrong: GeneratedQuestion[];
};

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function buildProgressExport(attempts: Attempt[], wrong: GeneratedQuestion[]): ProgressData {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    attempts,
    wrong,
  };
}

export function parseProgressImport(raw: string): ProgressData {
  const parsed = JSON.parse(raw) as Partial<ProgressData>;
  if (!Array.isArray(parsed.attempts) || !Array.isArray(parsed.wrong)) {
    throw new Error('Het bestand bevat geen geldige voortgangsdata.');
  }

  return {
    schemaVersion: typeof parsed.schemaVersion === 'string' ? parsed.schemaVersion : 'unknown',
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
    attempts: parsed.attempts as Attempt[],
    wrong: parsed.wrong as GeneratedQuestion[],
  };
}

export function resetProgressStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ATTEMPTS_KEY);
  window.localStorage.removeItem(WRONG_KEY);
}
