import { useState } from 'react';

const keys = ['7','8','9','/','4','5','6','*','1','2','3','-','0',',','.','+'];

export function Calculator() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');

  function calculate() {
    if (!/^[0-9+\-*/().,\s]+$/.test(expr)) {
      setResult('Ongeldige invoer');
      return;
    }
    try {
      const normalized = expr.replaceAll(',', '.');
      // Alleen eenvoudige rekenkundige invoer na whitelist hierboven.
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${normalized})`)();
      setResult(Number.isFinite(value) ? String(Math.round(value * 10000) / 10000).replace('.', ',') : 'Ongeldige uitkomst');
    } catch {
      setResult('Controleer je som');
    }
  }

  return (
    <aside className="rounded-3xl border border-app-border bg-app-surface p-4 shadow-app">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-extrabold text-app-primary">Rekenmachine</h3>
        <span className="text-xs font-bold uppercase tracking-wide text-app-muted">lokaal</span>
      </div>
      <input className="focus-ring mb-3 w-full rounded-2xl border border-app-border bg-app-soft p-4 text-lg text-app-text" value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="Bijv. 500/8" inputMode="decimal" />
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => <button className="focus-ring min-h-12 rounded-2xl border border-app-border bg-app-soft px-3 py-3 text-lg font-bold hover:bg-app-accent hover:text-white" key={key} onClick={() => setExpr((v) => v + key)}>{key}</button>)}
      </div>
      <div className="mt-3 flex gap-2">
        <button className="focus-ring min-h-12 flex-1 rounded-2xl bg-app-accent px-3 py-3 font-extrabold text-white hover:bg-app-accentHover" onClick={calculate}>=</button>
        <button className="focus-ring min-h-12 rounded-2xl border border-app-border px-4 py-3 font-bold" onClick={() => { setExpr(''); setResult(''); }}>Wis</button>
      </div>
      {result && <p className="mt-3 rounded-2xl bg-app-soft p-4 font-bold">Uitkomst: {result}</p>}
    </aside>
  );
}
