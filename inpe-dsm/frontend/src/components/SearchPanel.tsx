import React, { useState } from "react";

interface SearchPanelProps {
  onSearch: (params: {
    table: string;
    variable: string;
    startDate?: string;
    endDate?: string;
    site?: string;
    chartType: "table" | "line" | "bar";
  }) => void;
}

const tableOptions = [
  { value: "tbvariaveisfisicasquimicasdaagua", label: "Parâmetros físico-químicos da água" },
  { value: "tbnutrientessedimento", label: "Nutrientes no sedimento" },
  { value: "tbfluxocarbono", label: "Fluxo de carbono" },
  { value: "tbabioticosuperficie", label: "Fatores abióticos (superfície)" },
  { value: "tbbioticocoluna", label: "Fatores bióticos (coluna d’água)" },
];

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  const [table, setTable] = useState(tableOptions[0].value);
  const [variable, setVariable] = useState("valor");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState<"table" | "line" | "bar">("table");

  const handleSubmit = () => {
    onSearch({ table, variable, startDate, endDate, chartType });
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: 8, marginBottom: "2rem" }}>
      <h2>🔍 Buscar Dados Limnológicos</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Tema:</label>
        <select value={table} onChange={(e) => setTable(e.target.value)}>
          {tableOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Variável:</label>
        <input
          type="text"
          placeholder="Ex: temperatura, pH, OD..."
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Data inicial:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label> Data final:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Visualização:</label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value as any)}>
          <option value="table">📋 Tabela</option>
          <option value="line">📈 Gráfico de Linha</option>
          <option value="bar">📊 Gráfico de Barra</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Buscar</button>
    </div>
  );
};

export default SearchPanel;
