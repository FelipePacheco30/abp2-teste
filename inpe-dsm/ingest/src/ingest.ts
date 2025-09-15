// ingest/src/ingest.ts
import { execSync } from "child_process";
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const SQL_FILE = "/data/bd2dsm-copy-postgres-linux.sql"; // respeita a estrutura atual
const PSQL_CMD = `psql "${process.env.DATABASE_URL}" -f ${SQL_FILE}`;

async function run() {
  try {
    console.log("📥 Executando ingestão com:", SQL_FILE);
    execSync(PSQL_CMD, { stdio: "inherit" });
    console.log("✅ Dados carregados com sucesso.");

    if (process.env.REDIS_URL) {
      const redis = new Redis(process.env.REDIS_URL);
      await redis.flushall();
      await redis.quit();
      console.log("🧹 Cache Redis limpo.");
    } else {
      console.log("ℹ️ Redis não configurado, cache não limpo.");
    }

  } catch (e) {
    console.error("❌ Erro durante ingestão:", e);
    process.exit(1);
  }
}

run();
