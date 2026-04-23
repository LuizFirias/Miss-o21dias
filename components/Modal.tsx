import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'CONFIRMAR',
  cancelText = 'CANCELAR',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-vermelho rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-vermelho mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded transition-colors uppercase"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-vermelho hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition-colors uppercase"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
