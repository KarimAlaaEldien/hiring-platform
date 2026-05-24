'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';

type Toast = {
  id: string;
  message: string;
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const handleNewApplication = (data: { jobTitle: string }) => {
      addToast(`New application received for ${data.jobTitle}!`);
    };

    const handleApplicationUpdate = (data: { jobTitle: string; status: string }) => {
      addToast(`Your application for ${data.jobTitle} was ${data.status.toLowerCase()}.`);
    };

    const handleCustomToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      if (customEvent.detail?.message) {
        addToast(customEvent.detail.message);
      }
    };

    const attachSocketListeners = () => {
      const socket = getSocket();
      if (!socket || socket.hasListeners('newApplication')) return;
      socket.on('newApplication', handleNewApplication);
      socket.on('applicationUpdate', handleApplicationUpdate);
    };

    attachSocketListeners();
    const interval = setInterval(attachSocketListeners, 500);
    window.addEventListener('showToast', handleCustomToast);

    return () => {
      const socket = getSocket();
      socket?.off('newApplication', handleNewApplication);
      socket?.off('applicationUpdate', handleApplicationUpdate);
      clearInterval(interval);
      window.removeEventListener('showToast', handleCustomToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-bg-surface border border-accent-main text-text-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-8"
          role="status"
        >
          <div className="h-2 w-2 bg-accent-main rounded-full animate-pulse" />
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
            className="ml-4 text-text-muted hover:text-text-primary"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
