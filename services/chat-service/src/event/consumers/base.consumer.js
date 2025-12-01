import { consumer } from "../../config/redis.js";

export class RedisStreamConsumer {
  constructor({ stream, group, consumerName, handleMessage }) {
    this.stream = stream;
    this.group = group;
    this.consumer = consumerName || `consumer-${process.pid}`;
    this.handleMessage = handleMessage;
    this.running = true;
  }

  async init() {
    try {
      await consumer.xgroup("CREATE", this.stream, this.group, "$", "MKSTREAM");
    } catch (err) {
      if (!err.message.includes("BUSYGROUP")) throw err;
    }
    this.consumeLoop();
  }

  async consumeLoop() {
    while (this.running) {
      try {
        const [nextId, pendingMessages] = await consumer.xautoclaim(this.stream, this.group, this.consumer, 60000, "0-0", "COUNT", 10);
        const messagesToProcess = pendingMessages || [];
        if (messagesToProcess.length) {
          await this.processMessages([[this.stream, messagesToProcess]]);
        }

        const newMessages = await consumer.xreadgroup("GROUP", this.group, this.consumer, "BLOCK", 1000, "COUNT", 50, "STREAMS", this.stream, ">");

        if (newMessages) {
          await this.processMessages(newMessages);
        }
      } catch (err) {
        console.error("Error consuming:", err);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  parseFields(fields) {
    const obj = {};
    for (let i = 0; i < fields.length; i += 2) obj[fields[i]] = fields[i + 1];
    if (obj.data) obj.data = JSON.parse(obj.data);
    return obj;
  }

  // REVIEW
  // messages : [ [ 'user:profile', [ [Array] ] ] ]
  // -----------------------------------
  // entries : [["1759662911021-0", ["event", "USER_PROFILE_UPDATED", "userId", "33", "data", '{"interests":["music","coding","sports","travel"]}']]];
  // -----------------------------------
  // fields : ['event','USER_PROFILE_UPDATED','userId','33','data', '{"interests":["music","coding","sports"]}']
  async processMessages(messages) {
    for (const [, entries] of messages) {
      for (const [id, fields] of entries) {
        const parsed = this.parseFields(fields);
        try {
          await this.handleMessage(parsed);
          await consumer.xack(this.stream, this.group, id);
        } catch (err) {
          console.error("Failed to process message:", id, err);
        }
      }
    }
  }

  async checkPending() {
    const pending = await consumer.xpending(this.stream, this.group, "-", "+", 10);
    for (const [id] of pending) {
      const entries = await consumer.xrange(this.stream, id, id);
      for (const [entryId, fields] of entries) {
        const parsed = this.parseFields(fields);
        await this.handleMessage(parsed);
        await consumer.xack(this.stream, this.group, entryId);
      }
    }
  }

  async shutdown() {
    this.running = false;
    await consumer.quit();
  }
}
