// src/components/Toast.jsx
import React, { useEffect } from "react";
import { FiCheckCircle, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    if (message.includes("Copiado") || message.includes("Adicionado")) {
      return <FiCheckCircle className="text-green-500" />;
    }
    if (message.includes("Removido") || message.includes("Erro")) {
      return <FiAlertCircle className="text-red-500" />;
    }
    return <FiInfo className="text-blue-500" />;
  };

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 flex items-center p-4 bg-white rounded-lg shadow-lg border-l-4 border-green-500 min-w-[300px] animate-fadeInUp"
    >
      <div className="mr-3 text-xl">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium text-gray-800 ">
        {message}
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-500"
        aria-label="Fechar notificação"
      >
        <FiX />
      </button>
    </div>
  );
}