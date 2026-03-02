import { useAppContext } from "../../context/AppContext";
import { CategoryList } from "../categories/CategoryList";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { filters, updateFilters } = useAppContext();

  const handleStatusClick = (status: string) => {
    updateFilters({ ...filters, status: status as any });
    onClose();
  };

  return (
    <div
      className={`
        fixed top-0 left-0 h-full z-40 w-64
        bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex md:flex-col md:shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <button
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        ✕
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tomo Plan</h1>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
        <div className="space-y-2">
          {["all", "todo", "inprogress", "done"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                filters.status === status
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <CategoryList />
      </div>
    </div>
  );
}
