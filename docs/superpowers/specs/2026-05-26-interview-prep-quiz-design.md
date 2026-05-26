# Interview Prep Quiz — Design

**Date:** 2026-05-26
**Goal:** A no-auth, self-contained web app that quizzes a candidate on **React basics**, **UI/UX fundamentals**, and **accessibility** to prep for a web developer interview. Open the homepage, pick topics, answer questions, see how you did. Repeated practice stays fresh because each attempt draws a randomized subset from a larger bank.

## Decisions (from brainstorming)

- **Feedback:** immediate after each question (correct/incorrect + explanation), then Next.
- **Bank:** comprehensive (~45 questions); each attempt selects a balanced random subset (~12) so repeated runs aren't identical.
- **Look:** refine the installed shadcn `radix-lyra` theme (rose accent, monospace base, clean cards).
- **Extras (all):** dark mode toggle, save & resume (localStorage), choose categories before start, retry missed questions.

## Stack

Next.js 16.2.6 (App Router), React 19.2.4 with React Compiler ON (no manual memoization), Tailwind v4, shadcn (radix-lyra), Phosphor icons, next-themes. Vitest for unit tests of the pure engine.

## Question model

```
Category   = 'react' | 'uiux' | 'a11y'
QuestionType = 'mcq' | 'code'

BaseQuestion: { id, category, type, difficulty, prompt, code?, codeLang?, explanation }
MultipleChoiceQuestion (mcq): + options[{id,text,code?}], correctOptionId
CodeQuestion (code): + starterCode?, referenceSolution   // self-graded
```

Three flavors of content:
1. **Concept MCQs** — reinforce the idea behind a concept.
2. **Spot-the-bug MCQs** — code snippet + "what's wrong / what fixes it".
3. **Write-the-fix code questions** — user types a line or two; we reveal a reference solution and they self-mark (avoids false negatives on valid alternatives). Topics: infinite `useEffect`, missing deps, missing `key`, `htmlFor`/label association, `div`-as-button, stale state updates.

## Engine (pure, tested)

`src/lib/quiz/engine.ts`:
- `selectQuestions(bank, { categories, count }, rng?)` — balanced round-robin random subset; deterministic when `rng` supplied (for tests).
- `gradeMcq(question, optionId)` — boolean.
- `computeResults(questions, answers)` — `{ total, correct, byCategory }`.
- `quizReducer(state, action)` — state machine.

State machine phases: `setup` → `active` → `results`.
Actions: `START(config)`, `ANSWER_MCQ(optionId)`, `REVEAL_CODE`, `SELF_GRADE(correct)`, `NEXT`, `RESTART`, `RETRY_MISSED`, `HYDRATE(state)`.

## UI (`src/components/quiz/`)

- `quiz-app.tsx` (client) — holds reducer + persistence; renders by phase.
- `setup-screen.tsx` — intro, category toggles, Start; Resume banner if a saved active session exists.
- `progress-header.tsx` — Progress bar + "Question X of Y" + category badge.
- `question-view.tsx` — routes to mcq/code; shows feedback + Next; focus mgmt + aria-live.
- `mcq-question.tsx`, `code-question.tsx`, `code-display.tsx`, `feedback-panel.tsx`.
- `results-screen.tsx` — overall score, per-category breakdown, per-question review, Retry missed / Start over.

Built on installed shadcn primitives: Card, Button, RadioGroup, Progress, Badge, Textarea, Separator, Checkbox/Toggle.

## Persistence

`src/hooks/use-quiz-persistence.ts` — serialize reducer state to `localStorage` (key `interview-prep:v1`), SSR-guarded. On mount, hydrate; setup screen offers Resume when an `active` session is found.

## Accessibility (dogfood the topic)

Real radiogroup semantics (radix), associated labels, focus moves to the question heading on Next, `aria-live="polite"` for feedback, ordered headings (h1 app / h2 question), theme toggle with `aria-label`, `prefers-reduced-motion` honored.

## Out of scope

Auth, backend, server persistence, accounts, multiplayer, timed mode.
