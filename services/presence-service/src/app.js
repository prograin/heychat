import express from "express";
import { topLevelPresenceRouter, usersPresenceRouter } from "./routes/presence.route.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();
app.use(express.json());
app.use("/users/:userId", usersPresenceRouter);
app.use("/presence", topLevelPresenceRouter);
app.use(errorHandler);

export default app;
