import { cn } from "@/lib/utils";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-lg",
};

export function UserAvatar({
  username,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={cn(
          "rounded-full object-cover ring-1 ring-dorado-copa/30",
          SIZE[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-verde-cancha/40 font-bold text-dorado-copa ring-1 ring-dorado-copa/20",
        SIZE[size],
        className
      )}
    >
      {username[0]?.toUpperCase() ?? "?"}
    </div>
  );
}
