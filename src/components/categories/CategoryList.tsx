import { useState } from "react";
import { Category } from "../../types";
import { useAppContext } from "../../context/AppContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { CategoryForm } from "./CategoryForm";
import { CategoryBadge } from "./CategoryBadge";

export function CategoryList() {
  const { categories, addCategory, removeCategory } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleAddCategory = async (name: string, color: string) => {
    await addCategory({ name, color });
    setIsFormOpen(false);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await removeCategory(id);
      setSelectedCategory(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Categories</h3>
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          +
        </Button>
      </div>

      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories yet</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <CategoryBadge category={cat} onClick={() => setSelectedCategory(cat)} />
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        title="Add Category"
        onClose={() => setIsFormOpen(false)}
      >
        <CategoryForm onSubmit={handleAddCategory} />
      </Modal>

      {selectedCategory && (
        <Modal
          isOpen={true}
          title={selectedCategory.name}
          onClose={() => setSelectedCategory(null)}
          onConfirm={() => handleDeleteCategory(selectedCategory.id)}
          confirmText="Delete"
          isDangerous={true}
        >
          <p>Are you sure you want to delete this category?</p>
        </Modal>
      )}
    </div>
  );
}
