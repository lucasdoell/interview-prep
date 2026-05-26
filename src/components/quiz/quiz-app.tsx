"use client";

import { useReducer } from "react";

import { useQuizPersistence } from "@/hooks/use-quiz-persistence";
import {
  getMissedQuestions,
  initialQuizState,
  quizReducer,
  selectQuestions,
  shuffle,
} from "@/lib/quiz/engine";
import { QUESTION_BANK } from "@/lib/quiz/questions";
import type { QuizConfig } from "@/lib/quiz/types";

import { QuestionView } from "./question-view";
import { ResultsScreen } from "./results-screen";
import { SetupScreen } from "./setup-screen";

export function QuizApp() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const { savedSession, clearSaved } = useQuizPersistence(state);

  function handleStart(config: QuizConfig) {
    dispatch({ type: "START", questions: selectQuestions(QUESTION_BANK, config) });
    clearSaved();
  }

  function handleResume() {
    if (savedSession) dispatch({ type: "HYDRATE", state: savedSession });
    clearSaved();
  }

  function handleRetryMissed() {
    const missed = shuffle(getMissedQuestions(state.questions, state.answers));
    if (missed.length > 0) dispatch({ type: "START", questions: missed });
  }

  if (state.phase === "active") {
    const question = state.questions[state.index];
    return (
      <QuestionView
        key={question.id}
        question={question}
        answer={state.answers[question.id]}
        index={state.index}
        total={state.questions.length}
        onAnswerMcq={(optionId) => dispatch({ type: "ANSWER_MCQ", optionId })}
        onRevealCode={(codeText) => dispatch({ type: "REVEAL_CODE", codeText })}
        onSelfGrade={(correct) => dispatch({ type: "SELF_GRADE", correct })}
        onNext={() => dispatch({ type: "NEXT" })}
      />
    );
  }

  if (state.phase === "results") {
    return (
      <ResultsScreen
        questions={state.questions}
        answers={state.answers}
        onRetryMissed={handleRetryMissed}
        onRestart={() => dispatch({ type: "RESTART" })}
      />
    );
  }

  return (
    <SetupScreen
      savedSession={savedSession}
      onStart={handleStart}
      onResume={handleResume}
      onDismissResume={clearSaved}
    />
  );
}
