// backend/src/routes/meta.ts
import { Router } from "express";
import pool from "../db";

const router = Router();

/**
 * GET /api/meta/tables
 * lista todas as tabelas públicas ou filtra por topic (query param `topic`)
 */
router.get("/tables", async (req, res) => {
  try {
    const topic = String(req.query.topic || "").trim();

    let q = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;

    const params: any[] = [];
    if (topic) {
      q += ` AND table_name ILIKE $1`;
      params.push(`%${topic}%`);
    }

    q += ` ORDER BY table_name;`;

    const { rows } = await pool.query(q, params);
    return res.json(rows.map((r: any) => r.table_name));
  } catch (err) {
    console.error("meta/tables error", err);
    return res.status(500).json({ error: "Erro meta tables" });
  }
});

/**
 * GET /api/meta/columns?table=xxx
 * retorna colunas existentes da tabela (nome e tipo)
 */
router.get("/columns", async (req, res) => {
  try {
    const table = String(req.query.table || "").trim();
    if (!table) return res.status(400).json({ error: "table is required" });

    // validação básica do identificador
    if (!/^[a-z0-9_]+$/i.test(table)) return res.status(400).json({ error: "table inválida" });

    const q = `
      SELECT column_name, data_type, ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `;
    const { rows } = await pool.query(q, [table.toLowerCase()]);
    return res.json(rows);
  } catch (err) {
    console.error("meta/columns error", err);
    return res.status(500).json({ error: "Erro meta columns" });
  }
});

/**
 * GET /api/meta/distinct?table=xxx&column=yyy&limit=100
 * retorna valores distintos para coluna validada
 */
router.get("/distinct", async (req, res) => {
  try {
    const table = String(req.query.table || "").trim();
    const column = String(req.query.column || "").trim();
    const limit = Math.min(1000, Math.max(1, parseInt(String(req.query.limit || "100"), 10)));

    if (!table || !column) return res.status(400).json({ error: "table e column são obrigatórios" });

    if (!/^[a-z0-9_]+$/i.test(table) || !/^[a-z0-9_]+$/i.test(column)) {
      return res.status(400).json({ error: "table/column inválido" });
    }

    // confirma que a coluna existe na tabela
    const colCheckQ = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2
      LIMIT 1;
    `;
    const { rowCount } = await pool.query(colCheckQ, [table.toLowerCase(), column.toLowerCase()]);
    if (rowCount === 0) return res.status(400).json({ error: "coluna não encontrada na tabela" });

    // construímos o SQL dinamicamente porque identificadores não aceitam bind params.
    // Como já validamos table/column (regex + existence), é seguro interpolar com aspas.
    const sql = `SELECT DISTINCT "${column.toLowerCase()}" AS value FROM "${table.toLowerCase()}" WHERE "${column.toLowerCase()}" IS NOT NULL LIMIT $1;`;
    const { rows } = await pool.query(sql, [limit]);
    return res.json(rows.map((r: any) => r.value));
  } catch (err) {
    console.error("meta/distinct error", err);
    return res.status(500).json({ error: "Erro meta distinct" });
  }
});

export default router;
