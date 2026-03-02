import { ReactNode } from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children: ReactNode;
  isDangerous?: boolean;
}

export function Modal({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children,
  isDangerous = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end shrink-0">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant={isDangerous ? "danger" : "primary"}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
