export class InlineName {
  static in_random_chat_n = "Random Chat";
  static in_profile_n = "Profile";
  static in_coin_n = "Coin";
  static in_register_n = "Register";
  static in_edit_on_web_n = "Edit On Web";
  static in_edit_on_telegram_n = "Edit On Telegram";
  static in_edit_gender_on_telegram_n = "Edit Gender";
  static in_edit_firstname_on_telegram_n = "Edit Firstname";
  static in_edit_lastname_on_telegram_n = "Edit Lastname";
  static in_edit_age_on_telegram_n = "Edit Age";
  static in_edit_country_on_telegram_n = "Edit Country";
  static in_edit_state_on_telegram_n = "Edit State";
  static in_edit_city_on_telegram_n = "Edit City";
  static in_edit_career_on_telegram_n = "Edit Career";
  static in_edit_interests_on_telegram_n = "Edit Interests";
  static in_search_n = "Search";
  static in_search_boys_n = "Boys";
  static in_search_girls_n = "Girls";
  static in_search_same_country_n = "Same Country";
  static in_search_same_city_n = "Same City";
  static in_search_near_age_n = "Near Age";
  static in_search_near_location_n = "Near Location";
  static in_search_interests_n = "By Interests";
  static in_search_career_n = "By Career";
  static in_search_start_n = "Start Search";
  static in_search_next_page_n = "Next Page";
  static in_search_previous_page_n = "Previous Page";
  static in_chat_send_request_n = "Request To Chat";
  static in_contacts_list_n = "Contatcs";
  static in_blocks_list_n = "Blocks";
  static in_contact_add_n = "Add To Contact";
  static in_contact_remove_n = "Remove From Contact";
  static in_block_n = "Block";
  static in_unblock_n = "Unblock";
  static in_accept_request_n = "Accept";
  static in_decline_request_n = "Decline";
  static in_end_chat_n = "End";
  static in_cancel_n = "Cancel";
  static in_cancel_edit_profile_n = "Cancel Edit Profile";
}

export class InlineCallback {
  static in_random_chat_c = "RANDOMCHAT::";
  static in_profile_c = "PROFILE::me";
  static in_coin_c = "COIN::";
  static in_register_c = "REGISTER::";
  static in_edit_on_web_c = "PROFILE::editOnWeb";
  static in_edit_on_telegram_c = "PROFILE::editOnTelegram";
  static in_edit_gender_on_telegram_c = "PROFILE::gender::editOnTelegram";
  static in_edit_firstname_on_telegram_c = "PROFILE::first_name::editOnTelegram";
  static in_edit_lastname_on_telegram_c = "PROFILE::last_name::editOnTelegram";
  static in_edit_age_on_telegram_c = "PROFILE::age::editOnTelegram";
  static in_edit_country_on_telegram_c = "PROFILE::country::editOnTelegram";
  static in_edit_state_on_telegram_c = "PROFILE::state::editOnTelegram";
  static in_edit_city_on_telegram_c = "PROFILE::city::editOnTelegram";
  static in_edit_career_on_telegram_c = "PROFILE::career::editOnTelegram";
  static in_edit_interests_on_telegram_c = "PROFILE::interests::editOnTelegram";
  static in_search_c = "SEARCH::";
  static in_search_interests_c = 'SEARCH::{"field":"interests","op":"terms"}';
  static in_search_career_c = 'SEARCH::{"field":"career","op":"term"}';
  static in_search_boys_c = 'SEARCH::{"field":"gender","op":"term","value":"male"}';
  static in_search_girls_c = 'SEARCH::{"field":"gender","op":"term","value":"female"}';
  static in_search_same_country_c = 'SEARCH::{"field":"country","op":"term"}';
  static in_search_same_city_c = 'SEARCH::{"field":"city","op":"term"}';
  static in_search_near_age_c = 'SEARCH::{"field":"age","op":"range"}';
  static in_search_near_location_c = "SEARCH::location";
  static in_search_start_c = "SEARCH::start";
  static in_search_next_page_c = "SEARCH::nextpage";
  static in_search_previous_page_c = "SEARCH::previouspage";
  static in_chat_send_request_c = "CHAT::{userId}::send-request";
  static in_contacts_list_c = "RELATIONS::listContacts";
  static in_blocks_list_c = "RELATIONS::listBlocks";
  static in_contact_add_c = "RELATIONS::{userId}::addContact";
  static in_contact_remove_c = "RELATIONS::{userId}::removeContact";
  static in_block_c = "RELATIONS::{userId}::block";
  static in_unblock_c = "RELATIONS::{userId}::unblock";
  static in_accept_request_c = "CHAT::{userId}::acceptRequest";
  static in_decline_request_c = "CHAT::{userId}::declineRequest";
  static in_end_chat_c = "CHAT::{userId}::endChat";
  static in_cancel_c = "CANCEL::";
  static in_cancel_edit_profile_c = "CANCEL::cancelEditProfile";
}

