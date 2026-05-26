import { describe, expect, it } from "vitest";

import {
  computeResults,
  gradeMcq,
  getMissedQuestions,
  initialQuizState,
  quizReducer,
  selectQuestions,
  shuffle,
} from "./engine";
import type {
  CodeQuestion,
  MultipleChoiceQuestion,
  Question,
} from "./types";

// Deterministic PRNG (mulberry32) so shuffle/selection tests are stable.
function makeRng(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function mcq(id: string, category: Question["category"]): MultipleChoiceQuestion {
  return {
    id,
    category,
    type: "mcq",
    difficulty: "easy",
    prompt: `Prompt ${id}`,
    explanation: `Explanation ${id}`,
    options: [
      { id: "a", text: "A" },
      { id: "b", text: "B" },
    ],
    correctOptionId: "a",
  };
}

function code(id: string, category: Question["category"]): CodeQuestion {
  return {
    id,
    category,
    type: "code",
    difficulty: "medium",
    prompt: `Prompt ${id}`,
    explanation: `Explanation ${id}`,
    referenceSolution: `solution ${id}`,
  };
}

const bank: Question[] = [
  mcq("r1", "react"),
  mcq("r2", "react"),
  code("r3", "react"),
  mcq("r4", "react"),
  mcq("u1", "uiux"),
  mcq("u2", "uiux"),
  code("u3", "uiux"),
  mcq("a1", "a11y"),
  mcq("a2", "a11y"),
  code("a3", "a11y"),
];

describe("shuffle", () => {
  it("returns a permutation containing the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, makeRng(1));
    expect([...out].sort((x, y) => x - y)).toEqual(input);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4, 5];
    shuffle(input, makeRng(1));
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("is deterministic given the same rng seed", () => {
    expect(shuffle([1, 2, 3, 4, 5], makeRng(42))).toEqual(
      shuffle([1, 2, 3, 4, 5], makeRng(42))
    );
  });
});

describe("selectQuestions", () => {
  it("respects the requested count", () => {
    const out = selectQuestions(
      bank,
      { categories: ["react", "uiux", "a11y"], count: 6 },
      makeRng(7)
    );
    expect(out).toHaveLength(6);
  });

  it("only includes questions from the selected categories", () => {
    const out = selectQuestions(
      bank,
      { categories: ["a11y"], count: 10 },
      makeRng(7)
    );
    expect(out.every((q) => q.category === "a11y")).toBe(true);
  });

  it("returns all available when count exceeds the pool", () => {
    const out = selectQuestions(
      bank,
      { categories: ["a11y"], count: 99 },
      makeRng(7)
    );
    expect(out).toHaveLength(3);
  });

  it("balances categories (counts differ by at most one)", () => {
    const out = selectQuestions(
      bank,
      { categories: ["react", "uiux", "a11y"], count: 6 },
      makeRng(3)
    );
    const counts = { react: 0, uiux: 0, a11y: 0 } as Record<string, number>;
    for (const q of out) counts[q.category]++;
    const values = Object.values(counts);
    expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(1);
  });

  it("never returns duplicate questions", () => {
    const out = selectQuestions(
      bank,
      { categories: ["react", "uiux", "a11y"], count: 9 },
      makeRng(11)
    );
    expect(new Set(out.map((q) => q.id)).size).toBe(out.length);
  });

  it("returns an empty array when no categories are selected", () => {
    expect(
      selectQuestions(bank, { categories: [], count: 5 }, makeRng(1))
    ).toEqual([]);
  });
});

describe("gradeMcq", () => {
  it("is correct only for the right option", () => {
    const q = mcq("x", "react");
    expect(gradeMcq(q, "a")).toBe(true);
    expect(gradeMcq(q, "b")).toBe(false);
  });
});

describe("computeResults", () => {
  it("counts overall and per-category scores", () => {
    const questions = [mcq("r1", "react"), mcq("r2", "react"), mcq("a1", "a11y")];
    const answers = {
      r1: { questionId: "r1", isCorrect: true, selectedOptionId: "a" },
      r2: { questionId: "r2", isCorrect: false, selectedOptionId: "b" },
      a1: { questionId: "a1", isCorrect: true, selectedOptionId: "a" },
    };
    const res = computeResults(questions, answers);
    expect(res.total).toBe(3);
    expect(res.correct).toBe(2);
    expect(res.byCategory.react).toEqual({ correct: 1, total: 2 });
    expect(res.byCategory.a11y).toEqual({ correct: 1, total: 1 });
  });

  it("treats unanswered questions as incorrect", () => {
    const questions = [mcq("r1", "react"), mcq("r2", "react")];
    const res = computeResults(questions, {});
    expect(res.correct).toBe(0);
    expect(res.byCategory.react).toEqual({ correct: 0, total: 2 });
  });
});

describe("getMissedQuestions", () => {
  it("returns incorrect and unanswered questions", () => {
    const questions = [mcq("r1", "react"), mcq("r2", "react"), mcq("a1", "a11y")];
    const answers = {
      r1: { questionId: "r1", isCorrect: true, selectedOptionId: "a" },
      r2: { questionId: "r2", isCorrect: false, selectedOptionId: "b" },
    };
    const missed = getMissedQuestions(questions, answers);
    expect(missed.map((q) => q.id).sort()).toEqual(["a1", "r2"]);
  });
});

describe("quizReducer", () => {
  const qs = [mcq("r1", "react"), code("r3", "react")];

  it("START moves to active with the given questions", () => {
    const s = quizReducer(initialQuizState, { type: "START", questions: qs });
    expect(s.phase).toBe("active");
    expect(s.questions).toEqual(qs);
    expect(s.index).toBe(0);
    expect(s.answers).toEqual({});
  });

  it("ANSWER_MCQ records correctness for the current question", () => {
    let s = quizReducer(initialQuizState, { type: "START", questions: qs });
    s = quizReducer(s, { type: "ANSWER_MCQ", optionId: "a" });
    expect(s.answers.r1.isCorrect).toBe(true);
    expect(s.answers.r1.selectedOptionId).toBe("a");
  });

  it("ANSWER_MCQ records a wrong answer", () => {
    let s = quizReducer(initialQuizState, { type: "START", questions: qs });
    s = quizReducer(s, { type: "ANSWER_MCQ", optionId: "b" });
    expect(s.answers.r1.isCorrect).toBe(false);
  });

  it("does not overwrite an already-answered question", () => {
    let s = quizReducer(initialQuizState, { type: "START", questions: qs });
    s = quizReducer(s, { type: "ANSWER_MCQ", optionId: "a" });
    s = quizReducer(s, { type: "ANSWER_MCQ", optionId: "b" });
    expect(s.answers.r1.selectedOptionId).toBe("a");
  });

  it("REVEAL_CODE then SELF_GRADE records the self-assessment", () => {
    let s = quizReducer(initialQuizState, { type: "START", questions: qs });
    s = quizReducer(s, { type: "NEXT" }); // move to code question
    s = quizReducer(s, { type: "REVEAL_CODE", codeText: "my answer" });
    expect(s.answers.r3.revealed).toBe(true);
    expect(s.answers.r3.isCorrect).toBe(false);
    s = quizReducer(s, { type: "SELF_GRADE", correct: true });
    expect(s.answers.r3.isCorrect).toBe(true);
    expect(s.answers.r3.selfGraded).toBe(true);
  });

  it("NEXT advances, and finishes to results at the end", () => {
    let s = quizReducer(initialQuizState, { type: "START", questions: qs });
    s = quizReducer(s, { type: "NEXT" });
    expect(s.index).toBe(1);
    s = quizReducer(s, { type: "NEXT" });
    expect(s.phase).toBe("results");
  });

  it("RESTART returns to setup", () => {
    let s = quizReducer(initialQuizState, { type: "START", questions: qs });
    s = quizReducer(s, { type: "RESTART" });
    expect(s.phase).toBe("setup");
    expect(s.answers).toEqual({});
  });

  it("HYDRATE replaces the entire state", () => {
    const saved = {
      phase: "active" as const,
      questions: qs,
      index: 1,
      answers: { r1: { questionId: "r1", isCorrect: true } },
    };
    const s = quizReducer(initialQuizState, { type: "HYDRATE", state: saved });
    expect(s).toEqual(saved);
  });
});
