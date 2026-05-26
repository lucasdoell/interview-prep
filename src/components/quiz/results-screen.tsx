"use client";

import { ArrowCounterClockwise, CheckCircle, XCircle } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { computeResults, getMissedQuestions } from "@/lib/quiz/engine";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  type AnswerRecord,
  type Question,
} from "@/lib/quiz/types";

function remark(pct: number): string {
  if (pct === 100) return "Perfect round — you're interview-ready on these.";
  if (pct >= 80) return "Strong work. A little polish on the misses and you're set.";
  if (pct >= 60) return "Solid base. Review the misses below and run another round.";
  if (pct >= 40) return "Good start — the explanations below are where the gains are.";
  return "Early days. Read each explanation, then try another round.";
}

function optionText(question: Question, optionId?: string): string | null {
  if (question.type !== "mcq" || !optionId) return null;
  return question.options.find((o) => o.id === optionId)?.text ?? null;
}

export function ResultsScreen({
  questions,
  answers,
  onRetryMissed,
  onRestart,
}: {
  questions: Question[];
  answers: Record<string, AnswerRecord>;
  onRetryMissed: () => void;
  onRestart: () => void;
}) {
  const results = computeResults(questions, answers);
  const missedCount = getMissedQuestions(questions, answers).length;
  const pct = results.total
    ? Math.round((results.correct / results.total) * 100)
    : 0;

  return (
    <div className="flex w-full flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Round complete</CardTitle>
          <CardDescription>{remark(pct)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-heading text-3xl font-semibold tabular-nums">
                {results.correct}
                <span className="text-muted-foreground">/{results.total}</span>
              </p>
              <p className="text-xs text-muted-foreground">correct</p>
            </div>
            <p className="font-heading text-3xl font-semibold tabular-nums text-primary">
              {pct}%
            </p>
          </div>
          <Progress value={pct} aria-label={`Overall score ${pct} percent`} />

          <Separator />

          <div className="space-y-3">
            <h3 className="font-heading text-xs font-medium">By topic</h3>
            {CATEGORIES.filter((c) => results.byCategory[c]).map((category) => {
              const score = results.byCategory[category]!;
              const catPct = Math.round((score.correct / score.total) * 100);
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{CATEGORY_LABELS[category]}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {score.correct}/{score.total}
                    </span>
                  </div>
                  <Progress
                    value={catPct}
                    aria-label={`${CATEGORY_LABELS[category]}: ${score.correct} of ${score.total}`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {missedCount > 0 ? (
          <Button onClick={onRetryMissed} size="lg">
            <ArrowCounterClockwise aria-hidden="true" />
            Retry {missedCount} missed
          </Button>
        ) : null}
        <Button onClick={onRestart} size="lg" variant="outline">
          New round
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review</CardTitle>
          <CardDescription>
            Every question with the correct answer and why.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {questions.map((question, i) => {
            const answer = answers[question.id];
            const correct = answer?.isCorrect ?? false;
            const yourAnswer = optionText(question, answer?.selectedOptionId);
            const correctAnswer =
              question.type === "mcq"
                ? optionText(question, question.correctOptionId)
                : null;

            return (
              <div
                key={question.id}
                className="border border-border p-3 text-xs leading-relaxed"
              >
                <div className="flex items-start gap-2.5">
                  {correct ? (
                    <CheckCircle
                      weight="fill"
                      aria-hidden="true"
                      className="mt-px size-4 shrink-0 text-emerald-600 dark:text-emerald-500"
                    />
                  ) : (
                    <XCircle
                      weight="fill"
                      aria-hidden="true"
                      className="mt-px size-4 shrink-0 text-destructive"
                    />
                  )}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {CATEGORY_LABELS[question.category]}
                      </Badge>
                      <span className="text-[0.7rem] text-muted-foreground">
                        Q{i + 1} · {correct ? "Correct" : "Missed"}
                      </span>
                    </div>
                    <p className="font-medium">{question.prompt}</p>

                    {question.type === "mcq" ? (
                      <div className="space-y-0.5 text-muted-foreground">
                        {!correct && yourAnswer ? (
                          <p>
                            <span className="text-destructive">You: </span>
                            {yourAnswer}
                          </p>
                        ) : null}
                        <p>
                          <span className="text-emerald-700 dark:text-emerald-400">
                            Answer:{" "}
                          </span>
                          {correctAnswer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Self-assessed: {correct ? "got it right" : "missed it"}
                      </p>
                    )}

                    <p className="text-foreground/70">{question.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
