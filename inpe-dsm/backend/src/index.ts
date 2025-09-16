import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import metaRoutes from "./routes/meta";
import dataRoutes from "./routes/data";
import pool from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/meta", metaRoutes);
app.use("/api/data", dataRoutes);

// 🩺 Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// rota de teste
app.get("/api/data/:table", async (req, res) => {
  try {
    const { table } = req.params;
    const { limit, startDate, endDate, reservatorio, variavel } = req.query;

    if (!/^[a-z0-9_]+$/i.test(table)) {
      return res.status(400).json({ error: "Nome de tabela inválido" });
    }

    let query = `SELECT * FROM ${table} WHERE 1=1`;
    const values: any[] = [];

    if (startDate && endDate) {
      values.push(startDate, endDate);
      query += ` AND data_coleta BETWEEN $${values.length - 1} AND $${values.length}`;
    }

    if (reservatorio) {
      values.push(reservatorio);
      query += ` AND reservatorio_id = $${values.length}`;
    }

    if (variavel) {
      values.push(variavel);
      query += ` AND variavel = $${values.length}`;
    }

    const rowLimit = parseInt(limit as string) || 50;
    query += ` LIMIT ${rowLimit}`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro na consulta:", err);
    res.status(500).json({ error: "Erro na consulta ao banco" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
