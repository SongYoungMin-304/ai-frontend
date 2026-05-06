import React, { useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.classList.add('overflow-hidden');
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up"
      style={{ animationDuration: '200ms' }}
    >
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="card relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
          aria-label="닫기"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
        {title && (
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink-900">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
