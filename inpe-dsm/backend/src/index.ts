import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🩺 Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ... suas rotas de dados aqui ...

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});



import pool from "./db";

// rota de teste
app.get("/api/data/:table", async (req, res) => {
  try {
    const { table } = req.params;
    const { limit, startDate, endDate, reservatorio, variavel } = req.query;

    let query = `SELECT * FROM ${table} WHERE 1=1`;
    const values: any[] = [];

    // Filtro por data (assumindo coluna "data_coleta")
    if (startDate && endDate) {
      values.push(startDate, endDate);
      query += ` AND data_coleta BETWEEN $${values.length - 1} AND $${values.length}`;
    }

    // Filtro por reservatório (assumindo coluna "reservatorio_id")
    if (reservatorio) {
      values.push(reservatorio);
      query += ` AND reservatorio_id = $${values.length}`;
    }

    // Filtro por variável (assumindo coluna "variavel" ou "parametro")
    if (variavel) {
      values.push(variavel);
      query += ` AND variavel = $${values.length}`;
    }

    // Limite
    const rowLimit = parseInt(limit as string) || 50;
    query += ` LIMIT ${rowLimit}`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro na consulta:", err);
    res.status(500).json({ error: "Erro na consulta ao banco" });
  }
});
