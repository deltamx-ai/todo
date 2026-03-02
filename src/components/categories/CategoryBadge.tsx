import { Category } from "../../types";

interface CategoryBadgeProps {
  category: Category;
  onClick?: () => void;
  onDelete?: () => void;
}

export function CategoryBadge({
  category,
  onClick,
  onDelete,
}: CategoryBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white cursor-pointer hover:opacity-90"
      style={{ backgroundColor: category.color }}
      onClick={onClick}
    >
      {category.name}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1 hover:text-gray-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}
