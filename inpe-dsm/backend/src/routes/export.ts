import { Router } from "express";
import { cacheGet, cacheSet } from "../cache";
import pool from "../db";
const PDFDocument = require("pdfkit");

const router = Router();

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

router.get("/", async (req,res)=>{
  try{
    const { table, column, start, end, reservatorio, format } = req.query as any;
    if(!table || !column || !format) return res.status(400).json({ error: 'table, column, format required' });
    const rows = await getDataFromDB(table, column, start, end, reservatorio);
    if(format === 'json'){
      res.setHeader('Content-Disposition','attachment; filename=data.json');
      return res.json(rows);
    }
    if(format === 'csv'){
      const header = Object.keys(rows[0] || {}).join(',');
      const csv = [header, ...rows.map((r:any)=>Object.values(r).join(','))].join('\n');
      res.setHeader('Content-Type','text/csv');
      res.setHeader('Content-Disposition','attachment; filename=data.csv');
      return res.send(csv);
    }
    if(format === 'pdf'){
      const doc = new PDFDocument({ margin: 30 });
      res.setHeader('Content-Type','application/pdf');
      res.setHeader('Content-Disposition','attachment; filename=data.pdf');
      doc.fontSize(14).text(`Export ${table}.${column}`, { underline: true });
      doc.moveDown();
      rows.forEach((r:any)=> doc.fontSize(10).text(`${r.dia} — ${r.media}`));
      doc.end();
      doc.pipe(res);
      return;
    }
    res.status(400).json({ error: 'invalid format' });
  }catch(e:any){
    console.error(e);
    res.status(500).json({ error: 'export error' });
  }
});

export default router;
