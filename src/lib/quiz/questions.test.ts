import { describe, expect, it } from "vitest";

import { CHALLENGE_COUNT, QUESTION_BANK } from "./questions";

describe("QUESTION_BANK", () => {
  it("has 18 challenge-mode questions", () => {
    expect(CHALLENGE_COUNT).toBe(18);
  });

  it("gives every question a non-empty topic", () => {
    for (const q of QUESTION_BANK) {
      expect(q.topic, `${q.id} should have a topic`).toBeTruthy();
    }
  });

  it("uses unique question ids", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points every MCQ's correctOptionId at a real option", () => {
    for (const q of QUESTION_BANK) {
      if (q.type !== "mcq") continue;
      const match = q.options.some((o) => o.id === q.correctOptionId);
      expect(match, `${q.id} correctOptionId must match an option`).toBe(true);
    }
  });

  it("gives challenge questions the 'hard' difficulty", () => {
    for (const q of QUESTION_BANK) {
      if (q.challenge) expect(q.difficulty, q.id).toBe("hard");
    }
  });

  // Guards against the "longest option is always correct" tell.
  const mcqs = QUESTION_BANK.filter((q) => q.type === "mcq");

  it("doesn't make the correct answer the longest option in most questions", () => {
    let correctIsLongest = 0;
    for (const q of mcqs) {
      if (q.type !== "mcq") continue;
      const longest = Math.max(...q.options.map((o) => o.text.length));
      const correct = q.options.find((o) => o.id === q.correctOptionId)!;
      // "Uniquely longest" — strictly longer than every other option.
      const isUniquelyLongest =
        correct.text.length === longest &&
        q.options.filter((o) => o.text.length === longest).length === 1;
      if (isUniquelyLongest) correctIsLongest++;
    }
    // Random would be ~25%; the old bank was ~80%+. Keep it well below half.
    expect(correctIsLongest / mcqs.length).toBeLessThan(0.4);
  });

  it("keeps options within a question similar in length", () => {
    for (const q of mcqs) {
      if (q.type !== "mcq") continue;
      const lengths = q.options.map((o) => o.text.length);
      const ratio = Math.max(...lengths) / Math.min(...lengths);
      expect(ratio, `${q.id} option lengths vary too much`).toBeLessThan(2.2);
    }
  });
});
