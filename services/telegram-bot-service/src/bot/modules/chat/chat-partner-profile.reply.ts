import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { no_partner_exists } from "./chat.text";
import { ma_main_ke } from "../start/start.markup";
import { ProfileSelfController } from "../profile/profile.controller";
import { buildProfileChat } from "./chat.helper";

async function chatPartnerProfileReply(bot: TelegramBot, message: Message, response: BotResponse) {
  if (response.user.has_session) {
    let text = "<b>Your Partner Profile</b>\n\n";
    const partnerProfileResponse = await ProfileSelfController.getUserProfileByUserId(response.user.token!, Number(response.user.partner.user_id));
    text += buildProfileChat(partnerProfileResponse.data.profile);
    await bot.sendMessage(message.chat.id, text, { parse_mode: "HTML" });

    return;
  } else {
    await bot.sendMessage(message.chat.id, no_partner_exists, { reply_markup: { keyboard: ma_main_ke.keyboard } });
  }
}

export default chatPartnerProfileReply;
