export type CategoryId =
  | 'eenheden'
  | 'medicatie'
  | 'gewicht'
  | 'tabletten'
  | 'infuus'
  | 'druppels'
  | 'verdunnen'
  | 'vochtbalans'
  | 'zuurstof';

export type Mode = 'explain' | 'test' | 'repeat';

export type RoundingRule = {
  label: string;
  decimals: number;
  unit: string;
  tolerance?: number;
};

export type GeneratedQuestion = {
  id: string;
  categoryId: CategoryId;
  title: string;
  caseText: string;
  question: string;
  answer: number;
  unit: string;
  explanation: string[];
  safetyNote: string;
  rounding: RoundingRule;
};

export type QuestionTemplate = {
  id: string;
  categoryId: CategoryId;
  title: string;
  generate: () => GeneratedQuestion;
};

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
};

export type Attempt = {
  questionId: string;
  categoryId: CategoryId;
  title: string;
  correct: boolean;
  expected: number;
  received: number | null;
  unit: string;
  at: string;
  question: GeneratedQuestion;
};
