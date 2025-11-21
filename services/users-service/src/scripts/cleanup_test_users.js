import dotenv from "dotenv";
dotenv.config({ path: "users.env" });

import { deleteUserService } from "../services/users.service.js";
import fs from "fs";

const dummyUsersWithProfiles = JSON.parse(fs.readFileSync("../../shared/data/dummy-data.json", "utf-8"));

export async function removeDummyUsers() {
  try {
    const userPromises = dummyUsersWithProfiles.map(async (item) => {
      try {
        await deleteUserService(item.user.id);
      } catch (err) {
        console.error(`Error removing user ${item.user.id}:`, err);
        return { id: item.user.id, status: "failed", error: err };
      }
    });

    const results = await Promise.all(userPromises);

    console.log("All dummy users processed!");
    console.log(results);
    process.exit();
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

removeDummyUsers();