export class InlineMeta {
  static in_search_interests_m = { value: "interests" };
  static in_search_career_m = { value: "career" };
  static in_search_boys_m = { value: "gender" };
  static in_search_girls_m = { value: "gender" };
  static in_search_same_country_m = { value: "country" };
  static in_search_same_city_m = { value: "city" };
  static in_search_near_age_m = { value: "age" };
  static in_search_near_location_m = { value: "location" };
  static in_search_start_m = { value: "start" };
}

export class InlineButton {
  static in_random_chat_b = {
    text: InlineName.in_random_chat_n,
    callback_data: InlineCallback.in_random_chat_c,
  };

  static in_profile_b = {
    text: InlineName.in_profile_n,
    callback_data: InlineCallback.in_profile_c,
  };

  static in_coin_b = {
    text: InlineName.in_coin_n,
    callback_data: InlineCallback.in_coin_c,
  };

  static in_register_b = {
    text: InlineName.in_register_n,
    callback_data: InlineCallback.in_register_c,
  };

  static in_edit_on_web_b = {
    text: InlineName.in_edit_on_web_n,
    callback_data: InlineCallback.in_edit_on_web_c,
    url: `http://${process.env.HOST_NAME}/user/profile`,
  };

  static in_edit_on_telegram_b = {
    text: InlineName.in_edit_on_telegram_n,
    callback_data: InlineCallback.in_edit_on_telegram_c,
  };

  static in_edit_firstname_on_telegram_b = {
    text: InlineName.in_edit_firstname_on_telegram_n,
    callback_data: InlineCallback.in_edit_firstname_on_telegram_c,
  };

  static in_edit_lastname_on_telegram_b = {
    text: InlineName.in_edit_lastname_on_telegram_n,
    callback_data: InlineCallback.in_edit_lastname_on_telegram_c,
  };

  static in_edit_gender_on_telegram_b = {
    text: InlineName.in_edit_gender_on_telegram_n,
    callback_data: InlineCallback.in_edit_gender_on_telegram_c,
  };

  static in_edit_age_on_telegram_b = {
    text: InlineName.in_edit_age_on_telegram_n,
    callback_data: InlineCallback.in_edit_age_on_telegram_c,
  };

  static in_edit_country_on_telegram_b = {
    text: InlineName.in_edit_country_on_telegram_n,
    callback_data: InlineCallback.in_edit_country_on_telegram_c,
  };

  static in_edit_state_on_telegram_b = {
    text: InlineName.in_edit_state_on_telegram_n,
    callback_data: InlineCallback.in_edit_state_on_telegram_c,
  };

  static in_edit_city_on_telegram_b = {
    text: InlineName.in_edit_city_on_telegram_n,
    callback_data: InlineCallback.in_edit_city_on_telegram_c,
  };

