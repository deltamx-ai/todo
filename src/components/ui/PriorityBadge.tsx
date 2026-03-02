import { TaskPriority } from "../../types";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colorMap: Record<TaskPriority, string> = {
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colorMap[priority]}`}>
      {priority}
    </span>
  );
}
