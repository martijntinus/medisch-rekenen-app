import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('medcalc-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const active = saved ? saved === 'dark' : prefersDark;
    setDark(active);
    document.documentElement.dataset.theme = active ? 'dark' : 'light';
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    window.localStorage.setItem('medcalc-theme', next ? 'dark' : 'light');
  }

  return (
    <button aria-label="Schakel thema" className="focus-ring rounded-full border border-app-border bg-app-surface px-4 py-3 text-xl shadow-app" onClick={toggle}>
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
