
import { Router } from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import pool from "../db";
import { cacheDelPattern } from "../cache";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/upload", upload.single("file"), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({ error: 'no file' });
    const text = req.file.buffer.toString('utf8');
    const records = parse(text, { columns: true, skip_empty_lines: true, trim: true });
    // Here you must map the CSV rows to the correct table — for simplicity we return count
    // In production implement validation and insert logic
    // After successful insert:
    await cacheDelPattern('query:*');
    res.json({ message: 'uploaded, please implement insert logic in server' });
  }catch(e:any){
    console.error(e);
    res.status(500).json({ error: 'upload failed' });
  }
});

export default router;
