import User from "./user.type";
export default interface BotResponse {
  user: User;
  callback?: {
    data: {
      parts: string[];
      raw: string;
    };
  };
}

export const botResponseDefault = {
  user: {
    exists: false,
    id: null,
    has_session: false,
    partner: {
      user_id: null,
      telegram_id: null,
      chat_id: null,
    },
    permissions: {
      search: [],
    },
  },
};
