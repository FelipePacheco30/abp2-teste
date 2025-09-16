import { Router } from "express";
import { cacheDelPattern } from "../cache";
const router = Router();
router.post("/clear", async (_req,res)=>{
  try{ await cacheDelPattern('query:*'); res.json({ ok:true }); }
  catch(e:any){ console.error(e); res.status(500).json({ ok:false }); }
});
export default router;
