import { useState, FormEvent } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { DatePicker } from "../ui/DatePicker";
import { Button } from "../ui/Button";
import { useAppContext } from "../../context/AppContext";
import { TaskPriority } from "../../types";

interface TaskFormProps {
  initialData?: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category_id?: number;
    start_time?: string;
    deadline?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function TaskForm({
  initialData,
  onSubmit,
  isLoading = false,
}: TaskFormProps) {
  const { categories } = useAppContext();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || "Medium"
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.category_id?.toString() || ""
  );
  const [startTime, setStartTime] = useState(initialData?.start_time || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit({
      title,
      description,
      priority,
      category_id: categoryId ? parseInt(categoryId) : null,
      start_time: startTime || null,
      deadline: deadline || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        disabled={isLoading}
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description (optional)"
        disabled={isLoading}
        rows={3}
      />

      <Select
        label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        options={[
          { value: "Low", label: "Low" },
          { value: "Medium", label: "Medium" },
          { value: "High", label: "High" },
          { value: "Critical", label: "Critical" },
        ]}
        disabled={isLoading}
      />

      <Select
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={categories.map((cat) => ({
          value: cat.id.toString(),
          label: cat.name,
        }))}
        placeholder="No category"
        disabled={isLoading}
      />

      <DatePicker
        label="Start Date"
        value={startTime}
        onChange={(date) => setStartTime(date || "")}
        placeholder="Select start date"
      />

      <DatePicker
        label="Deadline"
        value={deadline}
        onChange={(date) => setDeadline(date || "")}
        placeholder="Select deadline"
      />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Task"}
      </Button>
    </form>
  );
}
