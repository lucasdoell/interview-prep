import { describe, expect, it } from "vitest";

import { CHALLENGE_COUNT, QUESTION_BANK } from "./questions";

describe("QUESTION_BANK", () => {
  it("has 15 challenge-mode questions", () => {
    expect(CHALLENGE_COUNT).toBe(15);
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
});
