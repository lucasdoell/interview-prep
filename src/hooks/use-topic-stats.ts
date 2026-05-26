"use client";

import { useEffect, useState } from "react";

import { mergeTopicStats } from "@/lib/quiz/engine";
import type { AnswerRecord, Question, TopicStats } from "@/lib/quiz/types";

const STATS_KEY = "interview-prep:stats:v1";

/**
 * Accumulates per-topic performance across rounds in localStorage, so the app
 * can show which areas the user struggles with and offer focused practice.
 * SSR-safe (storage access only in effects/handlers).
 */
export function useTopicStats() {
  const [stats, setStats] = useState<TopicStats>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) setStats(JSON.parse(raw) as TopicStats);
    } catch {
      // Best-effort; start fresh if storage is unavailable/corrupt.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore quota/availability errors.
    }
  }, [stats, loaded]);

  function recordRound(
    questions: Question[],
    answers: Record<string, AnswerRecord>
  ) {
    setStats((prev) => mergeTopicStats(prev, questions, answers));
  }

  function resetStats() {
    setStats({});
  }

  return { stats, recordRound, resetStats };
}
