// frontend/src/components/ModalQueryBuilder.tsx
import React, { useEffect, useState } from "react";
import { API_URL, fetchColumns, fetchTables } from "../utils/api";

type Props = {
  category: string; // chave do card (ex: "abioticos" ou "Abióticos")
  tables?: string[]; // optional: tables passed from parent
  onClose: () => void;
  onToast: (msg: string) => void;
};

type Column = { column_name: string; data_type: string };
type Row = Record<string, any>;

const detectDateColumn = (cols: Column[]) => {
  const patterns = [/^data/i, /^datamedida$/i, /^data_medida$/i, /^date/i, /^datainicio$/i, /^datafim$/i];
  for (const p of patterns) {
    const found = cols.find((c) => p.test(c.column_name));
    if (found) return found.column_name;
  }
  // fallback: any column of type 'date' or 'timestamp'
  const dateType = cols.find((c) => /date|timestamp|time/i.test(c.data_type));
  return dateType ? dateType.column_name : null;
};

const toCSV = (rows: Row[]) => {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const lines = [keys.join(",")];
  for (const r of rows) {
    const vals = keys.map((k) => {
      const v = r[k];
      if (v === null || v === undefined) return "";
      // escape quotes
      const s = String(v).replace(/"/g, '""');
      // wrap if comma/newline/quote
      return /,|\n|"/.test(s) ? `"${s}"` : s;
    });
    lines.push(vals.join(","));
  }
  return lines.join("\n");
};

const downloadFile = (content: BlobPart, filename: string, mime = "text/plain") => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const exportToCSV = (rows: Row[], filename = "export.csv") => {
  const csv = toCSV(rows);
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
};

const exportToJSON = (rows: Row[], filename = "export.json") => {
  downloadFile(JSON.stringify(rows, null, 2), filename, "application/json");
};

const exportToPDF = (rows: Row[], title = "Export") => {
  // Simple PDF via new window + print (user can Save as PDF)
  const html = `
  <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 12px; color:#111 }
        table { border-collapse: collapse; width: 100%; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
        th { background: #f2f2f2; }
      </style>
    </head>
    <body>
      <h3>${title}</h3>
      ${rows.length === 0 ? "<p>(Sem dados)</p>" : `
        <table>
          <thead>
            <tr>${Object.keys(rows[0]).map(k => `<th>${k}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${Object.keys(rows[0]).map(k => `<td>${String(r[k] ?? "")}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      `}
    </body>
  </html>
  `;
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    alert("Não foi possível abrir nova janela para gerar PDF. Permita pop-ups.");
    return;
  }
  w.document.write(html);
  w.document.close();
  // Delay para renderizar e abrir o print dialog
  setTimeout(() => {
    w.print();
  }, 400);
};

const ModalQueryBuilder: React.FC<Props> = ({ category, tables: tablesProp, onClose, onToast }) => {
  const [availableTables, setAvailableTables] = useState<string[]>(tablesProp ?? []);
  const [selectedTable, setSelectedTable] = useState<string>(tablesProp && tablesProp.length ? tablesProp[0] : "");
  const [columns, setColumns] = useState<Column[]>([]);
  const [dateColumn, setDateColumn] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingCols, setLoadingCols] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  // derive tables (use prop, local map, or backend)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (tablesProp && tablesProp.length) {
          setAvailableTables(tablesProp);
          setSelectedTable((prev) => prev || tablesProp[0]);
          return;
        }
        // try local mapping from cardMapping (optional)
        // import dynamically to avoid circular deps
        try {
          const mod = await import("../utils/cardMapping");
          const cards = mod.default as { id: string; title: string; tables: string[] }[];
          const local = cards.find(c => c.id.toLowerCase() === category.toLowerCase() || c.title.toLowerCase() === category.toLowerCase() || c.title.toLowerCase().includes(category.toLowerCase()));
          if (local && local.tables && local.tables.length) {
            if (!mounted) return;
            setAvailableTables(local.tables);
            setSelectedTable(local.tables[0]);
            return;
          }
        } catch {
          // ignore - mapping might not exist
        }

        // fallback: ask backend
        setLoadingTables(true);
        const backendTables = await fetch(`${API_URL}/api/meta/tables`).then(r => r.json());
        if (!mounted) return;
        // try to match tables that belong to category (heuristic)
        const matched = backendTables.filter((t: string) => t.toLowerCase().includes(category.toLowerCase().replace(/[^a-z0-9]/gi, "")));
        if (matched && matched.length) {
          setAvailableTables(matched);
          setSelectedTable(matched[0]);
        } else {
          // as fallback use some tables from mapping intersection
          setAvailableTables(backendTables);
          setSelectedTable(backendTables[0]);
        }
      } catch (err) {
        console.error("deriveTables error:", err);
        setError("Erro ao buscar tabelas.");
        onToast("Erro ao buscar tabelas.");
      } finally {
        setLoadingTables(false);
      }
    })();
    return () => { mounted = false; };
  }, [category, tablesProp, onToast]);

  // load columns when table selected
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!selectedTable) {
        setColumns([]);
        setDateColumn(null);
        return;
      }
      setLoadingCols(true);
      setError(null);
      try {
        const cols: Column[] = await fetch(`${API_URL}/api/meta/columns?table=${encodeURIComponent(selectedTable)}`).then(r => {
          if (!r.ok) throw new Error("Erro fetch columns");
          return r.json();
        });
        if (!mounted) return;
        setColumns(cols);
        // detect date column and set it
        const dcol = detectDateColumn(cols);
        setDateColumn(dcol);
        // reset measure selection
        setSelectedMeasures([]);
        setRows([]);
      } catch (err) {
        console.error("loadCols error:", err);
        setError("Erro ao carregar colunas");
        onToast("Erro ao carregar colunas");
      } finally {
        if (mounted) setLoadingCols(false);
      }
    })();
    return () => { mounted = false; };
  }, [selectedTable, onToast]);

  // helper: toggle measure selection
  const toggleMeasure = (col: string) => {
    setSelectedMeasures((prev) => (prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]));
  };

  // Run query and fetch data (for chart / export)
  const runQuery = async () => {
    if (!selectedTable) {
      onToast("Selecione uma tabela.");
      return;
    }
    if (!dateColumn) {
      onToast("Tabela sem coluna de data detectada. Selecione uma tabela com tempo.");
      return;
    }
    if (!startDate || !endDate) {
      onToast("Selecione início e fim do período.");
      return;
    }
    if (!selectedMeasures || selectedMeasures.length === 0) {
      onToast("Selecione ao menos uma coluna (medida) para visualizar.");
      return;
    }

    setLoadingData(true);
    setError(null);
    try {
      const payload = {
        table: selectedTable,
        columns: selectedMeasures,
        dateColumn: dateColumn,
        start: startDate,
        end: endDate,
        limit: 50000
      };
      const res = await fetch(`${API_URL}/api/data/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Erro na consulta");
      }
      const body = await res.json();
      const resultRows = body && Array.isArray(body.rows) ? body.rows : (Array.isArray(body) ? body : []);
      setRows(resultRows);
      if (!resultRows || resultRows.length === 0) {
        onToast("Consulta retornou 0 linhas.");
      } else {
        onToast(`Consulta retornou ${resultRows.length} linhas (preview disponível).`);
      }
    } catch (err: any) {
      console.error("runQuery error:", err);
      setError("Erro ao executar consulta.");
      onToast("Erro ao executar consulta.");
      setRows([]);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" role="dialog" aria-modal="true" aria-label={`Query Builder - ${category}`}>
        {/* header + export buttons */}
        <div className="modal-header" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <h2 style={{margin:0}}>{category}{selectedTable ? ` — ${selectedTable}` : ""}</h2>
            <div style={{fontSize: 12, color: "#666"}}>{selectedTable ? `${columns.length} colunas` : loadingTables ? "Carregando tabelas..." : ""}</div>
          </div>

          <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
            <button
              className="btn-export"
              onClick={() => {
                if (!rows || rows.length === 0) return onToast("Sem dados para exportar.");
                exportToCSV(rows, `${selectedTable || "export"}.csv`);
              }}
              title="Exportar CSV"
            >
              CSV
            </button>
            <button
              className="btn-export"
              onClick={() => {
                if (!rows || rows.length === 0) return onToast("Sem dados para exportar.");
                exportToJSON(rows, `${selectedTable || "export"}.json`);
              }}
              title="Exportar JSON"
            >
              JSON
            </button>
            <button
              className="btn-export"
              onClick={() => {
                if (!rows || rows.length === 0) return onToast("Sem dados para exportar.");
                exportToPDF(rows, `${selectedTable || "export"}`);
              }}
              title="Exportar PDF"
            >
              PDF
            </button>

            <button style={{marginLeft: 8}} onClick={onClose} aria-label="Fechar modal">✖</button>
          </div>
        </div>

        {/* body: table select, date range, column selection */}
        <div style={{display:"grid", gridTemplateColumns: "1fr 320px", gap: 16, marginTop: 12}}>
          <div>
            {/* table select */}
            <div style={{marginBottom:12}}>
              <label style={{display:"block", fontSize:12, marginBottom:6}}>Tabela</label>
              {loadingTables ? (
                <div>Carregando...</div>
              ) : (
                <select style={{width:"100%", padding:"8px"}} value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                  {availableTables.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
            </div>

            {/* date range */}
            <div style={{display:"flex", gap:8, marginBottom:12, alignItems:"center"}}>
              <div style={{flex:1}}>
                <label style={{display:"block", fontSize:12, marginBottom:6}}>Início</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{width:"100%", padding:8}}/>
              </div>
              <div style={{flex:1}}>
                <label style={{display:"block", fontSize:12, marginBottom:6}}>Fim</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{width:"100%", padding:8}}/>
              </div>
            </div>

            {/* columns visual (pgadmin-like): table with column name + type + checkbox */}
            <div style={{marginBottom:12}}>
              <label style={{display:"block", fontSize:12, marginBottom:6}}>Colunas (selecione medidas)</label>
              <div style={{border:"1px solid #e6e6e6", borderRadius:6, maxHeight:260, overflow:"auto"}}>
                <table style={{width:"100%", borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      <th style={{textAlign:"left", padding:"8px", borderBottom:"1px solid #eee"}}>Selecionar</th>
                      <th style={{textAlign:"left", padding:"8px", borderBottom:"1px solid #eee"}}>Coluna</th>
                      <th style={{textAlign:"left", padding:"8px", borderBottom:"1px solid #eee"}}>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCols ? (
                      <tr><td colSpan={3} style={{padding:12}}>Carregando colunas...</td></tr>
                    ) : columns.length === 0 ? (
                      <tr><td colSpan={3} style={{padding:12}}>Nenhuma coluna</td></tr>
                    ) : (
                      columns.map(c => {
                        const isDate = dateColumn === c.column_name;
                        const isNumeric = /float|double|numeric|real|int|decimal/i.test(c.data_type) || /^(profundidade|dic|nt|pt|clorofila|ch4|co2|toc|doc|tc)$/i.test(c.column_name);
                        return (
                          <tr key={c.column_name}>
                            <td style={{padding:8, borderBottom:"1px solid #f2f2f2"}}>
                              {/* if date column, disable selection */}
                              <input
                                type="checkbox"
                                disabled={isDate}
                                checked={selectedMeasures.includes(c.column_name)}
                                onChange={() => toggleMeasure(c.column_name)}
                                aria-label={`Selecionar ${c.column_name}`}
                              />
                            </td>
                            <td style={{padding:8, borderBottom:"1px solid #f2f2f2", fontFamily: "monospace"}}>{c.column_name} {isDate ? "(data)" : ""}</td>
                            <td style={{padding:8, borderBottom:"1px solid #f2f2f2"}}>{c.data_type} {isNumeric ? "•" : ""}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{display:"flex", gap:8, justifyContent:"flex-end"}}>
              <button onClick={runQuery} className="btn-primary" disabled={loadingData}>
                {loadingData ? "Executando..." : "Executar consulta"}
              </button>
            </div>
          </div>

          {/* right column: preview + info */}
          <div>
            <div style={{marginBottom:12}}>
              <label style={{display:"block", fontSize:12, marginBottom:6}}>Pré-visualização (primeiras 20 linhas)</label>
              <div style={{border:"1px solid #e6e6e6", borderRadius:6, padding:8, maxHeight:360, overflow:"auto", background:"#fafafa"}}>
                {rows.length === 0 ? (
                  <div style={{color:"#666", fontSize:13}}>Execute a consulta para ver o resultado aqui.</div>
                ) : (
                  <table style={{width:"100%", borderCollapse:"collapse", fontSize:12}}>
                    <thead>
                      <tr>
                        {Object.keys(rows[0]).map(k => <th key={k} style={{textAlign:"left", borderBottom:"1px solid #eee", padding:6, fontFamily:"monospace"}}>{k}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 20).map((r, i) => (
                        <tr key={i}>
                          {Object.keys(rows[0]).map(k => <td key={k} style={{padding:6, borderBottom:"1px solid #f7f7f7"}}>{String(r[k] ?? "")}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div style={{fontSize:12, color:"#666"}}>
              <div><strong>Coluna de data detectada:</strong> {dateColumn ?? "(não encontrada)"}</div>
              <div style={{marginTop:6}}><strong>Observação:</strong> selecione o responsável pelo dado (campanha/sítio/instituição) nos filtros se necessário antes de executar.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalQueryBuilder;
