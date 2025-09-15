// frontend/src/components/CardsGrid.tsx
import React from "react";
import DataCard from "./DataCard";

const categories = [
  { id: "ph", title: "pH da Água", desc: "Qualidade aquática", icon: "🧪", table: "tbvariaveisfisicasquimicasdaagua", column: "ph" },
  { id: "clorofila", title: "Clorofila", desc: "Concentração de clorofila-a", icon: "🌿", table: "tbvariaveisfisicasquimicasdaagua", column: "clorofila" },
  { id: "turbidez", title: "Turbidez", desc: "Partículas em suspensão", icon: "💧", table: "tbvariaveisfisicasquimicasdaagua", column: "turbidez" },
  { id: "oxigenio", title: "Oxigênio Dissolvido", desc: "O₂ dissolvido", icon: "🫧", table: "tbvariaveisfisicasquimicasdaagua", column: "oxigenio" },
  { id: "co2", title: "CO₂", desc: "Dióxido de carbono dissolvido", icon: "🧪", table: "tbconcentracaogasagua", column: "co2" },
  { id: "ch4", title: "CH₄", desc: "Metano dissolvido", icon: "🔬", table: "tbconcentracaogasagua", column: "ch4" },
  { id: "difusao", title: "Difusão de Gases", desc: "Fluxo água→atmo", icon: "↔️", table: "tbdifusao", column: "valor" },
  { id: "temp_agua", title: "Temperatura da Água", desc: "Temperatura da coluna d'água", icon: "🌡️", table: "tbvariaveisfisicasquimicasdaagua", column: "temperatura_agua" }
];

interface Props {
  onCardClick: (table: string, column: string, title: string) => void;
}

const CardsGrid: React.FC<Props> = ({ onCardClick }) => (
  <section className="cards-grid">
    {categories.map(cat => (
      <DataCard
        key={cat.id}
        category={cat.id}
        title={cat.title}
        description={cat.desc}
        icon={cat.icon}
        onClick={() => onCardClick(cat.table, cat.column, cat.title)}
      />
    ))}
  </section>
);

export default CardsGrid;
