import { useRef, useState } from 'react';
import type { Attempt, GeneratedQuestion } from '@/lib/types';
import { buildProgressExport, parseProgressImport } from '@/lib/storage';

type Props = {
  attempts: Attempt[];
  wrong: GeneratedQuestion[];
  onResetAll: () => void;
  onResetWrong: () => void;
  onImport: (attempts: Attempt[], wrong: GeneratedQuestion[]) => void;
};

export function ProgressSettings({ attempts, wrong, onResetAll, onResetWrong, onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  function exportProgress() {
    const data = buildProgressExport(attempts, wrong);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `medisch-rekenen-voortgang-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setMessage('Voortgang geëxporteerd als lokaal JSON-bestand.');
  }

  function resetAll() {
    if (!window.confirm('Alle voortgang, statistieken en foutenvragen wissen? Dit kan niet ongedaan worden gemaakt.')) return;
    onResetAll();
    setMessage('Alle lokale voortgang is gewist.');
  }

  function resetWrongOnly() {
    if (!window.confirm('Alleen de herhaalvragen wissen? Je totaalscore blijft bewaard.')) return;
    onResetWrong();
    setMessage('De herhaalmodus is leeg gemaakt.');
  }

  async function importProgress(file: File | undefined) {
    if (!file) return;
    try {
      const data = parseProgressImport(await file.text());
      onImport(data.attempts.slice(0, 250), data.wrong.slice(0, 60));
      setMessage('Voortgang geïmporteerd. De gegevens blijven alleen lokaal in deze browser.');
    } catch {
      setMessage('Import mislukt: kies een geldig voortgangsbestand.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <section className="rounded-3xl border border-app-border bg-app-surface p-4 shadow-app">
      <button className="focus-ring flex w-full items-center justify-between gap-3 text-left" onClick={() => setOpen((v) => !v)}>
        <span>
          <span className="block text-lg font-extrabold text-app-primary">Voortgang en privacy</span>
          <span className="block text-sm text-app-muted">Browseropslag, geen tracking-cookie.</span>
        </span>
        <span className="rounded-full bg-app-soft px-3 py-2 font-bold">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <p className="rounded-2xl bg-app-soft p-4 text-sm text-app-muted">
            Je voortgang staat in <strong>localStorage</strong> van deze browser. Dit wordt niet meegestuurd naar een server en synchroniseert niet tussen pc, mobiel of browsers.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button className="focus-ring rounded-2xl bg-app-accent px-4 py-3 font-extrabold text-white hover:bg-app-accentHover" onClick={exportProgress}>Export JSON</button>
            <button className="focus-ring rounded-2xl border border-app-border px-4 py-3 font-bold" onClick={() => fileInput.current?.click()}>Import JSON</button>
            <button className="focus-ring rounded-2xl border border-app-border px-4 py-3 font-bold" onClick={resetWrongOnly}>Reset herhaalvragen</button>
            <button className="focus-ring rounded-2xl border border-red-300 px-4 py-3 font-bold text-red-600" onClick={resetAll}>Reset alles</button>
          </div>
          <input ref={fileInput} type="file" accept="application/json" className="hidden" onChange={(event) => void importProgress(event.target.files?.[0])} />
          {message && <p className="rounded-2xl bg-app-soft p-3 text-sm font-bold">{message}</p>}
        </div>
      )}
    </section>
  );
}
