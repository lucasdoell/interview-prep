"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { AnswerRecord, Question } from "@/lib/quiz/types";

import { CodeQuestionView } from "./code-question";
import { McqQuestion } from "./mcq-question";
import { ProgressHeader } from "./progress-header";

export function QuestionView({
  question,
  answer,
  index,
  total,
  onAnswerMcq,
  onRevealCode,
  onSelfGrade,
  onNext,
}: {
  question: Question;
  answer?: AnswerRecord;
  index: number;
  total: number;
  onAnswerMcq: (optionId: string) => void;
  onRevealCode: (codeText: string) => void;
  onSelfGrade: (correct: boolean) => void;
  onNext: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // On each new question, move focus to the prompt so keyboard and
  // screen-reader users start at the top of the new content.
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  const canProceed =
    question.type === "mcq" ? !!answer : !!answer?.selfGraded;
  const isLast = index === total - 1;
  // Reflect answered questions so the bar fills as you go.
  const value = ((index + (canProceed ? 1 : 0)) / total) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <ProgressHeader
          questionNumber={index + 1}
          total={total}
          category={question.category}
          value={value}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-heading text-sm leading-relaxed font-medium outline-none"
        >
          {question.prompt}
        </h2>

        {question.type === "mcq" ? (
          <McqQuestion
            question={question}
            answer={answer}
            onAnswer={onAnswerMcq}
          />
        ) : (
          <CodeQuestionView
            question={question}
            answer={answer}
            onReveal={onRevealCode}
            onSelfGrade={onSelfGrade}
          />
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="lg" onClick={onNext} disabled={!canProceed}>
          {isLast ? "See results" : "Next question"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}
