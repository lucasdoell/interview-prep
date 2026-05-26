import { QuizApp } from "@/components/quiz/quiz-app";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3">
          <div className="space-y-0.5">
            <h1 className="font-heading text-sm font-semibold tracking-tight">
              <span className="text-primary">&lt;/&gt;</span> Frontend
              Interview Prep
            </h1>
            <p className="text-xs text-muted-foreground">
              React · UI/UX · Accessibility
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <QuizApp />
      </main>

      <footer className="border-t border-border">
        <p className="mx-auto w-full max-w-2xl px-4 py-3 text-xs text-muted-foreground">
          No sign-in required · your progress is saved on this device only.
        </p>
      </footer>
    </div>
  );
}
