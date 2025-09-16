// frontend/src/App.tsx
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CardsGrid from "./components/CardsGrid";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import ModalQueryBuilder from "./components/ModalQueryBuilder";
import "./index.css";

function App() {
  const [selectedTables, setSelectedTables] = useState<string[] | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCardClick = (tables: string[], title: string) => {
    setSelectedTables(tables);
    setSelectedTitle(title);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTables(null);
    setSelectedTitle(null);
    setShowModal(false);
  };

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Hero />
        <CardsGrid onCardClick={handleCardClick} />
      </main>
      <Footer />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {showModal && selectedTables && selectedTitle && (
        <ModalQueryBuilder
          title={selectedTitle}
          tables={selectedTables}
          onClose={handleCloseModal}
          onToast={handleToast}
        />
      )}
    </div>
  );
}

export default App;
