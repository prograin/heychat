import { InlineButton } from "src/bot/buttons/inline.button";

export const ma_profile_in = {
  inline_keyboard: [
    [InlineButton.in_edit_on_web_b],
    [InlineButton.in_edit_on_telegram_b],
    [InlineButton.in_contacts_list_b, InlineButton.in_blocks_list_b],
  ],
};

export const ma_profile_edit_on_telegram_in = {
  inline_keyboard: [
    [InlineButton.in_edit_firstname_on_telegram_b, InlineButton.in_edit_lastname_on_telegram_b],
    [InlineButton.in_edit_age_on_telegram_b, InlineButton.in_edit_gender_on_telegram_b],
    [InlineButton.in_edit_interests_on_telegram_b, InlineButton.in_edit_career_on_telegram_b],
    [InlineButton.in_edit_country_on_telegram_b, InlineButton.in_edit_state_on_telegram_b, InlineButton.in_edit_city_on_telegram_b],
  ],
};
