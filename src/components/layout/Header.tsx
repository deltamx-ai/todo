import { useAppContext } from "../../context/AppContext";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { filters, updateFilters, clearFilters } = useAppContext();

  return (
    <div className="border-b border-gray-200 bg-white p-4 md:p-6">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 text-gray-700 text-xl"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <Select
            value={filters.priority || "all"}
            onChange={(e) =>
              updateFilters({
                ...filters,
                priority: e.target.value === "all" ? undefined : (e.target.value as any),
              })
            }
            options={[
              { value: "all", label: "All Priorities" },
              { value: "Low", label: "Low" },
              { value: "Medium", label: "Medium" },
              { value: "High", label: "High" },
              { value: "Critical", label: "Critical" },
            ]}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ""}
            onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md flex-1 min-w-[120px] md:min-w-[200px]"
          />
        </div>
        {(filters.priority || filters.search) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
