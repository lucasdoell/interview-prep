export type Category = "react" | "uiux" | "a11y";
export type QuestionType = "mcq" | "code";
export type Difficulty = "easy" | "medium" | "hard";

export const CATEGORIES: Category[] = ["react", "uiux", "a11y"];

export const CATEGORY_LABELS: Record<Category, string> = {
  react: "React",
  uiux: "UI/UX",
  a11y: "Accessibility",
};

export const CATEGORY_BLURBS: Record<Category, string> = {
  react: "Hooks, state, rendering, and common pitfalls.",
  uiux: "Visual hierarchy, feedback, forms, and interaction design.",
  a11y: "Semantic HTML, ARIA, keyboard, and inclusive patterns.",
};

interface BaseQuestion {
  id: string;
  category: Category;
  /** Fine-grained subcategory (e.g. "React Hooks", "Visual & keyboard"). */
  topic: string;
  /** True for the curated "challenge mode" pool; excluded from normal rounds. */
  challenge?: boolean;
  type: QuestionType;
  difficulty: Difficulty;
  /** The question text. */
  prompt: string;
  /** Optional code snippet shown alongside the prompt (e.g. spot-the-bug). */
  code?: string;
  /** Language label for the snippet, e.g. "tsx". */
  codeLang?: string;
  /** Shown after the question is answered. */
  explanation: string;
}

export interface McqOption {
  id: string;
  text: string;
  /** Optional inline code for the option (e.g. comparing snippets). */
  code?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "mcq";
  options: McqOption[];
  correctOptionId: string;
}

export interface CodeQuestion extends BaseQuestion {
  type: "code";
  /** Optional buggy/starter code pre-filled into the editor. */
  starterCode?: string;
  /** Model answer revealed when the user submits; they self-grade against it. */
  referenceSolution: string;
}

export type Question = MultipleChoiceQuestion | CodeQuestion;

export interface AnswerRecord {
  questionId: string;
  isCorrect: boolean;
  /** Set for mcq questions. */
  selectedOptionId?: string;
  /** Set for code questions. */
  codeText?: string;
  /** True once the reference solution has been revealed (code questions). */
  revealed?: boolean;
  /** Set once the user self-grades a code question. */
  selfGraded?: boolean;
}

export type QuizPhase = "setup" | "active" | "results";

export interface QuizConfig {
  categories: Category[];
  count: number;
  /** Optional subcategory filter — used to focus a round on weak topics. */
  topics?: string[];
  /** When true, draw from the challenge pool instead of the normal pool. */
  challenge?: boolean;
}

export interface QuizState {
  phase: QuizPhase;
  questions: Question[];
  index: number;
  answers: Record<string, AnswerRecord>;
}

export interface ScoreTally {
  correct: number;
  total: number;
}

/** @deprecated use {@link ScoreTally} */
export type CategoryScore = ScoreTally;

export interface QuizResults {
  total: number;
  correct: number;
  byCategory: Partial<Record<Category, ScoreTally>>;
  byTopic: Record<string, ScoreTally>;
}

/** Accumulated per-topic performance across many rounds (persisted). */
export type TopicStats = Record<string, ScoreTally>;
