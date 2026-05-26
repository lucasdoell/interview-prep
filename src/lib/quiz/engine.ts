import { CATEGORIES } from "./types";
import type {
  AnswerRecord,
  Category,
  MultipleChoiceQuestion,
  Question,
  QuizConfig,
  QuizResults,
  QuizState,
  TopicStats,
} from "./types";

type Rng = () => number;

/** Fisher-Yates shuffle. Returns a new array; does not mutate the input. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Pick a balanced random subset of the bank for one attempt. Questions are
 * drawn round-robin across the selected categories so coverage stays even,
 * then the final order is shuffled for variety.
 */
export function selectQuestions(
  bank: readonly Question[],
  config: QuizConfig,
  rng: Rng = Math.random
): Question[] {
  const { categories, count, topics, challenge = false } = config;
  if (categories.length === 0 || count <= 0) return [];

  const topicFilter = topics && topics.length > 0 ? new Set(topics) : null;
  const pools = categories.map((category) =>
    shuffle(
      bank.filter(
        (q) =>
          q.category === category &&
          (q.challenge ?? false) === challenge &&
          (!topicFilter || topicFilter.has(q.topic))
      ),
      rng
    )
  );

  const selected: Question[] = [];
  let exhausted = false;
  while (selected.length < count && !exhausted) {
    exhausted = true;
    for (const pool of pools) {
      if (selected.length >= count) break;
      const next = pool.shift();
      if (next) {
        selected.push(next);
        exhausted = false;
      }
    }
  }

  // Shuffle the final order, and shuffle each MCQ's options so the correct
  // answer isn't always in the same position (grading is by id, not index).
  return shuffle(selected, rng).map((q) =>
    q.type === "mcq" ? { ...q, options: shuffle(q.options, rng) } : q
  );
}

export function gradeMcq(
  question: MultipleChoiceQuestion,
  optionId: string
): boolean {
  return optionId === question.correctOptionId;
}

export function computeResults(
  questions: readonly Question[],
  answers: Record<string, AnswerRecord>
): QuizResults {
  const byCategory: QuizResults["byCategory"] = {};
  const byTopic: QuizResults["byTopic"] = {};
  let correct = 0;

  for (const q of questions) {
    const answer = answers[q.id];
    const isCorrect = answer?.isCorrect ?? false;
    if (isCorrect) correct++;

    const catBucket = (byCategory[q.category] ??= { correct: 0, total: 0 });
    catBucket.total++;
    if (isCorrect) catBucket.correct++;

    const topicBucket = (byTopic[q.topic] ??= { correct: 0, total: 0 });
    topicBucket.total++;
    if (isCorrect) topicBucket.correct++;
  }

  return { total: questions.length, correct, byCategory, byTopic };
}

/**
 * Merge a completed round's results into a running per-topic tally.
 * Returns a new object (does not mutate `prev`).
 */
export function mergeTopicStats(
  prev: TopicStats,
  questions: readonly Question[],
  answers: Record<string, AnswerRecord>
): TopicStats {
  const next: TopicStats = {};
  for (const [topic, tally] of Object.entries(prev)) {
    next[topic] = { ...tally };
  }
  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) continue; // only count answered questions
    const bucket = (next[q.topic] ??= { correct: 0, total: 0 });
    bucket.total++;
    if (answer.isCorrect) bucket.correct++;
  }
  return next;
}

export interface TopicRanking {
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
}

/**
 * Topics ranked weakest-first (lowest accuracy). Only includes topics with at
 * least `minTotal` attempts so a single unlucky question doesn't dominate.
 */
export function rankTopicsByWeakness(
  stats: TopicStats,
  minTotal = 1
): TopicRanking[] {
  return Object.entries(stats)
    .filter(([, t]) => t.total >= minTotal)
    .map(([topic, t]) => ({
      topic,
      correct: t.correct,
      total: t.total,
      accuracy: t.total === 0 ? 0 : t.correct / t.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
}

/** Questions the user got wrong or never answered — used for "retry missed". */
export function getMissedQuestions(
  questions: readonly Question[],
  answers: Record<string, AnswerRecord>
): Question[] {
  return questions.filter((q) => !answers[q.id]?.isCorrect);
}

export const initialQuizState: QuizState = {
  phase: "setup",
  questions: [],
  index: 0,
  answers: {},
};

export type QuizAction =
  | { type: "START"; questions: Question[] }
  | { type: "ANSWER_MCQ"; optionId: string }
  | { type: "REVEAL_CODE"; codeText: string }
  | { type: "SELF_GRADE"; correct: boolean }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "HYDRATE"; state: QuizState };

function currentQuestion(state: QuizState): Question | undefined {
  return state.questions[state.index];
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START":
      return {
        phase: "active",
        questions: action.questions,
        index: 0,
        answers: {},
      };

    case "ANSWER_MCQ": {
      const q = currentQuestion(state);
      if (!q || q.type !== "mcq") return state;
      // Lock the answer once committed.
      if (state.answers[q.id]) return state;
      return {
        ...state,
        answers: {
          ...state.answers,
          [q.id]: {
            questionId: q.id,
            selectedOptionId: action.optionId,
            isCorrect: gradeMcq(q, action.optionId),
          },
        },
      };
    }

    case "REVEAL_CODE": {
      const q = currentQuestion(state);
      if (!q || q.type !== "code") return state;
      if (state.answers[q.id]?.revealed) return state;
      return {
        ...state,
        answers: {
          ...state.answers,
          [q.id]: {
            questionId: q.id,
            codeText: action.codeText,
            revealed: true,
            isCorrect: false,
          },
        },
      };
    }

    case "SELF_GRADE": {
      const q = currentQuestion(state);
      if (!q || q.type !== "code") return state;
      const existing = state.answers[q.id];
      if (!existing) return state;
      return {
        ...state,
        answers: {
          ...state.answers,
          [q.id]: { ...existing, isCorrect: action.correct, selfGraded: true },
        },
      };
    }

    case "NEXT": {
      if (state.index >= state.questions.length - 1) {
        return { ...state, phase: "results" };
      }
      return { ...state, index: state.index + 1 };
    }

    case "RESTART":
      return initialQuizState;

    case "HYDRATE":
      return action.state;

    default:
      return state;
  }
}

/** Categories present in a set of questions, in canonical order. */
export function categoriesInQuestions(
  questions: readonly Question[]
): Category[] {
  const present = new Set(questions.map((q) => q.category));
  return CATEGORIES.filter((c) => present.has(c));
}
