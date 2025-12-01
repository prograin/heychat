import { RedisStreamConsumer } from "./base.consumer.js";
import { REDIS_STREAMS, REDIS_EVENTS } from "../../../../../shared/constants/redis.js";
import { updateDocByIdService } from "../../services/documents.service.js";

const handleChat = async ({ event, userId, data }) => {
  switch (event) {
    case REDIS_EVENTS.chat.session.created:
      await updateDocByIdService("users", userId, { has_active_chat: true }, true);
      break;
    case REDIS_EVENTS.chat.session.updated:
      await updateDocByIdService("users", userId, data, true);
      break;
    default:
      console.warn("Unknown event:", event);
  }
};

export const chatConsumer = new RedisStreamConsumer({
  stream: REDIS_STREAMS.chat.session.name,
  group: "search-service-group",
  consumerName: `search-worker-${process.pid}`,
  handleMessage: handleChat,
});
