import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CardsGrid from "./components/CardsGrid";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { DataRow } from "./utils/types";
import { fetchData } from "./utils/api";

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [results, setResults] = useState<DataRow[]>([]);

  const handleCardClick = async (category: string) => {
    try {
      setSelectedCategory(category);
      const data = await fetchData(category);
      setResults(data);
    } catch (err) {
      setToastMessage("Erro ao buscar dados do servidor.");
      console.error(err);
    }
  };

  return (
    <div className="data-management-system">
      <Header />
      <Hero />
      <CardsGrid onCardClick={handleCardClick} />
      <Footer />

      {selectedCategory && (
        <Modal
          category={selectedCategory}
          results={results}
          onClose={() => setSelectedCategory(null)}
          onToast={setToastMessage}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};

export default App;