  static in_edit_career_on_telegram_b = {
    text: InlineName.in_edit_career_on_telegram_n,
    callback_data: InlineCallback.in_edit_career_on_telegram_c,
  };

  static in_edit_interests_on_telegram_b = {
    text: InlineName.in_edit_interests_on_telegram_n,
    callback_data: InlineCallback.in_edit_interests_on_telegram_c,
  };

  static in_search_b = {
    text: InlineName.in_search_n,
    callback_data: InlineCallback.in_search_c,
  };

  static in_search_interests_b = {
    text: InlineName.in_search_interests_n,
    callback_data: InlineCallback.in_search_interests_c,
    meta: InlineMeta.in_search_interests_m,
  };

  static in_search_career_b = {
    text: InlineName.in_search_career_n,
    callback_data: InlineCallback.in_search_career_c,
    meta: InlineMeta.in_search_career_m,
  };

  static in_search_boys_b = {
    text: InlineName.in_search_boys_n,
    callback_data: InlineCallback.in_search_boys_c,
    meta: InlineMeta.in_search_boys_m,
  };

  static in_search_girls_b = {
    text: InlineName.in_search_girls_n,
    callback_data: InlineCallback.in_search_girls_c,
    meta: InlineMeta.in_search_girls_m,
  };

  static in_search_same_country_b = {
    text: InlineName.in_search_same_country_n,
    callback_data: InlineCallback.in_search_same_country_c,
    meta: InlineMeta.in_search_same_country_m,
  };

  static in_search_same_city_b = {
    text: InlineName.in_search_same_city_n,
    callback_data: InlineCallback.in_search_same_city_c,
    meta: InlineMeta.in_search_same_city_m,
  };

  static in_search_start_b = {
    text: InlineName.in_search_start_n,
    callback_data: InlineCallback.in_search_start_c,
  };

  static in_search_next_page_b = {
    text: InlineName.in_search_next_page_n,
    callback_data: InlineCallback.in_search_next_page_c,
  };

  static in_search_previous_page_b = {
    text: InlineName.in_search_previous_page_n,
    callback_data: InlineCallback.in_search_previous_page_c,
  };

  static in_chat_send_request_b = {
    text: InlineName.in_chat_send_request_n,
    callback_data: InlineCallback.in_chat_send_request_c,
  };

  static in_contacts_list_b = {
    text: InlineName.in_contacts_list_n,
    callback_data: InlineCallback.in_contacts_list_c,
  };

  static in_contact_add_b = {
    text: InlineName.in_contact_add_n,
    callback_data: InlineCallback.in_contact_add_c,
  };

  static in_contact_remove_b = {
    text: InlineName.in_contact_remove_n,
    callback_data: InlineCallback.in_contact_remove_c,
  };

  static in_blocks_list_b = {
    text: InlineName.in_blocks_list_n,
    callback_data: InlineCallback.in_blocks_list_c,
  };

  static in_block_b = {
    text: InlineName.in_block_n,
    callback_data: InlineCallback.in_block_c,
  };

  static in_unblock_b = {
    text: InlineName.in_unblock_n,
    callback_data: InlineCallback.in_unblock_c,
  };

  static in_accept_request_b = {
    text: InlineName.in_accept_request_n,
    callback_data: InlineCallback.in_accept_request_c,
  };

  static in_decline_request_b = {
    text: InlineName.in_decline_request_n,
    callback_data: InlineCallback.in_decline_request_c,
  };

  static in_end_chat_b = {
    text: InlineName.in_end_chat_n,
    callback_data: InlineCallback.in_end_chat_c,
  };

  static in_cancel_b = {
    text: InlineName.in_cancel_n,
    callback_data: InlineCallback.in_cancel_c,
  };

  static in_cancel_edit_profile_b = {
    text: InlineName.in_cancel_edit_profile_n,
    callback_data: InlineCallback.in_cancel_edit_profile_c,
  };
}
