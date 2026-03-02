import { Modal } from "../ui/Modal";
import { TaskForm } from "./TaskForm";
import { TaskWithCategory } from "../../types";

interface TaskModalProps {
  isOpen: boolean;
  task?: TaskWithCategory;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function TaskModal({
  isOpen,
  task,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={task ? "Edit Task" : "New Task"}
      onClose={onClose}
    >
      <TaskForm
        initialData={
          task
            ? {
                title: task.title,
                description: task.description || undefined,
                priority: task.priority,
                category_id: task.category_id || undefined,
                start_time: task.start_time || undefined,
                deadline: task.deadline || undefined,
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}
