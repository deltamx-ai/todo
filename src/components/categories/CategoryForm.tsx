import { useState, FormEvent } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface CategoryFormProps {
  initialName?: string;
  initialColor?: string;
  onSubmit: (name: string, color: string) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryForm({
  initialName = "",
  initialColor = "#000000",
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit(name, color);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
        disabled={isLoading}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-20 rounded cursor-pointer border border-gray-300"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-600">{color}</span>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
}
