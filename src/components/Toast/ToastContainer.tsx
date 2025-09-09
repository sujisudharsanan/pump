import React from 'react';
import { useToast } from '../../hooks/useToast';
import type { ToastType } from '../../contexts/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  const getToastStyles = (type: ToastType): string => {
    const baseStyles =
      'fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg ' +
      'border-l-4 p-4 mb-2 transition-all duration-300 ease-in-out transform';

    const typeStyles: Record<ToastType, string> = {
      success: 'border-green-500 text-green-800 bg-green-50',
      error: 'border-red-500 text-red-800 bg-red-50',
      warning: 'border-yellow-500 text-yellow-800 bg-yellow-50',
      info: 'border-blue-500 text-blue-800 bg-blue-50',
    };

    return `${baseStyles} ${typeStyles[type]}`;
  };

  const getIcon = (type: ToastType): string => {
    const icons: Record<ToastType, string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[type];
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index: number) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          style={{ top: `${16 + index * 80}px` }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 text-lg">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{toast.title}</h4>
              {toast.message && (
                <p className="text-sm mt-1 opacity-90">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => hideToast(toast.id)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
