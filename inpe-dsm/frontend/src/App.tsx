import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CardsGrid from "./components/CardsGrid";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Modal from "./components/Modal";

// 👇 copie exatamente o mesmo tipo usado em Modal
type DataRow = {
  category: string;
  region: string;
  source: string;
  type: string;
  value: number;
  date: string;
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<DataRow[]>([]); // ✅ agora tipado certo
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setResults([]); // depois aqui você joga os resultados reais da API
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setResults([]);
  };

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1">
        <Hero />
        <CardsGrid onCardClick={handleCardClick} />
      </main>
      <Footer />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {showModal && selectedCategory && (
        <Modal
          category={selectedCategory}
          results={results}
          onClose={handleCloseModal}
          onToast={handleToast}
        />
      )}
    </div>
  );
}

export default App;
