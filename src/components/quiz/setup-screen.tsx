"use client";

import { ArrowClockwise, Play, Target } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { rankTopicsByWeakness } from "@/lib/quiz/engine";
import { QUESTION_BANK } from "@/lib/quiz/questions";
import {
  CATEGORIES,
  CATEGORY_BLURBS,
  CATEGORY_LABELS,
  type Category,
  type QuizConfig,
  type QuizState,
  type TopicStats,
} from "@/lib/quiz/types";

const ROUND_SIZES = [8, 12, 16];

export function SetupScreen({
  savedSession,
  stats,
  onStart,
  onResume,
  onDismissResume,
  onResetStats,
}: {
  savedSession: QuizState | null;
  stats: TopicStats;
  onStart: (config: QuizConfig) => void;
  onResume: () => void;
  onDismissResume: () => void;
  onResetStats: () => void;
}) {
  const [selected, setSelected] = useState<Set<Category>>(
    () => new Set(CATEGORIES)
  );
  const [count, setCount] = useState(12);

  const countsByCategory = useMemo(() => {
    const counts = { react: 0, uiux: 0, a11y: 0 } as Record<Category, number>;
    for (const q of QUESTION_BANK) counts[q.category]++;
    return counts;
  }, []);

  const available = CATEGORIES.filter((c) => selected.has(c)).reduce(
    (sum, c) => sum + countsByCategory[c],
    0
  );
  const roundCount = Math.min(count, available);

  // Weak spots: topics with the lowest accuracy, once there's enough signal.
  const totalAnswered = useMemo(
    () => Object.values(stats).reduce((sum, t) => sum + t.total, 0),
    [stats]
  );
  const weakTopics = useMemo(
    () => rankTopicsByWeakness(stats, 2).slice(0, 3),
    [stats]
  );
  const showWeakSpots = totalAnswered >= 5 && weakTopics.length > 0;

  function toggle(category: Category) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function start() {
    if (selected.size === 0) return;
    onStart({ categories: [...selected], count });
  }

  function startWeakAreas() {
    onStart({
      categories: [...CATEGORIES],
      count,
      topics: weakTopics.map((t) => t.topic),
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {savedSession ? (
        <Card size="sm" className="ring-primary/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-heading text-xs font-medium">
                You have a quiz in progress
              </p>
              <p className="text-xs text-muted-foreground">
                Question {savedSession.index + 1} of{" "}
                {savedSession.questions.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={onResume}>
                <ArrowClockwise aria-hidden="true" />
                Resume
              </Button>
              <Button size="sm" variant="ghost" onClick={onDismissResume}>
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {showWeakSpots ? (
        <Card>
          <CardHeader>
            <CardTitle>Your weak spots</CardTitle>
            <CardDescription>
              Based on {totalAnswered} answered questions so far. Lowest
              accuracy first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {weakTopics.map((t) => {
              const pct = Math.round(t.accuracy * 100);
              return (
                <div key={t.topic} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{t.topic}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {pct}% · {t.correct}/{t.total}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    aria-label={`${t.topic}: ${pct} percent correct`}
                  />
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="justify-between gap-2">
            <Button onClick={startWeakAreas}>
              <Target weight="fill" aria-hidden="true" />
              Practice these topics
            </Button>
            <Button variant="ghost" size="sm" onClick={onResetStats}>
              Reset progress
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Build your practice round</CardTitle>
          <CardDescription>
            Pick the topics you want to drill. Each round pulls a fresh, random
            mix, so you can practice as many times as you like.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <fieldset className="space-y-2">
            <legend className="mb-2 font-heading text-xs font-medium">
              Topics
            </legend>
            <div className="grid gap-2">
              {CATEGORIES.map((category) => {
                const id = `cat-${category}`;
                const checked = selected.has(category);
                return (
                  <label
                    key={category}
                    htmlFor={id}
                    className="flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors hover:bg-muted/60 has-data-checked:border-primary/50 has-data-checked:bg-primary/5"
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={() => toggle(category)}
                      className="mt-0.5"
                    />
                    <span className="space-y-0.5">
                      <span className="block font-heading text-xs font-medium">
                        {CATEGORY_LABELS[category]}
                        <span className="ml-1.5 font-sans text-muted-foreground">
                          ({countsByCategory[category]} questions)
                        </span>
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {CATEGORY_BLURBS[category]}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-2 font-heading text-xs font-medium">
              Round length
            </legend>
            <div className="flex gap-2">
              {ROUND_SIZES.map((size) => (
                <Button
                  key={size}
                  type="button"
                  size="sm"
                  variant={count === size ? "default" : "outline"}
                  aria-pressed={count === size}
                  onClick={() => setCount(size)}
                >
                  {size} questions
                </Button>
              ))}
            </div>
          </fieldset>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2">
          <Button size="lg" onClick={start} disabled={selected.size === 0}>
            <Play weight="fill" aria-hidden="true" />
            {selected.size === 0
              ? "Select at least one topic"
              : `Start ${roundCount}-question round`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
