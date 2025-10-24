
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'destructive';
};

type ToastOptions = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

const toast = (options: ToastOptions) => {
  const newToast: Toast = {
    id: uuidv4(),
    variant: 'default',
    ...options,
  };
  toasts = [newToast, ...toasts];
  listeners.forEach(listener => listener(toasts));

  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== newToast.id);
    listeners.forEach(listener => listener(toasts));
  }, 5000);
};

export const useToast = () => {
  const [state, setState] = useState(toasts);

  useCallback(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter(listener => listener !== setState);
    };
  }, [setState]);

  return { toasts: state, toast };
};
