import { InlineButton } from "src/bot/buttons/inline.button";
import { GENDER_VALUES } from "../../../../../../shared/constants/genders";
import { CAREER_VALUES } from "../../../../../../shared/constants/careers";
import { INTEREST_VALUES } from "../../../../../../shared/constants/interests";
import { getCities, getCountries, getMapInterests, getStates } from "./profile.helper";
import { KeyboardName } from "src/bot/buttons/keyboard.button";

export const editProfileFieldMessage = {
  gender: {
    type_markup: "keyboard",
    arrange: {
      values: GENDER_VALUES,
      column: 2,
    },
    message: "Select your gender from under keyboard",
    buttons: [[InlineButton.in_cancel_edit_profile_b]],
  },
  first_name: {
    type_markup: "inline",
    message: "Enter your first name:",
    buttons: [[InlineButton.in_cancel_edit_profile_b]],
  },
  last_name: {
    type_markup: "inline",
    message: "Enter your last name:",
    buttons: [[InlineButton.in_cancel_edit_profile_b]],
  },
  age: {
    type_markup: "inline",
    message: "Enter yout age:",
    buttons: [[InlineButton.in_cancel_edit_profile_b]],
  },
  country: {
    type_markup: "keyboard",
    arrange: {
      dynamic_values: {
        functionValues: getCountries,
      },
      column: 3,
    },
    message: "Select your country from under keyboard",
  },
  state: {
    type_markup: "keyboard",
    arrange: {
      dynamic_values: {
        need_arg: {
          field_arg: "country",
        },
        functionValues: getStates,
        null_message: "At first select your country .",
      },
      column: 3,
    },
    message: "Select your state from under keyboard",
  },
  city: {
    type_markup: "keyboard",
    arrange: {
      dynamic_values: {
        need_arg: {
          field_arg: "state",
        },
        functionValues: getCities,
        null_message: "At first select your state .",
      },
      column: 3,
    },
    message: "Select your city from under keyboard",
  },
  career: {
    type_markup: "keyboard",
    arrange: {
      values: CAREER_VALUES,
      column: 2,
    },
    message: "Select your career from under keyboard",
  },
  interests: {
    type_markup: "keyboard",
    has_save_keyboard: true,
    save_old_data: true,
    arrange: {
      dynamic_values: {
        need_arg: {
          field_arg: "interests",
        },
        functionValues: getMapInterests,
      },
      column: 3,
    },
    message: "Select your interests from under keyboard",
  },
};
