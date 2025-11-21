import dotenv from "dotenv";
dotenv.config({ path: "users.env" });

import { createUserService } from "../services/users.service.js";
import { updateProfileByUserIdService } from "../services/profile.service.js";
import fs from "fs";

const dummyUsersWithProfiles = JSON.parse(fs.readFileSync("../../shared/data/dummy-data.json", "utf-8"));

export async function createDummyUsers() {
  try {
    const userPromises = dummyUsersWithProfiles.map(async (item) => {
      try {
        await createUserService(item.user);
        return { id: item.user.id, status: "user success" };
      } catch (error) {
        console.log(error);
        if (error.status === 409) {
          return { id: item.user.id, status: "user conflict" };
        }
        return { id: item.user.id, status: "user failed", error: error };
      }
    });

    const usersResults = await Promise.all(userPromises);
    console.log("All users processed!");
    console.log(usersResults);

    const profilePromises = dummyUsersWithProfiles.map(async (item) => {
      try {
        await updateProfileByUserIdService(item.user.id, item.profile);
        return { id: item.user.id, status: "profile success" };
      } catch (error) {
        console.log(error);
        return { id: item.user.id, status: "profile failed", error: error };
      }
    });

    const profilesResults = await Promise.all(profilePromises);
    console.log("All profiles processed!");
    console.log(profilesResults);

    process.exit(0);
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

createDummyUsers();
