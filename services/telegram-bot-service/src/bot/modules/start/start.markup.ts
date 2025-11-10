import { InlineButton } from "src/bot/buttons/inline.button";
import { KeyboardName } from "src/bot/buttons/keyboard.button";

export const ma_main_ke = {
  keyboard: [[{ text: KeyboardName.ke_profile_n }, { text: KeyboardName.ke_search_n }]],
};

export const ma_main_in = {
  inline_keyboard: [[InlineButton.in_profile_b, InlineButton.in_search_b]],
};
