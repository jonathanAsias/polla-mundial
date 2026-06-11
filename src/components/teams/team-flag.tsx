import { getFlagClass } from "@/lib/flags";
import { cn } from "@/lib/utils";

interface TeamFlagProps {
  code: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASS = {
  sm: "h-4 w-6 text-base",
  md: "h-6 w-9 text-xl",
  lg: "h-9 w-12 text-3xl",
  xl: "h-14 w-20 text-5xl",
};

export function TeamFlag({ code, size = "md", className }: TeamFlagProps) {
  const flagClass = getFlagClass(code);

  if (!flagClass || code === "TBD") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded bg-gris-estadio text-blanco-linea/40",
          SIZE_CLASS[size],
          className
        )}
        aria-hidden
      >
        ?
      </span>
    );
  }

  return (
    <span
      className={cn(
        "fi fis inline-block overflow-hidden rounded shadow-sm",
        flagClass,
        SIZE_CLASS[size],
        className
      )}
      role="img"
      aria-label={`Bandera ${code}`}
    />
  );
}
