import { CheckCircle, XCircle } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import type { AnswerRecord, MultipleChoiceQuestion } from "@/lib/quiz/types";

import { CodeDisplay } from "./code-display";
import { FeedbackPanel } from "./feedback-panel";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function McqQuestion({
  question,
  answer,
  onAnswer,
}: {
  question: MultipleChoiceQuestion;
  answer?: AnswerRecord;
  onAnswer: (optionId: string) => void;
}) {
  const answered = !!answer;

  return (
    <div className="flex flex-col gap-4">
      {question.code ? (
        <CodeDisplay code={question.code} label={question.codeLang} />
      ) : null}

      <ul className="flex flex-col gap-2" aria-label="Answer options">
        {question.options.map((option, i) => {
          const isSelected = answer?.selectedOptionId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;
          const showCorrect = answered && isCorrectOption;
          const showWrong = answered && isSelected && !isCorrectOption;

          return (
            <li key={option.id}>
              <button
                type="button"
                aria-disabled={answered}
                aria-pressed={isSelected}
                onClick={() => {
                  if (!answered) onAnswer(option.id);
                }}
                className={cn(
                  "flex w-full items-start gap-3 border p-3 text-left text-xs leading-relaxed transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                  !answered &&
                    "cursor-pointer border-border hover:border-foreground/30 hover:bg-muted/60",
                  showCorrect && "border-emerald-600/60 bg-emerald-600/10",
                  showWrong && "border-destructive/60 bg-destructive/10",
                  answered &&
                    !showCorrect &&
                    !showWrong &&
                    "border-border opacity-55"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center font-heading text-[0.7rem] font-medium",
                    showCorrect && "text-emerald-600 dark:text-emerald-500",
                    showWrong && "text-destructive",
                    !answered && "border border-border text-muted-foreground",
                    answered && !showCorrect && !showWrong &&
                      "border border-border text-muted-foreground"
                  )}
                >
                  {showCorrect ? (
                    <CheckCircle weight="fill" className="size-5" />
                  ) : showWrong ? (
                    <XCircle weight="fill" className="size-5" />
                  ) : (
                    LETTERS[i]
                  )}
                </span>

                <span className="flex-1 space-y-1.5 pt-0.5">
                  <span className="block">{option.text}</span>
                  {option.code ? (
                    <CodeDisplay code={option.code} className="mt-1" />
                  ) : null}
                  {showCorrect ? (
                    <span className="block text-[0.7rem] font-medium text-emerald-700 dark:text-emerald-400">
                      Correct answer
                    </span>
                  ) : null}
                  {showWrong ? (
                    <span className="block text-[0.7rem] font-medium text-destructive">
                      Your answer
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {answer ? (
        <FeedbackPanel correct={answer.isCorrect}>
          {question.explanation}
        </FeedbackPanel>
      ) : null}
    </div>
  );
}
