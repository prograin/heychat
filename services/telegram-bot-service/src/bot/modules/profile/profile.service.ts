import { AdminAxiosInstance, UserAxiosInstance } from "src/shared/utils/axios.util";

export class ProfileUserService {
  static async getProfile(token: string) {
    const profile = await UserAxiosInstance.get(`http://${process.env.API_URL}:3004/profiles/me`, {
      headers: { token: token },
      validateStatus: (status) => status < 500,
    });
    return profile;
  }

  static async getUserProfileByUserId(token: string, userId: number) {
    return await UserAxiosInstance.get(`http://${process.env.API_URL}:3004/users/${userId}/profile`, {
      headers: { token: token },
    });
  }

  static async getProfiles(token: string, userIds: string[]) {
    const profile = await UserAxiosInstance.get(`http://${process.env.API_URL}:3004/profiles`, {
      headers: { token: token },
      params: { userIds: userIds.join(",") },
      validateStatus: (status) => status < 500,
    });
    return profile;
  }

  static async updateProfile(token: string, data: Record<any, any>) {
    return await UserAxiosInstance.put("http://${process.env.API_URL}:3004/profiles/me", data, { headers: { token: token } });
  }
}

export class ProfileAdminService {
  static async getProfileByUsername(username: string) {
    const profile = await AdminAxiosInstance.get(`http://${process.env.API_URL}:3004/profiles/username/${username}`, {
      validateStatus: (status) => status < 500,
    });
    return profile;
  }
}
