import dotenv from "dotenv";
dotenv.config({ path: ".telegram.env" });

if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
} else {
  require("tsconfig-paths/register");
}

import app from "./app";
import runBot from "./bot-entry";
import { userConsumer } from "./bot/event/consumers/user.consumer";

const startServer = async () => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 3003;

    // Events
    await userConsumer.init();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    runBot();
    console.log("Telegram bot started successfully");
  } catch (error) {
    console.error("Failed to start server or bot:", error);
    process.exit(1);
  }
};

startServer();
