"use client";

import { Eye } from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AnswerRecord, CodeQuestion } from "@/lib/quiz/types";

import { CodeDisplay } from "./code-display";

export function CodeQuestionView({
  question,
  answer,
  onReveal,
  onSelfGrade,
}: {
  question: CodeQuestion;
  answer?: AnswerRecord;
  onReveal: (codeText: string) => void;
  onSelfGrade: (correct: boolean) => void;
}) {
  const revealed = !!answer?.revealed;
  const [draft, setDraft] = useState(question.starterCode ?? "");
  const submitted = revealed ? answer?.codeText ?? "" : draft;
  const fieldId = `code-answer-${question.id}`;

  return (
    <div className="flex flex-col gap-4">
      {question.code ? (
        <CodeDisplay code={question.code} label={question.codeLang} />
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor={fieldId}>Your fix</Label>
        <Textarea
          id={fieldId}
          value={submitted}
          readOnly={revealed}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          rows={4}
          className="font-mono"
          aria-describedby={`${fieldId}-help`}
          placeholder="Write the corrected code here…"
        />
        <p id={`${fieldId}-help`} className="text-[0.7rem] text-muted-foreground">
          Write your fix, then reveal the reference solution and grade yourself.
        </p>
      </div>

      {!revealed ? (
        <div>
          <Button type="button" variant="secondary" onClick={() => onReveal(draft)}>
            <Eye aria-hidden="true" />
            Reveal solution
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <CodeDisplay
            code={question.referenceSolution}
            label="Reference solution"
            tone="correct"
          />
          <div
            role="status"
            aria-live="polite"
            className="border-l-2 border-border bg-muted/40 p-3 text-xs leading-relaxed text-foreground/80"
          >
            {question.explanation}
          </div>

          <fieldset className="space-y-2">
            <legend className="font-heading text-xs font-medium">
              How did you do?
            </legend>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="lg"
                variant={
                  answer?.selfGraded && answer.isCorrect ? "default" : "outline"
                }
                aria-pressed={!!answer?.selfGraded && answer.isCorrect}
                onClick={() => onSelfGrade(true)}
                className={cn(
                  answer?.selfGraded &&
                    answer.isCorrect &&
                    "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600/90"
                )}
              >
                I got it right
              </Button>
              <Button
                type="button"
                size="lg"
                variant={
                  answer?.selfGraded && !answer.isCorrect ? "default" : "outline"
                }
                aria-pressed={!!answer?.selfGraded && !answer.isCorrect}
                onClick={() => onSelfGrade(false)}
              >
                I missed it
              </Button>
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
