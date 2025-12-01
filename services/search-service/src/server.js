import dotenv from "dotenv";
dotenv.config({ path: ".search.env" });

import { initIndexes } from "./indexes/indexManager.js";
import app from "./app.js";
import { profileConsumer } from "./event/consumers/profile.consumer.js";
import { syncUsersPresenceCacheJob } from "./jobs/users.job.js";
import { userConsumer } from "./event/consumers/user.consumer.js";
import { chatConsumer } from "./event/consumers/chat.consumer.js";

(async () => {
  try {
    //Init ElasticSearch
    await initIndexes();
    console.log("✅ Elasticsearch indexes initialized");

    //Consumer
    await profileConsumer.init();
    await userConsumer.init();
    await chatConsumer.init();

    //Jobs
    syncUsersPresenceCacheJob.start();

    //Start Server
    const port = process.env.PORT || 3005;
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start the server:", err);
    process.exit(1);
  }
})();
