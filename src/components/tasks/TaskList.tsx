import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { TaskWithCategory } from "../../types";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";

export function TaskList() {
  const { tasks, addTask, editTask, changeTaskStatus, removeTask, isLoading } =
    useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithCategory | undefined>();

  const handleCreateTask = async (data: any) => {
    await addTask(data);
    setIsModalOpen(false);
  };

  const handleEditTask = async (data: any) => {
    if (selectedTask) {
      await editTask(selectedTask.id, data);
      setSelectedTask(undefined);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await removeTask(id);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="✓"
          title="No tasks yet"
          description="Create your first task to get started"
          action={
            <Button onClick={() => setIsModalOpen(true)}>+ Create Task</Button>
          }
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(status) =>
                changeTaskStatus(task.id, status)
              }
              onEdit={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={selectedTask ? handleEditTask : handleCreateTask}
      />
    </div>
  );
}
