import { CheckCircle, XCircle } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

/**
 * Correct/incorrect feedback with an explanation. Rendered inside a polite
 * live region so screen readers announce the outcome when it appears.
 * The icon + heading text means the state isn't conveyed by color alone.
 */
export function FeedbackPanel({
  correct,
  children,
}: {
  correct: boolean;
  children: React.ReactNode;
}) {
  const Icon = correct ? CheckCircle : XCircle;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex gap-2.5 border-l-2 p-3 text-xs leading-relaxed",
        correct
          ? "border-emerald-600 bg-emerald-600/10"
          : "border-destructive bg-destructive/10"
      )}
    >
      <Icon
        weight="fill"
        aria-hidden="true"
        className={cn(
          "mt-px size-4 shrink-0",
          correct
            ? "text-emerald-600 dark:text-emerald-500"
            : "text-destructive"
        )}
      />
      <div className="space-y-1">
        <p
          className={cn(
            "font-heading font-medium",
            correct
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-destructive"
          )}
        >
          {correct ? "Correct" : "Not quite"}
        </p>
        <p className="text-foreground/80">{children}</p>
      </div>
    </div>
  );
}
