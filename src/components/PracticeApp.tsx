import { useEffect, useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { generateQuestion } from '@/data/questionBank';
import { formatNumber, isAnswerCorrect } from '@/lib/math';
import { ATTEMPTS_KEY, WRONG_KEY, readJson, resetProgressStorage, writeJson } from '@/lib/storage';
import type { Attempt, CategoryId, GeneratedQuestion, Mode } from '@/lib/types';
import { Calculator } from './Calculator';
import { ThemeToggle } from './ThemeToggle';
import { ProgressSettings } from './ProgressSettings';

const APP_VERSION = '0.2.2';

export function PracticeApp() {
  const [selected, setSelected] = useState<CategoryId>('eenheden');
  const [mode, setMode] = useState<Mode>('explain');
  const [question, setQuestion] = useState<GeneratedQuestion>(() => generateQuestion('eenheden'));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Attempt | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [wrong, setWrong] = useState<GeneratedQuestion[]>([]);
  const [explainVisible, setExplainVisible] = useState(true);
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
    setAttempts(readJson<Attempt[]>(ATTEMPTS_KEY, []));
    setWrong(readJson<GeneratedQuestion[]>(WRONG_KEY, []));
  }, []);

  const stats = useMemo(() => {
    const total = attempts.length;
    const correct = attempts.filter((a) => a.correct).length;
    return { total, correct, pct: total ? Math.round((correct / total) * 100) : 0, wrong: wrong.length };
  }, [attempts, wrong]);

  function freshQuestion(categoryId = selected, nextMode = mode) {
    const next = nextMode === 'repeat' && wrong.length ? wrong[0] : generateQuestion(categoryId);
    setQuestion(next);
    setAnswer('');
    setFeedback(null);
    setExplainVisible(nextMode === 'explain');
  }

  function chooseCategory(categoryId: CategoryId) {
    setSelected(categoryId);
    setMode('explain');
    const next = generateQuestion(categoryId);
    setQuestion(next);
    setAnswer('');
    setFeedback(null);
    setExplainVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function chooseMode(nextMode: Mode) {
    setMode(nextMode);
    setFeedback(null);
    setAnswer('');
    setExplainVisible(nextMode === 'explain');
    setQuestion(nextMode === 'repeat' && wrong.length ? wrong[0] : generateQuestion(selected));
  }

  function submit() {
    const parsed = Number(answer.replace(',', '.'));
    const received = Number.isFinite(parsed) ? parsed : null;
    const correct = received !== null && isAnswerCorrect(received, question.answer, question.rounding.decimals, question.rounding.tolerance);
    const attempt: Attempt = { questionId: question.id, categoryId: question.categoryId, title: question.title, correct, expected: question.answer, received, unit: question.unit, at: new Date().toISOString(), question };
    const nextAttempts = [attempt, ...attempts].slice(0, 250);
    let nextWrong = wrong;
    if (correct) nextWrong = wrong.filter((q) => q.id !== question.id);
    else if (!wrong.some((q) => q.id === question.id)) nextWrong = [question, ...wrong].slice(0, 60);
    setAttempts(nextAttempts);
    setWrong(nextWrong);
    setFeedback(attempt);
    writeJson(ATTEMPTS_KEY, nextAttempts);
    writeJson(WRONG_KEY, nextWrong);
  }

  function resetAll() {
    resetProgressStorage();
    setAttempts([]);
    setWrong([]);
    setFeedback(null);
  }

  function resetWrongOnly() {
    writeJson(WRONG_KEY, []);
    setWrong([]);
    if (mode === 'repeat') chooseMode('explain');
  }

  function importProgress(nextAttempts: Attempt[], nextWrong: GeneratedQuestion[]) {
    setAttempts(nextAttempts);
    setWrong(nextWrong);
    writeJson(ATTEMPTS_KEY, nextAttempts);
    writeJson(WRONG_KEY, nextWrong);
  }

  const selectedCategory = categories.find((category) => category.id === selected)!;

  return (
    <div className="app-shell safe-bottom">
      <header className="sticky top-0 z-20 border-b border-app-border bg-app-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-app-accent">HBO-V oefentool</p>
            <h1 className="text-xl font-black leading-tight text-app-primary sm:text-3xl">Medisch Rekenen</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[1fr_340px] lg:py-6">
        <section className="space-y-4">
          <div className="rounded-3xl border border-app-border bg-app-surface p-4 shadow-app sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-app-muted">Vandaag oefenen</p>
                <h2 className="text-2xl font-black text-app-primary sm:text-4xl">Eén som tegelijk.</h2>
              </div>
              <button className="focus-ring rounded-2xl bg-app-accent px-4 py-3 font-extrabold text-white hover:bg-app-accentHover" onClick={() => freshQuestion()}>
                Nieuwe vraag
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <Stat label="gemaakt" value={stats.total} />
              <Stat label="goed" value={stats.correct} />
              <Stat label="score" value={`${stats.pct}%`} />
              <Stat label="herhaal" value={stats.wrong} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-3xl border border-app-border bg-app-surface p-2 shadow-app">
            <ModeButton active={mode === 'explain'} onClick={() => chooseMode('explain')}>Uitleg</ModeButton>
            <ModeButton active={mode === 'test'} onClick={() => chooseMode('test')}>Toets</ModeButton>
            <ModeButton active={mode === 'repeat'} onClick={() => chooseMode('repeat')} disabled={!wrong.length}>Herhaal</ModeButton>
          </div>

          <article className="rounded-3xl border border-app-border bg-app-surface p-4 shadow-app sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-app-soft px-3 py-1 text-sm font-bold text-app-primary">{selectedCategory.icon} {selectedCategory.name}</span>
              <span className="rounded-full bg-app-soft px-3 py-1 text-sm font-bold text-app-muted">{question.rounding.label}</span>
            </div>
            <h2 className="text-2xl font-black text-app-primary">{question.title}</h2>
            <p className="mt-3 rounded-2xl bg-app-soft p-4 text-lg">{question.caseText}</p>
            <p className="mt-4 text-xl font-extrabold">{question.question}</p>

            {mode === 'explain' && explainVisible && (
              <div className="mt-4 rounded-2xl border border-app-border bg-app-soft p-4">
                <h3 className="font-extrabold text-app-primary">Aanpak</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  {question.explanation.map((line) => <li key={line}>{line}</li>)}
                </ol>
                <button className="focus-ring mt-3 rounded-xl border border-app-border px-3 py-2 font-bold" onClick={() => setExplainVisible(false)}>Verberg uitleg en probeer zelf</button>
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-app-muted">Jouw antwoord in {question.unit}</span>
                <input className="focus-ring w-full rounded-2xl border border-app-border bg-app-soft p-4 text-2xl font-bold text-app-text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Typ je antwoord" inputMode="decimal" />
              </label>
              <button className="focus-ring min-h-14 rounded-2xl bg-app-accent px-6 py-4 font-black text-white hover:bg-app-accentHover sm:self-end" onClick={submit}>Controleer</button>
            </div>

            {feedback && (
              <div className={`mt-4 rounded-2xl p-4 ${feedback.correct ? 'bg-green-100 text-green-900' : 'bg-orange-100 text-orange-950'}`}>
                <h3 className="text-lg font-black">{feedback.correct ? 'Goed gedaan!' : 'Bijna. Controleer de stappen rustig.'}</h3>
                <p>Verwacht antwoord: <strong>{formatNumber(question.answer, question.rounding.decimals)} {question.unit}</strong></p>
                <p className="mt-2 text-sm">{question.safetyNote}</p>
                <button className="mt-3 rounded-xl bg-white/60 px-4 py-2 font-bold" onClick={() => freshQuestion()}>Volgende vraag</button>
              </div>
            )}
          </article>

          <section className="rounded-3xl border border-app-border bg-app-surface p-4 shadow-app">
            <h2 className="mb-3 text-xl font-black text-app-primary">Categorieën</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <button key={category.id} onClick={() => chooseCategory(category.id)} className={`focus-ring rounded-2xl border p-4 text-left ${selected === category.id ? 'border-app-accent bg-app-soft' : 'border-app-border bg-app-surface'}`}>
                  <span className="text-2xl">{category.icon}</span>
                  <span className="ml-2 font-extrabold text-app-primary">{category.name}</span>
                  <span className="mt-1 block text-sm text-app-muted">{category.description}</span>
                </button>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <button className="focus-ring w-full rounded-3xl border border-app-border bg-app-surface p-4 text-left font-extrabold shadow-app lg:hidden" onClick={() => setCalcOpen((v) => !v)}>
            {calcOpen ? 'Rekenmachine sluiten' : 'Rekenmachine openen'}
          </button>
          <div className={calcOpen ? 'block' : 'hidden lg:block'}><Calculator /></div>
          <ProgressSettings attempts={attempts} wrong={wrong} onResetAll={resetAll} onResetWrong={resetWrongOnly} onImport={importProgress} />
          <section className="rounded-3xl border border-app-border bg-app-surface p-4 shadow-app">
            <h3 className="font-extrabold text-app-primary">Disclaimer</h3>
            <p className="mt-2 text-sm text-app-muted">Alleen bedoeld als oefentool. Niet gebruiken voor echte patiëntenzorg. Volg altijd lokale protocollen, medicatieveiligheidsafspraken en bevoegd/bekwaam handelen volgens de Wet BIG.</p>
          </section>
        </aside>
      </main>

      <div className="fixed inset-x-3 z-30 lg:hidden mobile-sticky">
        <button className="focus-ring w-full rounded-3xl bg-app-accent px-5 py-4 text-lg font-black text-white shadow-app" onClick={submit}>Controleer antwoord</button>
      </div>

      <footer className="footer-bg mt-4 px-4 py-6 text-center text-sm text-white"><div>Made by Martijn Vasterd, ChatGPT and Patience</div><div className="mt-1 text-xs opacity-70">Versie {APP_VERSION}</div></footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-2xl bg-app-soft p-3"><div className="text-xl font-black text-app-primary">{value}</div><div className="text-xs font-bold uppercase text-app-muted">{label}</div></div>;
}

function ModeButton({ children, active, disabled, onClick }: { children: React.ReactNode; active: boolean; disabled?: boolean; onClick: () => void }) {
  return <button disabled={disabled} onClick={onClick} className={`focus-ring rounded-2xl px-3 py-3 text-sm font-extrabold ${active ? 'bg-app-accent text-white' : 'bg-app-soft text-app-text'} disabled:cursor-not-allowed disabled:opacity-40`}>{children}</button>;
}
