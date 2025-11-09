import { AdminAxiosInstance, UserAxiosInstance } from "src/shared/utils/axios.util";

export class ChatSelfService {
  static async getRequestByTarget(token: string, targetId: number) {
    const request = await UserAxiosInstance.get(`http://${process.env.API_URL}:3006/chat/requests/target/${targetId}`, {
      headers: { token: token },
      validateStatus: (status) => status < 500,
    });
    return request;
  }

  static async createRequest(token: string, senderId: number, recieverId: number) {
    const request = await UserAxiosInstance.post(
      `http://${process.env.API_URL}:3006/chat/requests`,
      { sender_user_id: senderId, reciever_user_id: recieverId, status: "pending" },
      {
        headers: { token: token },
        validateStatus: (status) => status < 500,
      }
    );
    return request;
  }

  static async updateRequest(token: string, senderId: number, recieverId: number, status: string) {
    const request = await UserAxiosInstance.post(
      `http://${process.env.API_URL}:3006/chat/requests`,
      { sender_user_id: senderId, reciever_user_id: recieverId, status },
      {
        headers: { token: token },
        validateStatus: (status) => status < 500,
      }
    );
    return request;
  }

  static async createSession(token: string, partner_id: number) {
    const request = await UserAxiosInstance.post(
      `http://${process.env.API_URL}:3006/chat/sessions/me`,
      { partner_id },
      { headers: { token: token } }
    );
    return request;
  }

  static async checkActiveSession(token: string) {
    const request = await UserAxiosInstance.get(`http://${process.env.API_URL}:3006/chat/sessions/check/active/me`, { headers: { token: token } });
    return request;
  }

  static async getActiveSession(token: string) {
    const request = await UserAxiosInstance.get(`http://${process.env.API_URL}:3006/chat/sessions/me?active=true`, { headers: { token: token } });
    return request;
  }

  static async updateSession(token: string, partner_id: number, status: string) {
    const request = await UserAxiosInstance.put(
      `http://${process.env.API_URL}:3006/chat/sessions/me`,
      { partner_id, status },
      { headers: { token: token } }
    );
    return request;
  }

  static checkUserActiveSession = async (token: string, userId: number) => {
    return await UserAxiosInstance.get(`http://${process.env.API_URL}:3006/users/${userId}/chat/sessions/check/active`, {
      headers: { token: token },
    });
  };
}
