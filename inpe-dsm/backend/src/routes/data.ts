import { Router } from "express";
import pool from "../db";
import { cacheGet, cacheSet } from "../cache";

const router = Router();

const allowedTables = [
  "tbvariaveisfisicasquimicasdaagua",
  "tbparametrosbiologicosfisicosagua",
  "tbconcentracaogasagua",
  "tbdifusao"
];

const allowedColumns: Record<string, string[]> = {
  tbvariaveisfisicasquimicasdaagua: ["ph","turbidez","oxigenio","clorofila","condutividade","temperatura_agua"],
  tbparametrosbiologicosfisicosagua: ["temp_ar","vento","radiacao","transparencia","nutrientes"],
  tbconcentracaogasagua: ["co2","ch4","n2o"],
  tbdifusao: ["valor"]
};

async function getDataFromDB(table:string, column:string, start?:string, end?:string, reservatorio?:string){
  let q = `SELECT date_trunc('day', v.datamedida) as dia, AVG(${column}) as media
           FROM ${table} v
           JOIN tbsitio s ON v.idsitio = s.idsitio
           WHERE ${column} IS NOT NULL`;
  const params:any[] = [];
  if (start){ q += ` AND v.datamedida >= $${params.length+1}`; params.push(start); }
  if (end){ q += ` AND v.datamedida <= $${params.length+1}`; params.push(end); }
  if (reservatorio){ q += ` AND s.idreservatorio = $${params.length+1}`; params.push(reservatorio); }
  q += ` GROUP BY dia ORDER BY dia`;
  const { rows } = await pool.query(q, params);
  return rows;
}

router.get("/query", async (req, res) => {
  try{
    const { table, column, start, end, reservatorio } = req.query as any;
    if(!table || !column) return res.status(400).json({ error: "table & column required" });
    if(!allowedTables.includes(table)) return res.status(400).json({ error: "Invalid table" });
    if(!allowedColumns[table].includes(column)) return res.status(400).json({ error: "Invalid column for table" });
    if(start && isNaN(Date.parse(start))) return res.status(400).json({ error: "Invalid start date" });
    if(end && isNaN(Date.parse(end))) return res.status(400).json({ error: "Invalid end date" });

    const cacheKey = `query:${table}:${column}:${start||'any'}:${end||'any'}:${reservatorio||'any'}`;
    const cached = await cacheGet(cacheKey);
    if(cached) return res.json(cached);

    const rows = await getDataFromDB(table, column, start, end, reservatorio);
    await cacheSet(cacheKey, rows, 3600);
    res.json(rows);
  }catch(e:any){
    console.error(e);
    res.status(500).json({ error: 'internal' });
  }
});

export default router;
