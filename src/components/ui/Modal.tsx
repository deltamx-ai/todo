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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.25)" }}
      onClick={onClose}
    >
      <div
        className="bg-white/95 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] flex flex-col border border-gray-200/60"
        style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.8)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 pb-6 overflow-y-auto flex-1">{children}</div>
        {onConfirm && (
          <div className="px-6 py-4 flex gap-3 justify-end shrink-0">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant={isDangerous ? "danger" : "primary"} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
