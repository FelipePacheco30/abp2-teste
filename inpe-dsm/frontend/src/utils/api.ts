// frontend/src/utils/api.ts
import { DataRow } from "./types";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchVariables(): Promise<any> {
  const res = await fetch(`${API_ROOT}/variables`);
  if (!res.ok) throw new Error("Erro ao buscar variáveis");
  return res.json();
}

export async function fetchData(table: string, column: string, start?: string, end?: string, reservatorio?: string): Promise<any[]> {
  const params = new URLSearchParams();
  params.set("table", table);
  params.set("column", column);
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  if (reservatorio) params.set("reservatorio", reservatorio);

  const res = await fetch(`${API_ROOT}/data/query?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro na API: ${res.status} ${text}`);
  }
  return res.json();
}
