import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { TaskList } from "./components/tasks/TaskList";
import { useAppContext } from "./context/AppContext";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { error } = useAppContext();

  return (
    <div className="flex h-screen bg-white">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded shadow-lg max-w-sm w-full mx-4 text-sm">
          {error}
        </div>
      )}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen((v) => !v)} />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
