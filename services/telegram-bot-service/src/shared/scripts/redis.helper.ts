import "module-alias/register";
import dotenv from "dotenv";

dotenv.config({ path: ".telegram.env" });

import redis from "../config/redis";

const flushCache = async () => {
  await redis.flushall();
};

const logKeys = async () => {
  const keys = await redis.keys("*");
  console.log("---------");
  console.log(keys);
};

const main = async () => {
  // await logKeys();
  await logKeys();
  process.exit(0);
};

flushCache();
