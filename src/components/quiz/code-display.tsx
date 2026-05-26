import { cn } from "@/lib/utils";

/**
 * Read-only code snippet. Relies on the app's monospace base font for the
 * "editor" feel; no syntax-highlighting dependency.
 */
export function CodeDisplay({
  code,
  label,
  tone = "neutral",
  className,
}: {
  code: string;
  label?: string;
  tone?: "neutral" | "correct";
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-none border",
        tone === "correct"
          ? "border-emerald-600/40 bg-emerald-600/5"
          : "border-border bg-muted/40",
        className
      )}
    >
      {label ? (
        <figcaption
          className={cn(
            "border-b px-3 py-1 text-[0.65rem] font-medium tracking-wider uppercase",
            tone === "correct"
              ? "border-emerald-600/40 text-emerald-700 dark:text-emerald-400"
              : "border-border text-muted-foreground"
          )}
        >
          {label}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
