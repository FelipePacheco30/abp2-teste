import React, { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface DataChartProps {
  table: string;
  filters?: Record<string, string>;
  xKey: string; // Ex: data_coleta
  yKey: string; // Ex: valor_medido
  type?: "line" | "bar";
}

const DataChart: React.FC<DataChartProps> = ({ table, filters = {}, xKey, yKey, type = "line" }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ ...filters });
    setLoading(true);

    fetch(`${API_URL}/api/data/${table}?${params.toString()}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [table, filters]);

  if (loading) return <p>📊 Carregando gráfico...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;
  if (data.length === 0) return <p>Sem dados para exibir.</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      {type === "line" ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yKey} stroke="#0077ff" />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#00b894" />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default DataChart;
