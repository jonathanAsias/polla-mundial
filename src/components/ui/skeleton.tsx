import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-dorado-copa/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
