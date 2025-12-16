import TelegramBot, { Message, CallbackQuery } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { TelegramSearchData } from "src/bot/types/bot-telgram-search-data.type";
import { getUserTelegramSearch, setUserTelegramSearch } from "./search.cache";
import searchBaseReply from "./search-base.reply";
import searchStartReply from "./search-start.reply";
import { CommandExpression } from "src/bot/buttons/command.button";
import searchProfileReply from "./search-profile.reply";
import { BotEvent } from "src/bot/types/bot-event.type";

const searchMainReplyMessage = async (
  bot: TelegramBot,
  message: Message,
  response: BotResponse,
  telegramSearchData: TelegramSearchData,
  searchPermission: object | null
) => {
  const usernameMatch = message.text?.match(CommandExpression.c_username_exp);

  if (usernameMatch) {
    await searchProfileReply(bot, message, response.user, usernameMatch[1]);
  } else {
    await searchBaseReply(bot, message, false, telegramSearchData, searchPermission);
    await setUserTelegramSearch(Number(response.user.id), Number(message.message_id), telegramSearchData);
  }
};

const searchMainReplyCallback = async (
  bot: TelegramBot,
  callbackQuery: CallbackQuery,
  response: BotResponse,
  telegramSearchData: TelegramSearchData,
  userProfile: object | null | undefined,
  searchPermission: object | null
) => {
  const callbackDataPart = response.callback!.data.parts;
  const callbackDataRaw = response.callback!.data.raw;

  const lastPart = callbackDataPart[callbackDataPart.length - 1];
  switch (lastPart) {
    case "":
      await searchBaseReply(bot, callbackQuery.message, false, telegramSearchData, searchPermission);
      await setUserTelegramSearch(Number(response.user.id), Number(callbackQuery.message?.message_id), telegramSearchData);
      break;

    case "nextpage":
      telegramSearchData.page++;
      await searchStartReply(bot, callbackQuery, telegramSearchData, userProfile);
      await setUserTelegramSearch(Number(response.user.id), Number(callbackQuery.message?.message_id), telegramSearchData);
      break;

    case "previouspage":
      telegramSearchData.page--;
      await searchStartReply(bot, callbackQuery, telegramSearchData, userProfile);
      await setUserTelegramSearch(Number(response.user.id), Number(callbackQuery.message?.message_id), telegramSearchData);
      break;

    case "start":
      await searchStartReply(bot, callbackQuery, telegramSearchData, userProfile);
      await setUserTelegramSearch(Number(response.user.id), Number(callbackQuery.message?.message_id), telegramSearchData);
      break;

    default:
      if (telegramSearchData.selected_fields?.includes(lastPart)) {
        telegramSearchData.selected_fields = telegramSearchData.selected_fields.filter((i: any) => i !== lastPart);
        telegramSearchData.selected_fields_raw = telegramSearchData.selected_fields_raw?.filter((i: any) => i !== callbackDataRaw);
      } else {
        telegramSearchData.selected_fields?.push(lastPart);
        telegramSearchData.selected_fields_raw.push(callbackDataRaw);
      }
      await setUserTelegramSearch(Number(response.user.id), Number(callbackQuery.message?.message_id), telegramSearchData);
      await searchBaseReply(bot, callbackQuery.message, true, telegramSearchData, searchPermission);
      break;
  }
};

export const searchMainReplyInit = async (bot: TelegramBot, event: BotEvent, response: BotResponse) => {
  try {
    const searchPermission = response.user.permissions.search;
    const userProfile = response.user.profile;
    const message_id = "data" in event ? event.message?.message_id : (event as Message).message_id!;

    let telegramSearchData: TelegramSearchData = (await getUserTelegramSearch(Number(response.user.id), Number(message_id))) as TelegramSearchData;

    if (!telegramSearchData) {
      telegramSearchData = {
        state: "search-base",
        action: null,
        page: 0,
        selected_fields: [],
        selected_fields_raw: [],
      };
    }

    if ("data" in event) {
      await searchMainReplyCallback(bot, event, response, telegramSearchData, userProfile, searchPermission);
    } else if ("text" in event) {
      await searchMainReplyMessage(bot, event, response, telegramSearchData, searchPermission);
    }
  } catch (error: any) {
    const chatId = "chat" in event ? event.chat.id : event.message?.chat.id;
    if (chatId) {
      await bot.sendMessage(chatId, error.response?.data?.message || "Something went wrong while processing your search. Please try again.");
    }

    if ("data" in event && "id" in event) {
      try {
        await bot.answerCallbackQuery(event.id, { text: "An error occurred.", show_alert: true });
      } catch (error) {}
    }
  }
};

export default searchMainReplyInit;
