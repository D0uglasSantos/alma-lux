// src/components/PhraseCard.jsx
import React from "react";
import { FiCopy, FiHeart } from "react-icons/fi";

export default function PhraseCard({
  phrase,
  onNew,
  onCopy,
  onFavorite,
  darkMode,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 w-full text-center text-gray-800 hover:shadow-lg transition-all duration-300">
      <p
        className="text-lg italic mb-4 text-gray-600"
      >
        Um lugar de calmaria e leitura
      </p>

      <div className="mb-6">
        <p className="text-2xl md:text-3xl mb-4 leading-relaxed">
          "{phrase.frase}"
        </p>
        <p
          className= "text-sm md:text-base text-gray-500"
        >
          - {phrase.autor}
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onNew}
          className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
            darkMode
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
          }`}
          aria-label="Nova frase"
        >
          Nova frase
        </button>

        <button
          onClick={onCopy}
          className={`p-2 rounded-lg flex items-center transition-colors ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          aria-label="Copiar frase"
        >
          <FiCopy size={20} />
        </button>

        <button
          onClick={onFavorite}
          className={`p-2 rounded-lg flex items-center transition-colors ${
            darkMode
              ? "hover:bg-gray-700 text-pink-400"
              : "hover:bg-gray-100 text-pink-500"
          }`}
          aria-label="Adicionar aos favoritos"
        >
          <FiHeart size={20} />
        </button>
      </div>
    </div>
  );
}
