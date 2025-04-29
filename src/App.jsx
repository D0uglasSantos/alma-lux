// src/App.jsx
import React, { useState, useEffect } from "react";
import phrasesData from "./data/frases.json";
import logo from "./assets/logo-alma-lux-bg-transparent.png";
import {
  FiTrash,
  FiSearch,
  FiShare2,
  FiHeart,
  FiBookmark,
  FiFilter,
} from "react-icons/fi";
import PhraseCard from "./components/PhraseCard";
import Toast from "./components/Toast";

// Categoriza frases (sem alterações aqui)
const categorizedPhrases = phrasesData.frases.map((phrase) => {
  let category = "geral";
  if (phrase.autor.includes(":")) category = "bíblica";
  if (phrase.autor.toLowerCase().includes("maria")) category = "maria";
  if (
    phrase.frase.toLowerCase().includes("deus") ||
    phrase.frase.toLowerCase().includes("senhor")
  )
    category = "fé";
  if (
    phrase.frase.toLowerCase().includes("coragem") ||
    phrase.frase.toLowerCase().includes("medo")
  )
    category = "encorajamento";

  return { ...phrase, category };
});

export default function App() {
  const [phrases] = useState(categorizedPhrases);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("home");
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [showCategories, setShowCategories] = useState(false);

  // Carrega favoritos
  useEffect(() => {
    const saved = localStorage.getItem("almaLuxFavorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Salva favoritos
  useEffect(() => {
    localStorage.setItem("almaLuxFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const generatePhrase = (category = "todas") => {
    const filtered =
      category === "todas"
        ? phrases
        : phrases.filter((p) => p.category === category);
    const idx = Math.floor(Math.random() * filtered.length);
    setCurrentIndex(phrases.indexOf(filtered[idx]));
  };

  const handleCopy = () => {
    const text = `"${phrases[currentIndex].frase}" - ${phrases[currentIndex].autor}`;
    navigator.clipboard.writeText(text).then(() => setFeedback("Copiado!"));
  };

  const handleFavorite = () => {
    const phrase = phrases[currentIndex];
    setFavorites((prev) => {
      if (!prev.some((p) => p.frase === phrase.frase)) {
        setFeedback("Adicionado aos favoritos!");
        return [...prev, phrase];
      }
      setFeedback("Já está nos favoritos");
      return prev;
    });
  };

  const handleRemoveFavorite = (i) => {
    setFavorites((prev) => prev.filter((_, idx) => idx !== i));
    setFeedback("Removido dos favoritos!");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Frase Alma Lux",
      text: `"${phrases[currentIndex].frase}" - ${phrases[currentIndex].autor}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.text);
        setFeedback("Link copiado!");
      }
    } catch {
      setFeedback("Erro ao compartilhar");
    }
  };

  const filteredFavorites = favorites.filter(
    (f) =>
      f.frase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.autor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["todas", ...new Set(phrases.map((p) => p.category))];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-6 bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-20 h-auto mr-2" />
          <h1 className="text-xl font-semibold hidden sm:block">Alma Lux</h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Removido toggle de dark mode */}
          <button
            onClick={() => setView(view === "home" ? "favorites" : "home")}
            className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
              view === "favorites" ? "text-pink-500" : ""
            }`}
            aria-label={
              view === "home" ? "Ver favoritos" : "Voltar para frases"
            }
          >
            <FiHeart
              size={20}
              fill={view === "favorites" ? "currentColor" : "none"}
            />
          </button>
        </div>
      </header>

      {feedback && <Toast message={feedback} onClose={() => setFeedback("")} />}

      {view === "home" ? (
        <div className="w-full max-w-2xl">
          {/* Filtro de categorias */}
          <div className="relative mb-4 flex justify-between items-center">
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center px-4 py-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <FiFilter className="mr-2" />
                <span>
                  {selectedCategory === "todas"
                    ? "Todas categorias"
                    : selectedCategory}
                </span>
              </button>
              {showCategories && (
                <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        generatePhrase(cat);
                        setShowCategories(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-indigo-50 text-gray-800 ${
                        selectedCategory === cat ? "bg-indigo-100" : ""
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Compartilhar"
            >
              <FiShare2 size={20} />
            </button>
          </div>

          <PhraseCard
            phrase={phrases[currentIndex]}
            onNew={() => generatePhrase(selectedCategory)}
            onCopy={handleCopy}
            onFavorite={handleFavorite}
            /* removido prop darkMode */
          />
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiBookmark className="mr-2" />
            Minhas Frases
          </h2>

          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredFavorites.length ? (
            <div className="space-y-4">
              {filteredFavorites.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow p-4 flex justify-between items-start hover:scale-[1.01] transition-transform"
                >
                  <div>
                    <p className="text-lg mb-1">"{item.frase}"</p>
                    <p className="text-sm text-gray-500">- {item.autor}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(idx)}
                    className="text-red-500 hover:text-red-700 ml-4 p-1 hover:bg-red-50 rounded"
                    aria-label="Remover"
                  >
                    <FiTrash />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FiHeart className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">
                {searchQuery
                  ? "Nenhum resultado"
                  : "Nenhuma frase favorita ainda."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setView("home")}
                  className="mt-4 px-4 py-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  Explorar
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
