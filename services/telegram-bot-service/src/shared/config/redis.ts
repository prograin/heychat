import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: ".telegram.env" });

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
});

export const publisher = redis.duplicate();
export const consumer = redis.duplicate();

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("ready", () => console.log("⚡ Redis ready"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

export default redis;
