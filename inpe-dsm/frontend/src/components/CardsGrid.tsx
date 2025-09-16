// frontend/src/components/CardsGrid.tsx
import React from "react";

type Props = {
  onCardClick: (tables: string[], title: string) => void;
};

// Defina aqui suas categorias/tópicos
export const categories = [
  {
    name: "Abióticos",
    key: "abioticos",
    tables: ["tbabioticocoluna", "tbabioticosuperficie"],
  },
  {
    name: "Bióticos",
    key: "bioticos",
    tables: ["tbbioticocoluna", "tbbioticosuperficie"],
  },
  {
    name: "Água & Sedimento",
    key: "agua_sedimento",
    tables: [
      "tbaguamateriaorganicasedimento",
      "tbconcentracaogasagua",
      "tbconcentracaogassedimento",
      "tbionsnaaguaintersticialdosedimento",
    ],
  },
  {
    name: "Fluxos & Gases",
    key: "fluxos_gases",
    tables: [
      "tbbolhas",
      "tbcamarasolo",
      "tbfluxobolhasinpe",
      "tbfluxocarbono",
      "tbfluxodifusivo",
      "tbfluxodifusivoinpe",
      "tbgasesembolhas",
      "tbdifusao",
      "tbdupladessorcaoagua",
    ],
  },
  {
    name: "Campo Medidas",
    key: "campo_medidas",
    tables: ["tbmedidacampocoluna", "tbmedidacamposuperficie"],
  },
  {
    name: "Parâmetros Físico-Químicos",
    key: "parametros_fisicoquimicos",
    tables: ["tbpfq", "tbtc", "tbvariaveisfisicasquimicasdaagua"],
  },
  {
    name: "Parâmetros Biológicos",
    key: "parametros_biologicos",
    tables: ["tbparametrosbiologicosfisicosagua", "tbnutrientessedimento", "tbcarbono"],
  },
  {
    name: "Localizações & Campanhas",
    key: "locais_campanhas",
    tables: ["tbinstituicao", "tbreservatorio", "tbcampanha", "tbsitio", "tbtabela", "tbcampanhaportabela"],
  },
  {
    name: "Equipamentos",
    key: "equipamentos",
    tables: ["tbhoriba"],
  },
];

const CardsGrid: React.FC<Props> = ({ onCardClick }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        padding: "16px",
      }}
    >
      {categories.map((cat) => (
        <div
          key={cat.key}
          onClick={() => onCardClick(cat.tables, cat.name)}
          style={{
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 24,
            textAlign: "center",
            backgroundColor: "#f8f8f8",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(-3px)";
            el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
          }}
        >
          <h4 style={{ margin: 0 }}>{cat.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default CardsGrid;
