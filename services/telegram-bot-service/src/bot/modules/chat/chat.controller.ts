import { ChatSelfService } from "src/bot/modules/chat/chat.service";

export class ChatSelfController {
  static getRequestByTarget = async (token: string, tagetId: number) => {
    try {
      const request = await ChatSelfService.getRequestByTarget(token, tagetId);
      if (request.status === 200) {
        return { error: false, request: request.data.request, status: 200 };
      } else if (request.status === 404) {
        return { error: true, status: 404 };
      } else {
        throw new Error(`❌ Unexpected response status when fetching request: ${request.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static createRequest = async (token: string, senderId: number, recieverId: number) => {
    try {
      const request = await ChatSelfService.createRequest(token, senderId, recieverId);
      if (request.status === 200) {
        return { error: false, request: request.data.request, status: 200 };
      } else if (request.status === 404) {
        return { error: true, status: 404 };
      } else {
        throw new Error(`❌ Unexpected response status when creating request: ${request.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  static updateRequest = async (token: string, senderId: number, recieverId: number, status: string) => {
    return await ChatSelfService.updateRequest(token, senderId, recieverId, status);
  };

  static createSession = async (token: string, partner_id: number) => {
    return await ChatSelfService.createSession(token, partner_id);
  };

  static checkActiveSession = async (token: string) => {
    return await ChatSelfService.checkActiveSession(token);
  };

  static getActiveSession = async (token: string) => {
    return await ChatSelfService.getActiveSession(token);
  };

  static updateSession = async (token: string, partner_id: number, status: string) => {
    return await ChatSelfService.updateSession(token, partner_id, status);
  };

  static checkUserActiveSession = async (token: string, user_id: number) => {
    return await ChatSelfService.checkUserActiveSession(token, user_id);
  };
}
