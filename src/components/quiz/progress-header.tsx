import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CATEGORY_LABELS, type Category } from "@/lib/quiz/types";

export function ProgressHeader({
  questionNumber,
  total,
  category,
  value,
}: {
  questionNumber: number;
  total: number;
  category: Category;
  /** 0-100 completion percentage. */
  value: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground tabular-nums">
          Question {questionNumber} of {total}
        </span>
        <Badge variant="outline">{CATEGORY_LABELS[category]}</Badge>
      </div>
      <Progress
        value={value}
        aria-label={`Progress: question ${questionNumber} of ${total}`}
      />
    </div>
  );
}
