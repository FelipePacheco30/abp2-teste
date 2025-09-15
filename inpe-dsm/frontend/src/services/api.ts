export const API_URL = "http://localhost:4000";

export async function fetchData(table: string, limit = 10) {
  const response = await fetch(`${API_URL}/api/data/${table}?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar dados de ${table}`);
  }
  return response.json();
}
