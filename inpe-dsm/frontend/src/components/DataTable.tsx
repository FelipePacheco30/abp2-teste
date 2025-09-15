import React, { useEffect, useState } from "react";
import { API_URL } from "../services/api";

interface DataTableProps {
  table: string;
  limit?: number;
  filters?: Record<string, string>;
}

const DataTable: React.FC<DataTableProps> = ({ table, limit = 10, filters = {} }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(limit), ...filters });
    setLoading(true);

    fetch(`${API_URL}/api/data/${table}?${params.toString()}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [table, limit, filters]);

  if (loading) return <p>⏳ Carregando dados...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;
  if (data.length === 0) return <p>Nenhum dado encontrado.</p>;

  const columns = Object.keys(data[0]);

  return (
    <table border={1} cellPadding={6} style={{ width: "100%", marginTop: "1rem" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col}>{String(row[col])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
