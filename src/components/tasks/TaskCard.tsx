import { TaskWithCategory, TaskStatus } from "../../types";
import { PriorityBadge } from "../ui/PriorityBadge";
import { CategoryBadge } from "../categories/CategoryBadge";
import { format, parse } from "date-fns";

interface TaskCardProps {
  task: TaskWithCategory;
  onStatusChange?: (newStatus: TaskStatus) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const statuses: TaskStatus[] = ["todo", "inprogress", "done"];
  const currentStatusIndex = statuses.indexOf(task.status);

  const handleStatusClick = () => {
    const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length];
    onStatusChange?.(nextStatus);
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors: Record<TaskStatus, string> = {
      todo: "bg-gray-100 text-gray-800",
      inprogress: "bg-blue-100 text-blue-800",
      done: "bg-green-100 text-green-800",
    };
    return colors[status];
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return format(parse(dateStr, "yyyy-MM-dd", new Date()), "MMM d");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex-1">{task.title}</h3>
        <button
          onClick={handleStatusClick}
          className={`px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 ${getStatusColor(task.status)}`}
        >
          {task.status}
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <PriorityBadge priority={task.priority} />
        {task.category_name && task.category_color && (
          <CategoryBadge
            category={{
              id: task.category_id || 0,
              name: task.category_name,
              color: task.category_color,
              created_at: "",
              updated_at: "",
            }}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
        {task.start_time && (
          <div>
            <span className="font-medium">Start:</span> {formatDate(task.start_time)}
          </div>
        )}
        {task.deadline && (
          <div>
            <span className="font-medium">Due:</span> {formatDate(task.deadline)}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
