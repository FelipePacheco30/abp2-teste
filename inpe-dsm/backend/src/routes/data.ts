// backend/src/routes/data.ts (UPDATED)
import { Router } from "express";
import pool from "../db";

const router = Router();

router.post("/query", async (req, res) => {
  try {
    const payload = req.body || {};
    const table = String(payload.table || "").trim().toLowerCase();

    // support both `columns` or `measurements` (frontend may send either)
    const columnsRequested = Array.isArray(payload.columns)
      ? payload.columns.map(String)
      : Array.isArray(payload.measurements)
      ? payload.measurements.map(String)
      : null;

    // groupBy can be array/grouping keys
    const groupByRequested = Array.isArray(payload.groupBy) ? payload.groupBy.map(String) : [];

    // date column may be provided explicitly
    const dateColumnRequested = payload.dateColumn ? String(payload.dateColumn) : null;

    // filters: object where keys are column names and values are single or array
    const filters = payload.filters && typeof payload.filters === "object" ? payload.filters : {};

    const start = payload.start || payload.startDate || null;
    const end = payload.end || payload.endDate || null;
    const limit = Number(payload.limit) || 2000;
    const aggregate = String(payload.aggregate || "none").toLowerCase(); // avg|min|max|sum|none

    if (!table) return res.status(400).json({ error: "table é obrigatório" });
    if (!/^[a-z0-9_]+$/i.test(table)) return res.status(400).json({ error: "table inválida" });

    // buscar colunas válidas
    const colInfoQ = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
    `;
    const { rows: colRows } = await pool.query(colInfoQ, [table]);
    const validCols = colRows.map((r: any) => String(r.column_name));

    if (validCols.length === 0) return res.status(400).json({ error: "tabela não encontrada ou sem colunas" });

    // normalize and whitelist requested columns
    let selCols = validCols.slice();
    if (columnsRequested && columnsRequested.length > 0) {
      const normalized = columnsRequested.map(c => String(c));
      const requested = normalized.filter(c => validCols.includes(c));
      if (requested.length === 0) return res.status(400).json({ error: "nenhuma coluna válida solicitada" });
      selCols = requested;
    }

    // determine date column
    let dateCol = null;
    if (dateColumnRequested && validCols.includes(dateColumnRequested)) dateCol = dateColumnRequested;
    if (!dateCol) {
      const dateCandidates = validCols.filter(c => /^(data|data_medida|datamedida|date|datacoleta)/i.test(c));
      dateCol = dateCandidates.length > 0 ? dateCandidates[0] : null;
    }

    // if there is an aggregate operation and measurements, we will aggregate
    const aggFn = aggregate === "avg" ? "AVG" : aggregate === "min" ? "MIN" : aggregate === "max" ? "MAX" : aggregate === "sum" ? "SUM" : null;

    // validate groupBy requested
    const goodGroupBy = groupByRequested.filter(g => validCols.includes(g));

    // Build SELECT columns
    const selectParts: string[] = [];
    if (dateCol) selectParts.push(`"${dateCol}"::date as __date`);
    goodGroupBy.forEach(g => selectParts.push(`"${g}"`));

    const measurements = selCols.filter(c => !goodGroupBy.includes(c) && c !== dateCol);
    if (measurements.length === 0) return res.status(400).json({ error: "nenhuma medida válida encontrada (columns/measurements)" });

    if (aggFn) {
      measurements.forEach(m => selectParts.push(`${aggFn}("${m}")::float as "${m}"`));
    } else {
      measurements.forEach(m => selectParts.push(`"${m}"`));
    }

    // Build WHERE + params
    const whereParts: string[] = [];
    const params: any[] = [];

    if (start && end && dateCol) {
      params.push(start);
      params.push(end);
      whereParts.push(`"${dateCol}" BETWEEN $${params.length - 1} AND $${params.length}`);
    } else if (start && dateCol) {
      params.push(start);
      whereParts.push(`"${dateCol}" >= $${params.length}`);
    } else if (end && dateCol) {
      params.push(end);
      whereParts.push(`"${dateCol}" <= $${params.length}`);
    }

    // filters object
    for (const k of Object.keys(filters)) {
      const key = String(k);
      if (!validCols.includes(key)) continue;
      const value = filters[k];
      if (value === null || value === undefined || value === "") continue;

      if (Array.isArray(value)) {
        const vals = value.filter((v:any) => v !== null && v !== undefined && v !== "");
        if (vals.length === 0) continue;
        const placeholders = vals.map(() => {
          params.push(null);
          return `$${params.length}`;
        });
        for (let i = 0; i < vals.length; i++) params[params.length - vals.length + i] = vals[i];
        whereParts.push(`"${key}" IN (${placeholders.join(',')})`);
      } else {
        params.push(value);
        whereParts.push(`"${key}" = $${params.length}`);
      }
    }

    const selectClause = selectParts.join(", ");
    let sql = `SELECT ${selectClause} FROM "${table}"`;
    if (whereParts.length) sql += ` WHERE ${whereParts.join(" AND ")}`;

    // GROUP BY when aggregating
    if (aggFn) {
      const groupCols: string[] = [];
      if (dateCol) groupCols.push('__date');
      goodGroupBy.forEach(g => groupCols.push(`"${g}"`));
      if (groupCols.length) sql += ` GROUP BY ${groupCols.join(', ')}`;
    }

    const orderBy = dateCol ? 'ORDER BY __date ASC' : `ORDER BY "${selCols[0]}" ASC`;
    sql += ` ${orderBy} LIMIT ${Math.min(50000, Math.max(1, limit))}`;

    const { rows } = await pool.query(sql, params);
    return res.json({ rows });
  } catch (err) {
    console.error("Erro /api/data/query:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
