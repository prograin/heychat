import { TelegramProfileEditData } from "./bot-telegram-profile-edit";
import User from "./user.type";
export default interface BotResponse {
  user: User;
  edit_profile: TelegramProfileEditData;
  callback?: {
    data: {
      parts: string[];
      raw: string;
    };
  };
}

export const botResponseDefault = {
  edit_profile: {
    isActive: false,
    field: null,
    value: null,
  },
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
