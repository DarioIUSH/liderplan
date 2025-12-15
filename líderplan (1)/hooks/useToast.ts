import { useState, useCallback } from 'react';
import { Toast, ToastType } from '../components/Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      message,
      type,
      duration
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    addToast(message, 'success', 4000);
  }, [addToast]);

  const showError = useCallback((message: string) => {
    addToast(message, 'error', 5000);
  }, [addToast]);

  const showInfo = useCallback((message: string) => {
    addToast(message, 'info', 4000);
  }, [addToast]);

  const showWarning = useCallback((message: string) => {
    addToast(message, 'warning', 4000);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};
