import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function SingleToast({ toast, onRemove }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`flex items-center ${colors[toast.type]} text-white px-6 py-3 rounded-lg shadow-lg mb-2 animate-slide-in`}
    >
      <span className="mr-2">{icons[toast.type]}</span>
      {toast.message}
    </div>
  );
}

interface ToasterProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toaster({ toasts, onRemove }: ToasterProps) {
  useEffect(() => {
    if (toasts.length > 0) {
      const oldestToast = toasts.reduce((oldest, current) => 
        current.createdAt < oldest.createdAt ? current : oldest
      );
      
      const timer = setTimeout(() => {
        onRemove(oldestToast.id);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts, onRemove]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}