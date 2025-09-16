// frontend/src/utils/api.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Fetch list of tables from backend.
 * Returns array of strings or throws.
 */
export async function fetchTables(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/meta/tables`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`fetchTables failed: ${txt || res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("fetchTables: response not array");
  return data;
}

/**
 * Fetch columns for a table
 */
export async function fetchColumns(table: string): Promise<{ column_name: string; data_type: string }[]> {
  if (!table) return [];
  const res = await fetch(`${API_URL}/api/meta/columns?table=${encodeURIComponent(table)}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`fetchColumns failed: ${txt || res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("fetchColumns: response not array");
  return data;
}

/**
 * Fetch distinct values for a column (helper used elsewhere)
 */
export async function fetchDistinct(table: string, column: string, limit = 200): Promise<any[]> {
  if (!table || !column) return [];
  const res = await fetch(`${API_URL}/api/meta/distinct?table=${encodeURIComponent(table)}&column=${encodeURIComponent(column)}&limit=${limit}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`fetchDistinct failed: ${txt || res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}
