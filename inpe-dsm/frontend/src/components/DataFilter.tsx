import React, { useState } from "react";

interface Props {
  onFilter: (filters: Record<string, string>) => void;
}

const DataFilter: React.FC<Props> = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reservatorio, setReservatorio] = useState("");
  const [variavel, setVariavel] = useState("");

  const applyFilters = () => {
    onFilter({ startDate, endDate, reservatorio, variavel });
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>🔎 Filtros</h3>
      <label>
        Data inicial:{" "}
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <br />
      <label>
        Data final:{" "}
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      <br />
      <label>
        Reservatório:{" "}
        <input type="text" value={reservatorio} onChange={(e) => setReservatorio(e.target.value)} />
      </label>
      <br />
      <label>
        Variável:{" "}
        <input type="text" value={variavel} onChange={(e) => setVariavel(e.target.value)} />
      </label>
      <br />
      <button onClick={applyFilters}>Aplicar Filtros</button>
    </div>
  );
};

export default DataFilter;
