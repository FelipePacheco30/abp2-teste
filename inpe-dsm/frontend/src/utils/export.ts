import { DataRow } from "./types";

export function exportCSV(data: DataRow[], filename: string) {
  const csv = [
    ["Região", "Fonte", "Tipo", "Valor", "Data"],
    ...data.map((r) => [r.region, r.source, r.type, r.value, r.date])
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

export function exportJSON(data: DataRow[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
