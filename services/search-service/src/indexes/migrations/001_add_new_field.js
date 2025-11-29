import esClient from "../../config/elastic.js";

export async function migration001() {
  await esClient.indices.putMapping({
    index: "users",
    body: {
      properties: {
        has_active_chat: { type: "boolean" },
      },
    },
  });
}

migration001();
