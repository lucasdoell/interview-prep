"use client";

import { useEffect, useState } from "react";

import type { QuizState } from "@/lib/quiz/types";

const STORAGE_KEY = "interview-prep:v1";

/**
 * Persists the quiz to localStorage so a refresh doesn't lose progress.
 * - On mount, reads any saved *active* session and exposes it as `savedSession`
 *   so the setup screen can offer "Resume".
 * - Saves active/results state on every change; clears storage at setup.
 *
 * All localStorage access is inside effects/handlers, so it is SSR-safe.
 */
export function useQuizPersistence(state: QuizState) {
  const [savedSession, setSavedSession] = useState<QuizState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QuizState;
        if (parsed?.phase === "active" && parsed.questions?.length > 0) {
          setSavedSession(parsed);
        }
      }
    } catch {
      // Ignore unavailable/corrupt storage — persistence is best-effort.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (state.phase === "setup") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Best-effort; ignore quota/availability errors.
    }
  }, [state, loaded]);

  function clearSaved() {
    setSavedSession(null);
  }

  return { savedSession, clearSaved };
}
