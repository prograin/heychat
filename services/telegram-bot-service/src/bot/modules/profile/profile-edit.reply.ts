import TelegramBot, { Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { getUserTelegramProfileEdit, removeTelegramProfileEdit, setUserTelegramProfileEdit } from "./profile.cache";
import { TelegramProfileEditData } from "src/bot/types/bot-telegram-profile-edit";
import { editProfileFieldMessage } from "./profile.constants";
import { KeyboardName } from "src/bot/buttons/keyboard.button";
import { ma_profile_edit_on_telegram_in } from "./profile.markup";
import { ma_main_ke } from "../start/start.markup";
import { ProfileSelfController } from "./profile.controller";
import { profile_updated_text } from "./profile.text";

async function editProfile(bot: TelegramBot, message: Message, response: BotResponse) {
  const profile = response.user.profile as Record<any, any>;
  const userId = response.user.id;
  const token = response.user.token;
  const chatId = message.chat.id;

  let telegramProfileEditData = (await getUserTelegramProfileEdit(Number(response.user.id))) as TelegramProfileEditData;
  if (telegramProfileEditData && telegramProfileEditData.isActive) {
    const field = telegramProfileEditData.field;
    const value = message.text;

    if (field == "interests") {
      if (value == KeyboardName.ke_save_edit_profile_n) {
        await ProfileSelfController.updateProfile(String(token), { [String(field)]: telegramProfileEditData.value });
        await bot.sendMessage(chatId, `Your profile has been updated sucessfully.`, { reply_markup: ma_main_ke });
        await removeTelegramProfileEdit(Number(userId));
      } else {
        if (Array.isArray(telegramProfileEditData.value)) {
          telegramProfileEditData.value = telegramProfileEditData.value.includes(value)
            ? telegramProfileEditData.value.filter((i) => i !== value)
            : [...telegramProfileEditData.value, value];
        } else {
          telegramProfileEditData.value = [value];
        }

        await setUserTelegramProfileEdit(Number(userId), { ...telegramProfileEditData });
        const interestField = editProfileFieldMessage[field];
        const allInterests = interestField.arrange.dynamic_values.functionValues(telegramProfileEditData.value);
        const cols = interestField.arrange.column;
        const interestsKeyboards = [];

        for (let i = 0; i < allInterests.length; i += cols) {
          const row = allInterests.slice(i, i + cols).map((value) => ({
            text: value as string,
          }));
          interestsKeyboards.push(row);
        }

        interestsKeyboards.push([{ text: KeyboardName.ke_cancel_edit_profile_n }]);
        interestsKeyboards.push([{ text: KeyboardName.ke_save_edit_profile_n }]);
        await bot.sendMessage(chatId, `${value} was adedd to list`, { reply_markup: { keyboard: interestsKeyboards } });
      }
    } else {
      await ProfileSelfController.updateProfile(String(token), { [String(field)]: value });
      await bot.sendMessage(chatId, profile_updated_text, { reply_markup: ma_main_ke });
      await removeTelegramProfileEdit(Number(userId));
    }
    return;
  }

  // --------------------------------------

  const callbackDataPart = response.callback!.data.parts;
  const infoData = callbackDataPart[callbackDataPart.length - 2] || "";
  switch (infoData) {
    case "gender":
    case "first_name":
    case "last_name":
    case "age":
    case "country":
    case "state":
    case "city":
    case "career":
    case "interests":
      const field = editProfileFieldMessage[infoData];

      if ("arrange" in field) {
        let values = [];

        if ("dynamic_values" in field.arrange) {
          if ("need_arg" in field.arrange.dynamic_values) {
            const field_arg = field.arrange.dynamic_values.need_arg.field_arg;
            values = field.arrange.dynamic_values.functionValues(profile[field_arg] || null);
          } else {
            values = field.arrange.dynamic_values.functionValues();
          }

          if ("null_message" in field.arrange.dynamic_values && (values == null || values.length === 0)) {
            await bot.sendMessage(chatId, field.arrange.dynamic_values.null_message, { reply_markup: { keyboard: ma_main_ke.keyboard } });
            return;
          }
        } else {
          values = field.arrange.values;
        }

        const cols = field.arrange.column || 3;
        const keyboards = [];

        for (let i = 0; i < values.length; i += cols) {
          const row = values.slice(i, i + cols).map((value) => ({
            text: value as string,
          }));
          keyboards.push(row);
        }
        if ("has_save_keyboard" in field) {
          keyboards.push([{ text: KeyboardName.ke_save_edit_profile_n }]);
        }
        keyboards.push([{ text: KeyboardName.ke_cancel_edit_profile_n }]);

        await bot.sendMessage(chatId, field.message, { reply_markup: { keyboard: keyboards } });
      } else {
        await bot.sendMessage(chatId, field.message, { reply_markup: { inline_keyboard: field.buttons } });
      }

      await setUserTelegramProfileEdit(Number(userId), {
        field: infoData,
        isActive: true,
        value: "save_old_data" in field ? profile[infoData] : null,
      });
      break;

    default:
      await bot.sendMessage(chatId, "What do you want to edit?", { reply_markup: ma_profile_edit_on_telegram_in });
      break;
  }
}

export default editProfile;
