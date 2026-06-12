import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dorado-copa/20 bg-gris-estadio/60 px-6 py-12 text-center",
        className
      )}
    >
      {Icon && (
        <Icon className="mx-auto mb-4 h-10 w-10 text-dorado-copa/40" />
      )}
      <p className="font-display text-lg text-blanco-linea">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-blanco-linea/60">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
