import React, { useState } from "react";
import { DataRow } from "../utils/types";
import { exportCSV, exportJSON } from "../utils/export";

interface Props {
  category: string;
  results: DataRow[];
  onClose: () => void;
  onToast: (msg: string) => void;
}

const Modal: React.FC<Props> = ({ category, results, onClose, onToast }) => {
  const [view, setView] = useState<"table" | "graph" | "map">("table");

  const handleExport = (format: "csv" | "json") => {
    if (format === "csv") {
      exportCSV(results, `${category}.csv`);
      onToast("Exportado como CSV!");
    } else {
      exportJSON(results, `${category}.json`);
      onToast("Exportado como JSON!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <nav className="breadcrumbs">
          Home &gt; Dados Ambientais &gt; {category}
        </nav>

        <aside className="filters-sidebar">
          <h4>Filtros</h4>
          <label>Período de Análise:</label>
          <input type="date" />
          <input type="date" />

          <label>Região Geográfica:</label>
          <select>
            <option>Sudeste</option>
            <option>Norte</option>
            <option>Nordeste</option>
            <option>Centro-Oeste</option>
            <option>Sul</option>
          </select>
        </aside>

        <main className="results-area">
          <div className="results-header">
            <h2>Resultados</h2>
            <div className="view-toggle">
              <button
                className={view === "table" ? "active" : ""}
                onClick={() => setView("table")}
              >
                Tabela
              </button>
              <button
                className={view === "graph" ? "active" : ""}
                onClick={() => setView("graph")}
              >
                Gráfico
              </button>
              <button
                className={view === "map" ? "active" : ""}
                onClick={() => setView("map")}
              >
                Mapa
              </button>
            </div>
          </div>

          {view === "table" && (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Região</th>
                  <th>Fonte</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.id}>
                    <td>{row.region}</td>
                    <td>{row.source}</td>
                    <td>{row.type}</td>
                    <td>{row.value}</td>
                    <td>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {view === "graph" && (
            <div className="graph-placeholder">[Gráfico interativo aqui]</div>
          )}

          {view === "map" && (
            <div className="map-placeholder">[Mapa interativo aqui]</div>
          )}

          <div className="export-buttons">
            <button onClick={() => handleExport("csv")}>Exportar CSV</button>
            <button onClick={() => handleExport("json")}>Exportar JSON</button>
            <button onClick={() => window.print()}>Exportar PDF</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Modal;
