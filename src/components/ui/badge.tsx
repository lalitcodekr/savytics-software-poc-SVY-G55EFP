import { cn, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/utils";
import type { Priority, Status } from "@/types";

interface BadgeProps {
  value: string;
  type: "status" | "priority";
  className?: string;
}

export function Badge({ value, type, className }: BadgeProps) {
  const colors =
    type === "status"
      ? STATUS_COLORS[value as Status]
      : PRIORITY_COLORS[value as Priority];
  const label =
    type === "status"
      ? STATUS_LABELS[value as Status]
      : PRIORITY_LABELS[value as Priority];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colors,
        className
      )}
    >
      {label}
    </span>
  );
}

