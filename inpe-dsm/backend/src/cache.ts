/* 
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

export async function cacheGet(key:string){
  const v = await redis.get(key);
  return v ? JSON.parse(v) : null;
}
export async function cacheSet(key:string, value:any, ttl=3600){
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}
export async function cacheDelPattern(pattern:string){
  const keys = await redis.keys(pattern);
  if(keys.length) await redis.del(...keys);
}
export default redis;
*/