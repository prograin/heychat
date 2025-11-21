import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import start from "src/bot/modules/start/start.reply";
import search from "src/bot/modules/search/search-main.reply";
import profile from "src/bot/modules/profile/profile-main.reply";
import { CommandExpression } from "src/bot/buttons/command.button";
import { InlineCallback } from "../../bot/buttons/inline.button";
import { userButtonClickedInterceptor } from "src/bot/interceptor/user-button-clicked.interceptor";
import { fromValidateInterceptor } from "src/bot/interceptor/from-validate.interceptor";
import { authInterceptor } from "src/bot/interceptor/auth.interceptor";
import { userValidateInterceptor } from "src/bot/interceptor/user-validate.interceptor";
import { interceptorRunner } from "src/bot/interceptor/runner/interceptor-runner";
import { BotEvent } from "src/bot/types/bot-event.type";
import { userTokenValidateInterceptor } from "src/bot/interceptor/user-token-validate.interceptor";
import { splitCallbackDataInterceptor } from "../interceptor/split-callback-data.interceptor";
import { userPermissionsInterceptor } from "../interceptor/user-permissions.interceptor";
import { inlineButtonValidateInterceptor } from "../interceptor/inline-button-validator.interceptor";
import chat from "../modules/chat/chat-main.reply";
import relations from "../modules/relations/relations-main.reply";
import { KeyboardName } from "../buttons/keyboard.button";
import { userSessionInterceptor } from "../interceptor/user-session.interceptor";
import { noneCommandFilterInterceptor } from "../interceptor/none-command-filter.interceptor";
import { profileEditInterceptor } from "../interceptor/profile-edit.interceptor";
import { keyboard_description_text } from "../modules/start/start.text";
import { ma_main_ke } from "../modules/start/start.markup";

export class ManageHandlers {
  private bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
    this.commandHandler();
    this.messageHandler();
    this.callbackHandler();
  }

  // Command
  async commandHandler() {
    this.bot.onText(
      CommandExpression.c_start_exp,
      interceptorRunner(
        this.bot,
        [
          fromValidateInterceptor,
          userTokenValidateInterceptor,
          userValidateInterceptor,
          userSessionInterceptor,
          userButtonClickedInterceptor,
          profileEditInterceptor(true),
        ],
        start
      )
    );
    this.bot.onText(
      CommandExpression.c_username_exp,
      interceptorRunner(this.bot, [fromValidateInterceptor, authInterceptor, userButtonClickedInterceptor, profileEditInterceptor(true)], search)
    );
  }

  // All Message
  async messageHandler() {
    this.bot.on(
      "message",
      interceptorRunner(
        this.bot,
        [
          fromValidateInterceptor,
          noneCommandFilterInterceptor,
          authInterceptor,
          userButtonClickedInterceptor,
          userPermissionsInterceptor,
          userSessionInterceptor,
          profileEditInterceptor(false),
        ],
        async (bot, event: BotEvent, response) => {
          const message = event as Message;

          if (response.edit_profile.isActive) {
            await profile(this.bot, message, response);
            return;
          }

          if (response.user.has_session) {
            await chat(bot, message, response);
            return;
          }

          const text = message.text?.trim();
          if (!text) return;

          switch (text) {
            case KeyboardName.ke_cancel_edit_profile_n:
            case KeyboardName.ke_profile_n:
              await profile(this.bot, message, response);
              break;

            case KeyboardName.ke_search_n:
              await search(this.bot, message, response);
              break;

            case KeyboardName.ke_end_chat_n:
              await chat(this.bot, message, response);
              break;

            default:
              await bot.sendMessage(message.chat.id, keyboard_description_text, { reply_markup: ma_main_ke });
              break;
          }
        }
      )
    );
  }

  // Callback From InlineKeyaboard
  async callbackHandler() {
    this.bot.on(
      "callback_query",
      interceptorRunner(
        this.bot,
        [
          fromValidateInterceptor,
          authInterceptor,
          userButtonClickedInterceptor,
          splitCallbackDataInterceptor,
          userPermissionsInterceptor,
          inlineButtonValidateInterceptor,
          userSessionInterceptor,
          profileEditInterceptor(false),
        ],
        async (bot, event: BotEvent, response) => {
          const callbackQuery = event as CallbackQuery;

          const message = callbackQuery.message;
          const data = callbackQuery.data;
          const chatId = message?.chat.id;

          if (!chatId || !data) {
            return;
          }

          if (response.edit_profile.isActive) {
            await profile(this.bot, callbackQuery, response);
            return;
          }

          if (data.startsWith("CHAT::")) {
            await chat(bot, callbackQuery, response);
          } else if (data.startsWith("RELATIONS::")) {
            await relations(bot, callbackQuery, response);
          } else {
            switch (data) {
              case InlineCallback.in_cancel_edit_profile_c:
              case InlineCallback.in_edit_on_telegram_c:
              case InlineCallback.in_edit_age_on_telegram_c:
              case InlineCallback.in_edit_career_on_telegram_c:
              case InlineCallback.in_edit_city_on_telegram_c:
              case InlineCallback.in_edit_country_on_telegram_c:
              case InlineCallback.in_edit_state_on_telegram_c:
              case InlineCallback.in_edit_gender_on_telegram_c:
              case InlineCallback.in_edit_interests_on_telegram_c:
              case InlineCallback.in_edit_firstname_on_telegram_c:
              case InlineCallback.in_edit_lastname_on_telegram_c:
              case InlineCallback.in_edit_on_telegram_c:
              case InlineCallback.in_profile_c:
                await profile(this.bot, callbackQuery, response);
                break;

              case InlineCallback.in_random_chat_c:
                console.log("start search");
                break;

              case InlineCallback.in_search_c:
              case InlineCallback.in_search_start_c:
              case InlineCallback.in_search_boys_c:
              case InlineCallback.in_search_girls_c:
              case InlineCallback.in_search_career_c:
              case InlineCallback.in_search_interests_c:
              case InlineCallback.in_search_near_age_c:
              case InlineCallback.in_search_same_country_c:
              case InlineCallback.in_search_same_city_c:
              case InlineCallback.in_search_next_page_c:
              case InlineCallback.in_search_previous_page_c:
                await search(this.bot, callbackQuery, response);
                break;

              default:
                await bot.sendMessage(message.chat.id, keyboard_description_text, { reply_markup: ma_main_ke });
                break;
            }
          }
        }
      )
    );
  }
}
