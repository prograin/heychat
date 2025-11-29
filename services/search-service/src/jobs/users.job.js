import cron from "node-cron";
import { getUsersLastActive } from "../cache/users.cache.js";
import { bulkUpdateDocsService } from "../services/documents.service.js";

export const syncUsersPresenceCacheJob = cron.schedule("*/5 * * * * *", async () => {
  try {
    const users_last_active = await getUsersLastActive();
    if (!users_last_active || users_last_active.length === 0) {
      console.log("ℹ️ No active users to sync with Elasticsearch.");
      return;
    }

    await bulkUpdateDocsService("users", users_last_active);
    console.log("🔔 Successfully synced and updated elasticsearch");
  } catch (error) {
    console.log("❌ Failed to sync presence cache with elasticsearch:", error);
  }
});
